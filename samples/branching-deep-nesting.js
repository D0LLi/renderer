/* eslint-disable indent */

export default function template() {
	const f = fragment();
	const b = f.appendChild(block(cond0));

	return {
		f,
		b: [b]
	};
}

/**
 * @param {String} value
 * @returns {Text}
 */
function text(value) {
	return document.createTextNode(value);
}

let blockId = 0;

/**
 * @returns {Comment}
 */
function block(getter) {
	const c = document.createComment(`b${blockId++}`);
	c.$block = {
		getter,
		template: null,
		nodes: null,
		blocks: null,
		next: null,
		parent: null
	};
	return c;
}

function fragment() {
	return document.createDocumentFragment();
}

function cond0(get) {
	if (get('expr1')) {
		return block1;
	}
}

function cond1(get) {
	if (get('expr2')) {
		return block2;
	}
}

function cond2(get) {
	if (get('expr3')) {
		return block3;
	}
}

function block1() {
	const f = fragment();
	const b = f.appendChild(block(cond1));

	return {
		f,
		b: [b]
	};
}

function block2() {
	const f = fragment();
	const b = f.appendChild(block(cond2));

	return {
		f,
		b: [b]
	};
}

function block3() {
	const f = fragment();
	f.appendChild(text('test'));
	return { f };
}
