import { appView } from "./view/app.js";
import { getTodos } from "./utils.js";

const state = {
	todos: getTodos(10),
	currFilter: "All",
};

window.requestAnimationFrame(() => {
	const $app = document.querySelector(".todoapp");
	$app.replaceWith(appView($app, state));
});
