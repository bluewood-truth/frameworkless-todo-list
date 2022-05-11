const getTodoCount = ({ todos }) => {
	const leftCount = todos.filter((todo) => !todo.completed).length;

	if (leftCount === 1) {
		return `<strong>1</strong> item left`;
	}

	return `<strong>${leftCount}</strong> items left`;
};

export const todoCountView = ($target, state) => {
	const $todoCount = $target.cloneNode();
	$todoCount.innerHTML = getTodoCount(state);

	return $todoCount;
};
