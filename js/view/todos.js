const getTodo = ({ text, completed }) => {
	return `
    <li ${completed ? 'class="completed"' : ""}>
      <div class="view">
        <input class="toggle" type="checkbox" ${completed ? "checked" : ""}>
        <label>${text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${text}">
    </li>
  `;
};

const getTodos = ({ todos }) => {
	return todos.map(getTodo).join("");
};

export const todosView = ($target, state) => {
	const $todos = $target.cloneNode(true);
	$todos.innerHTML = getTodos(state);

	return $todos;
};
