import { unmount, insertBeforeBlock, insertAfterBlock } from './utils.js';

/**
 * Renders keyed iterator block
 * @param {Comment} block
 * @param {RenderContext} ctx
 * @param {Function} render
 */
export default function renderKeyedIterator(block, ctx, render) {
	const { $cache, $data } = block;

	const blocks = $cache.blocks || [];
	const lookup = {}, nextKeysLookup = {};
	const items = $data.iterate(ctx.get);
	const keyFn = $data.key;
	const nextBlocks = [];
	const toUnmount = [];
	const nextKeys = [], prevKeys = [];

	// 1. Collect keys to be used
	ctx.forEach(items, () => {
		const key = String(keyFn(ctx.get));
		// Eliminate duplicated key items
		if (!(key in nextKeysLookup)) {
			nextKeys.push(key);
			nextKeysLookup[key] = true;
		}
	});

	blocks.forEach(b => {
		const key = b.$cache.key;
		if (key in nextKeysLookup) {
			prevKeys.push(key);
			lookup[key] = b;
		} else {
			toUnmount.push(b);
		}
	});

	// 2. Create order lookup to detect blocks reorder
	const prevOrderLookup = createOrderLookup(prevKeys);
	const nextOrderLookup = createOrderLookup(nextKeys);

	// 3. Reorder list
	const firstBlock = blocks.length ? blocks[0] : block;
	const attachedLookup = {};
	ctx.forEach(items, () => {
		const key = String(keyFn(ctx.get));
		let b = lookup[key];

		if (!b) {
			b = $data.block();
			b.$cache.key = key;
			lookup[key] = b;
		}

		// Do not reorder blocks with duplicated keys, just re-render them
		if (!(key in attachedLookup)) {
			attachedLookup[key] = true;
			const prevOrder = prevOrderLookup[key];
			const [prevKey, nextKey] = nextOrderLookup[key];

			if (!prevOrder || (prevOrder[0] !== prevKey && prevOrder[1] !== nextKey)) {
				// Block must be reordered or inserted
				ctx.willRender();

				if (nextKey !== null && nextKey in lookup) {
					insertBeforeBlock(b, lookup[nextKey]);
				} else if (prevKey !== null && prevKey in lookup) {
					insertAfterBlock(b, lookup[prevKey]);
				} else {
					// Must be first block
					insertBeforeBlock(b, firstBlock);
				}
			}

			nextBlocks.push(b);
		}

		render(b, ctx);
	});

	toUnmount.forEach(unmount);
	$cache.blocks = nextBlocks;
}

/**
 * Creates lookup used to detect item reorder
 * @param {Array} arr
 * @return {Object}
 */
function createOrderLookup(arr) {
	const lookup = {};

	for (let i = 0, maxIx = arr.length - 1; i <= maxIx; i++) {
		lookup[arr[i]] = [
			i > 0 ? arr[i - 1] : null,
			i < maxIx ? arr[i + 1] : null
		];

	}

	return lookup;
}
