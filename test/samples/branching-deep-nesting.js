export default function template({ fragment, block }) {
	const f = fragment();
	const b = f.appendChild(block(cond0));

	f.$blocks = [b];
	return f;
}

function block1({ fragment, block }) {
	const f = fragment();
	const b = f.appendChild(block(cond1));

	f.$blocks = [b];
	return f;
}

function block2({ fragment, block }) {
	const f = fragment();
	const b = f.appendChild(block(cond2));

	f.$blocks = [b];
	return f;
}

function block3({ fragment, text }) {
	const f = fragment();
	f.appendChild(text('test'));
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
