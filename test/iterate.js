import assert from 'assert';
import createRenderer from '../index';
import read from './assets/read-file';
import document from './assets/document';
import iterate from './samples/iterate';
import keyIterate from './samples/key-iterate';

describe('Iterate', () => {
	before(() => global.document = document);
	after(() => delete global.document);

	it('basic', () => {
		let prev;
		const target = document.createElement('div');
		const update = createRenderer(target, iterate, {
			items: [
				{ id: 1, marked: true },
				{ id: 2, marked: false },
				{ id: 3, marked: false },
				{ id: 4, marked: true }
			]
		});

		assert.equal(target.innerHTML, read('fixtures/iterate1.html'));

		// Render same content but in different order: must keep the same `<li>` nodes
		prev = Array.from(target.childNodes);
		update({
			items: [
				{ id: 3, marked: false },
				{ id: 2, marked: false },
				{ id: 1, marked: true },
				{ id: 4, marked: true }
			]
		});

		assert.equal(target.innerHTML, read('fixtures/iterate2.html'));
		prev.forEach((node, i) => assert.strictEqual(node, target.childNodes[i]));

		// Render less elements
		update({
			items: [
				{ id: 1, marked: false },
				{ id: 2, marked: false }
			]
		});

		assert.equal(target.innerHTML, read('fixtures/iterate3.html'));
		assert.strictEqual(prev[0], target.childNodes[0]);
		assert.strictEqual(prev[1], target.childNodes[1]);

		// Render more elements
		update({
			items: [
				{ id: 3, marked: false },
				{ id: 2, marked: false },
				{ id: 1, marked: true },
				{ id: 4, marked: true }
			]
		});

		assert.equal(target.innerHTML, read('fixtures/iterate2.html'));
		assert.strictEqual(prev[0], target.childNodes[0]);
		assert.strictEqual(prev[1], target.childNodes[1]);
	});
});
