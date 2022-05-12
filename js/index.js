import { todosView } from "./view/todos.js";
import { todoCountView } from "./view/todoCount.js";
import { filtersView } from "./view/filters.js";
import { getTodos } from "./utils.js";
import { registry } from "./registry.js";
import { applyDiff } from "./applyDiff.js";
import { appView } from "./view/app.js";

registry.add("app", appView);
registry.add("todos", todosView);
registry.add("todoCount", todoCountView);
registry.add("filters", filtersView);

const state = {
	todos: getTodos(10),
	currFilter: "All",
};

const events = {
	addItem: (text) => {
		state.todos.push({ text, completed: false });
		render();
	},
	deleteItem: (index) => {
		state.todos.splice(index, 1);
		render();
	},
};

const render = () => {
	window.requestAnimationFrame(() => {
		const $root = document.querySelector("#root");
		const $newRoot = registry.render($root, state, events);
		applyDiff(document.body, $root, $newRoot);
	});
};

render();
