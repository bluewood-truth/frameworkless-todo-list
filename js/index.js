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

const render = () => {
	window.requestAnimationFrame(() => {
		const $root = document.querySelector("#root");
		const $newRoot = registry.render($root, state);
		applyDiff(document.body, $root, $newRoot);
	});
};

render();

// diff 알고리즘이 잘 적용되었는지 확인하기 위해
// 동적 렌더링 테스트
setInterval(() => {
	state.todos = getTodos(10);
	render();
	console.log("render");
}, 3000);
