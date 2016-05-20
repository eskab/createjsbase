import config from '../config.js';
import utils from '../modules/utils.js';
import Game from './Game.js';

/**
 * Preload class used for loading content
 */
export default class Preload {

	/**
	 * Calling init method
	 * @returns {object} Promise Preload promise
	 */
	constructor() {
		return new utils._Promise((resolve, reject) => {
			this.init(resolve);
		});
	}

	/**
	 * Sets up game loader.
	 * @param {object} Resolve Promise resolve
	 */
	init(resolve) {
		this.createTextLoader();

		this.loader = new createjs.LoadQueue(false);
		this.loader.on('error', this.handleFileError, this);
		this.loader.on('fileload', this.handleFileLoad, this);
		this.loader.on('progress', this.handleProgress.bind(this), this);
		this.loader.on('complete', this.handleComplete.bind(this, () => resolve()));
		this.loader.loadManifest(config.manifest);
	}

	/**
	 * Create graphic loader for manifest.
	 */
	createTextLoader() {
		this.graphicLoader = utils.drawTextShape(0, 0, config.canvas.width, config.canvas.height, '#fff', 'Loading', '#9b59b6');
			
		this.textLoader = this.graphicLoader.getChildByName('mainText');
		Game.STAGE.addChild(this.graphicLoader);
	}

	/**
	 * Handle errors from loader.
	 * @param {object} Event Error event.
	 */
	handleFileError(e) {
		console.warn('Error: ' + e.title);
		console.log(e);
	}

	/**
	 * Pushing loaded object to Game.IMAGES if file is image.
	 * @param {object} Event Loaded item event.
	 */
	handleFileLoad(e) {
		if (e.item.type === 'image') {
			Game.IMAGES[e.item.id] = e.result;
		}		
	}

	/**
	 * Shows loading progress.
	 */
	handleProgress() {
		let percent = Math.round(this.loader.progress * 100);

		console.log(`Loading ${percent} %`);
		this.textLoader.text = `Loading ${percent} %`;
	}

	/**
	 * Executing callback when loading is complete.
	 */
	handleComplete(cb) {
		cb();
	}

}