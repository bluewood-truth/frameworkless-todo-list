import { todosView } from "./view/todos.js";
import { todoCountView } from "./view/todoCount.js";
import { filtersView } from "./view/filters.js";
import { getTodos } from "./utils.js";
import { registry } from "./registry.js";

registry.add("todos", todosView);
registry.add("todoCount", todoCountView);
registry.add("filters", filtersView);

const state = {
	todos: getTodos(10),
	currFilter: "All",
};

window.requestAnimationFrame(() => {
	const $app = document.querySelector(".todoapp");
	const $newApp = registry.render($app, state);
	$app.replaceWith($newApp);
});
