export default function(ctx) {
	const stack = [];

	return {
		get() {
			let _ctx = ctx;
			for (let i = 0; i < arguments.length && _ctx != null; i++) {
				_ctx = _ctx[arguments[i]];
			}

			return _ctx;
		},
		push(obj) {
			stack.push(ctx);
			ctx = obj;

		},
		pop() {
			ctx = stack.pop();
		}
	};
}
