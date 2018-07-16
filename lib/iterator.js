import { unmount, insertBefore } from './utils.js';

/**
 * Renders iterator block
 * @param {Comment} block
 * @param {RenderContext} ctx
 * @param {Function} render
 */
export default function renderIterator(block, ctx, render) {
	const { $cache, $data } = block;
	// TODO reuse cached block array, no need to allocate new array on each
	// iterator cycle
	const blocks = [];
	const prevBlocks = $cache.blocks;
	const prevSize = prevBlocks ? prevBlocks.length : 0;
	const items = $data.iterate(ctx.get);
	let i = 0;

	ctx.forEach(items, () => {
		let b;
		if (i < prevSize) {
			b = prevBlocks[i];
		} else {
			ctx.willRender();
			b = $data.block();
			insertBefore(b, block);
		}

		render(b, ctx);
		blocks.push(b);
		i++;
	});

	// Remove extra blocks
	while (i < prevSize) {
		unmount(prevBlocks[i++]);
	}

	$cache.blocks = blocks;
}
