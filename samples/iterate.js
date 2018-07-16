export default function template({ fragment, elementWithText, block }) {
	const f = fragment();

	f.appendChild(elementWithText('h1', 'Hello world'));
	const b = f.appendChild(block(cond0));
	f.$blocks = [b];

	return f;
}

function block0({ fragment, element, elementWithText, iterator, block }) {
	const f = fragment();
	f.appendChild(elementWithText('p', 'will iterate'));
	const ul = f.appendChild(element('ul'));
	const b = ul.appendChild(iterator(get => get('items'), () => block(cond1)));

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

function block2({ fragment, elementWithText }) {
	const f = fragment();
	f.appendChild(elementWithText('strong', '*'));
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
