import { mount, unmount } from './utils.js';

/**
 * Renders plain block
 * @param {Comment} block
 * @param {RenderContext} ctx
 * @param {Function} render
 */
export default function renderBlock(block, ctx, render) {
	const { $cache } = block;
	const template = block.$data(ctx.get) || null;

	if (template !== $cache.template) {
		// Block contents updated, re-render it
		ctx.willRender();

		if ($cache.template) {
			unmount(block);
		}

		if (template) {
			mount(block, template, ctx);
		}
	}

	if ($cache.blocks) {
		for (let i = 0; i < $cache.blocks.length; i++) {
			render($cache.blocks[i], ctx);
		}
	}
}
