const { faker } = window;

const createTodo = () => {
	return {
		text: faker.random.word(),
		completed: faker.random.boolean(),
	};
};

const repeat = (elementFactory, length) => {
	return new Array(length).fill(null).map(() => elementFactory());
};

export const getTodos = (length) => {
  return repeat(createTodo, length);
};
