import { removeNode } from './utils.js';
import createGetter from './getter.js';

export default class RenderContext {
	constructor() {
		this._beaconsMounted = true;
		this._blocks = [];
		this._pendingBlocks = [];
		this._ctxList = [];
		this._ctx = null;

		this._getter = createGetter();
		this.get = this._getter.get;
	}

	/**
	 * Iterates by given collection and invokes `fn` function with context of
	 * iterated item
	 * @param {Array | Set | Map} collection
	 * @param {Function} fn
	 */
	forEach(collection, fn) {
		if (collection && typeof collection.forEach === 'function') {
			collection.forEach((item, i) => {
				this._getter.push(item);
				fn(item, i, collection);
				this._getter.pop();
			});
		}
	}

	// Element factories, must be unbound from `this`!

	/**
	 * @returns {DocumentFragment}
	 */
	fragment() {
		const f = document.createDocumentFragment();
		// Hidden class optimization
		f.$blocks = null;
		return f;
	}

	/**
	 * Creates element with given name
	 * @param {String} name
	 * @returns {HTMLElement}
	 */
	element(name) {
		return document.createElement(name);
	}

	/**
	 * Creates element with given name and text value
	 * @param {String} name
	 * @param {String} value
	 * @returns {HTMLElement}
	 */
	elementWithText(name, value) {
		const elem = document.createElement(name);
		elem.textContent = value;
		return elem;
	}

	/**
	 * Creates text node with given content
	 * @param {String} value
	 * @return {Text}
	 */
	text(value) {
		return document.createTextNode(value);
	}

	/**
	 * Creates block
	 * @param {Function} data A function that should return block to render
	 */
	block(data) {
		return createBlock('block', data);
	}

	/**
	 * Creates iterator block
	 * @param {Function} iterate A function that must return iteratable collection
	 * @param {Function} block A function that must create block for each item in
	 * iterator. The contents of returned block will be rendered with each item
	 * from iterated collection
	 */
	iterator(iterate, block) {
		return createBlock('iterator', { iterate, block });
	}

	/**
	 * Creates keyed iterator block
	 * @param {Function} iterate A function that must return iteratable collection
	 * @param {Function} block A function that must create block for each item in
	 * iterator. The contents of returned block will be rendered with each item
	 * from iterated collection
	 * @param {Function} key A function which must return string key for each
	 * iterated item
	 */
	keyedIterator(iterate, block, key) {
		return createBlock('keyed-iterator', { iterate, block, key });
	}

	/**
	 * Marks given block as used in current render process
	 * @param {Comment} block
	 */
	use(block) {
		this._pendingBlocks.push(block);
	}

	willRender() {
		if (!this._beaconsMounted) {
			this._beaconsMounted = true;
			// NB mount in reverse order to properly restore beacon positions
			for (let i = this._blocks.length - 1; i >= 0; i--) {
				mountBlockBeacon(this._blocks[i]);
			}
		}
	}

	begin(ctx) {
		this._getter.push(ctx);
	}

	finalize() {
		this._getter.pop();
		if (this._beaconsMounted) {
			// Unmount block beacons
			this._beaconsMounted = false;
			this._pendingBlocks.forEach(unmountBlockBeacon);
		}

		// Switch block arrays and empty new pending blocks array:
		// it will reduce objects allocations
		const blocks = this._blocks;
		this._blocks = this._pendingBlocks;
		blocks.length = 0;
		this._pendingBlocks = blocks;
	}
}

/**
 * Unmounts given block beacon from DOM
 * @param {Comment} block
 */
function unmountBlockBeacon(block) {
	const { $cache } = block;
	$cache.parent = block.parentNode;
	$cache.next = block.nextSibling;
	removeNode(block);
}

/**
 * Mounts given block beacon back into DOM
 * @param {Comment} block
 */
function mountBlockBeacon(block) {
	const { $cache } = block;
	const { parent, next } = $cache;

	if (next) {
		parent.insertBefore(block, next);
	} else {
		parent.appendChild(block);
	}

	$cache.parent = $cache.next = null;
}

/**
 * Creates block with given name and data
 * @param {String} name
 * @param {Object | Function} data
 * @returns {Comment}
 */
function createBlock(name, data) {
	const c = document.createComment(name);
	c.$data = data;
	c.$cache = {
		key: null,
		template: null,
		nodes: null,
		blocks: null,
		next: null,
		parent: null
	};

	return c;
}
