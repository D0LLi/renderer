export default function template({ fragment, element, elementWithText, block }) {
	const f = fragment();

	f.appendChild(elementWithText('h1', 'Hello world'));
	const bc1 = f.appendChild(block(cond0));
	const bq = f.appendChild(element('blockquote'));

	bq.appendChild(elementWithText('p', 'Lorem ipsum 1'));
	const bc2 = bq.appendChild(block(cond3));
	bq.appendChild(elementWithText('p', 'Lorem ipsum 2'));

	f.$blocks = [bc1, bc2];

	return f;
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

function cond3(get) {
	if (get('expr1') === 1) {
		return block4;
	} else if (get('expr1') === 2) {
		return block5;
	}

	return block6; // <t-otherwise> block or undefined if absent
}

function block1({ fragment, element, elementWithText, block }) {
	const f = fragment();
	const p = f.appendChild(element('p'));
	p.appendChild(elementWithText('strong', 'top 1'));
	const bc1 = f.appendChild(block(cond1));
	const bc2 = f.appendChild(block(cond2));

	f.$blocks = [bc1, bc2];

	return f;
}

function block2({ fragment, elementWithText }) {
	const f = fragment();
	f.appendChild(elementWithText('div', 'top 2'));
	return f;
}

function block3({ fragment, elementWithText, text }) {
	const f = fragment();
	f.appendChild(elementWithText('div', 'top 3'));
	f.appendChild(text('top 3.1'));
	return f;
}

function block4({ fragment, elementWithText }) {
	const f = fragment();
	f.appendChild(elementWithText('div', 'sub 1'));
	return f;
}

function block5({ fragment, elementWithText }) {
	const f = fragment();
	f.appendChild(elementWithText('div', 'sub 2'));
	return f;
}

function block6({ fragment, elementWithText }) {
	const f = fragment();
	f.appendChild(elementWithText('div', 'sub 3'));
	return f;
}
