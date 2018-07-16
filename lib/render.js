import RenderContext from './context.js';
import renderBlock from './block.js';
import renderIterator from './iterator.js';
import renderKeyedIterator from './keyed-iterator.js';

/**
 * @param {HTMLElement} elem
 * @param {Function} template
 */
export default function createRenderer(elem, template, state) {
	const ctx = new RenderContext();
	const _render = block => render(block, ctx);
	const update = () => result.$blocks && result.$blocks.forEach(_render);

	ctx.begin(state);
	const result = template(ctx);
	update();
	elem.appendChild(result);
	ctx.finalize();

	return state => {
		ctx.begin(state);
		update();
		ctx.finalize();
	};
}

/**
 * Renders given block
 * @param {Comment} block
 * @param {RenderContext} ctx
 */
function render(block, ctx) {
	ctx.use(block);
	const type = block.nodeValue;

	if (type === 'block') {
		renderBlock(block, ctx, render);
	} else if (type === 'iterator') {
		renderIterator(block, ctx, render);
	} else if (type === 'keyed-iterator') {
		renderKeyedIterator(block, ctx, render);
	}
}
