const _registry = {};

const renderWrapper = (component) => {
	return ($target, state, events) => {
		const $element = component($target, state, events);
		const $children = $element.querySelectorAll("[data-component]");

		$children.forEach(($target) => {
			const name = $target.dataset.component;
			const component = _registry[name];

			if (!component) return;

			$target.replaceWith(component($target, state, events));
		});

		return $element;
	};
};

const add = (name, component) => {
	_registry[name] = renderWrapper(component);
};

const render = ($root, state, events) => {
	const cloneRoot = ($root) => {
		return $root.cloneNode(true);
	};

	return renderWrapper(cloneRoot)($root, state, events);
};

export const registry = {
	add,
	render,
};
