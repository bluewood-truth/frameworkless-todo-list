const template = document.getElementById("todo");

const createNewTodo = () => {
	return template.content.firstElementChild.cloneNode(true);
};

const getTodo = ({ text, completed }) => {
	const $todo = createNewTodo();

	$todo.querySelector("label").textContent = text;
	$todo.querySelector("input.edit").value = text;

	if (completed) {
		$todo.classList.add("completed");
		$todo.querySelector("input.toggle").checked = true;
	}

	return $todo;
};

const getTodos = ({ todos }) => {
	return todos.map(getTodo);
};

export const todosView = ($target, state) => {
	const $todos = $target.cloneNode(false);

  const todos = getTodos(state);
	todos.forEach(($todo) => $todos.appendChild($todo));

	return $todos;
};
