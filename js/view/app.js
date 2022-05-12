const template = document.getElementById("todoapp");

const createNewApp = () => {
	return template.content.firstElementChild.cloneNode(true);
};

const addEvents = ($target, events) => {
  console.log($target);
	$target.querySelector(".new-todo").addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			events.addItem(e.target.value);
			e.target.value = "";
		}
	});
};

export const appView = ($target, state, events) => {
	const $app = $target.cloneNode(false);
	$app.appendChild(createNewApp());
	addEvents($app, events);
	return $app;
};
