export default function template({ fragment, element, text, block }) {
	const f = fragment();

	f.appendChild(element('h1')).appendChild(text('Hello world'));
	const b = f.appendChild(block(cond0));
	f.$blocks = [b];

	return f;
}

function block0({ fragment, element, text, keyedIterator, block }) {
	const f = fragment();
	f.appendChild(element('p')).appendChild(text('will iterate'));
	const ul = f.appendChild(element('ul'));
	const b = ul.appendChild(keyedIterator(get => get('items'), () => block(cond1), get => get('id')));

	f.$blocks = [b];

	return f;
}

function block1({ fragment, element, text, block }) {
	const f = fragment();
	const li = f.appendChild(element('li'));
	li.appendChild(text('item'));
	const b = li.appendChild(block(cond2));

	f.$blocks = [b];

	return f;
}

function block2({ fragment, element, text }) {
	const f = fragment();
	f.appendChild(element('strong')).appendChild(text('*'));
	return f;
}

function cond0(get) {
	if (get('items')) {
		return block0;
	}
}

function cond1() {
	return block1;
}

function cond2(get) {
	if (get('marked')) {
		return block2;
	}
}
