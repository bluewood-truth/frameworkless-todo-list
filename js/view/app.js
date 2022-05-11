import { todosView } from "./todos.js";
import { todoCountView } from "./todoCount.js";
import { filtersView } from "./filters.js";

export const appView = ($target, { todos, currFilter }) => {
	const $app = $target.cloneNode(true);

	const $todoList = $app.querySelector(".todo-list");
	const $todoCount = $app.querySelector(".todo-count");
	const $filters = $app.querySelector(".filters");

	$todoList.replaceWith(todosView($todoList, { todos }));
	$todoCount.replaceWith(todoCountView($todoCount, { todos }));
	$filters.replaceWith(filtersView($filters, { currFilter }));

	return $app;
};
