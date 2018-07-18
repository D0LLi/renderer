/**
 * Removes given DOM node from its tree
 * @param {Node} node
 */
export function removeNode(node) {
	const parent = node.parentNode;
	if (parent) {
		parent.removeChild(node);
	}
}

/**
 * Inserts `node` before `ref` node in document tree
 * @param {Node} node
 * @param {Node} ref
 * @return {Node} Inserted node
 */
export function insertBefore(node, ref) {
	return ref.parentNode.insertBefore(node, ref);
}

/**
 * Inserts `node` after given `ref` node
 * @param {Node} node
 * @param {Node} ref
 * @return {Node} Inserted node
 */
export function insertAfter(node, ref) {
	const next = ref.nextSibling;
	return next ? insertBefore(node, next) : ref.parentNode.appendChild(node);
}

/**
 * Inserts `node` before contents of given `block`
 * @param {Node} node
 * @param {Comment} block
 * @return {Node} Inserted node
 */
export function insertBeforeBlock(node, block) {
	const nodes = block.$cache.nodes;
	const target = nodes && nodes.length ? nodes[0] : block;

	insertBlockContentsBefore(node, target);
	return insertBefore(node, target);
}

/**
 * Inserts `node` after contents of given `block`
 * @param {Node} node
 * @param {Comment} block
 * @return {Node} Inserted node
 */
export function insertAfterBlock(node, block) {
	const result = insertAfter(node, block);
	insertBlockContentsBefore(node, node);
	return result;
}

function insertBlockContentsBefore(block, ref) {
	const nodes = block.$cache.nodes;
	nodes && nodes.forEach(n => insertBefore(n, ref));
}

/**
 * Copies all direct child nodes from given fragment into array
 * @param {DocumentFragment} fragment
 * @return {Array}
 */
export function copyFragment(fragment) {
	const result = [], nodes = fragment.childNodes;
	for (let i = 0; i < nodes.length; i++) {
		result.push(nodes[i]);
	}

	return result;
}

/**
 * Unmounts given block (removes its content from DOM)
 * @param {Comment} block
 */
export function unmount(block) {
	const { $cache } = block;
	$cache.nodes && $cache.nodes.forEach(removeNode);
	$cache.blocks && $cache.blocks.forEach(unmount);
	$cache.template = $cache.nodes = $cache.blocks
		= $cache.key = $cache.prev = $cache.parent = null;
}

/**
 * Mounts result of given `template` function as contents of `block`
 * @param {Comment} block
 * @param {Function} template
 * @param {RenderContext} ctx
 */
export function mount(block, template, ctx) {
	const result = template(ctx);
	const { $cache } = block;
	$cache.template = template;
	$cache.nodes = copyFragment(result);
	$cache.blocks = result.$blocks;
	insertBefore(result, block);
}
