const template = document.getElementById("todo");

const createNewTodo = () => {
	return template.content.firstElementChild.cloneNode(true);
};

const getTodo = ({ text, completed }, index, events) => {
	const $todo = createNewTodo();

	$todo.querySelector("label").textContent = text;
	$todo.querySelector("input.edit").value = text;

	if (completed) {
		$todo.classList.add("completed");
		$todo.querySelector("input.toggle").checked = true;
	}

	$todo
		.querySelector("button.destroy")
		.addEventListener("click", () => events.deleteItem(index));

	return $todo;
};

const getTodos = ({ todos }, events) => {
	return todos.map((todo, i) => getTodo(todo, i, events));
};

export const todosView = ($target, state, events) => {
	const $todos = $target.cloneNode(false);

	const todos = getTodos(state, events);
	todos.forEach(($todo) => $todos.appendChild($todo));

	return $todos;
};
