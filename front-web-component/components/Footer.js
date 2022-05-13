const getTodoCount = (todos) => {
	return todos.filter((todo) => !todo.completed).length;
};

export class Footer extends HTMLElement {
	static get observedAttributes() {
		return ["todos", "filter"];
	}

	get todos() {
		if (!this.hasAttribute("todos")) return [];
		return JSON.parse(this.getAttribute("todos"));
	}

	set todos(value) {
		this.setAttribute("todos", JSON.stringify(value));
	}

	get filter() {
		return this.getAttribute("filter");
	}

	set filter(value) {
		this.setAttribute("filter", value);
	}

  constructor() {
    super();
		this.template = document.getElementById("footer");
	}

	connectedCallback() {
		this.appendChild(this.createFooter());
		this.$todoCount = this.querySelector(".todo-count");
		this.$filters = this.querySelector(".filters");

		this.updateTodoCount();
		this.updateFilters();
	}

	attributeChangedCallback(name) {
		if (name === "todos") this.updateTodoCount();
		if (name === "filters") this.updateFilters();
	}

  updateTodoCount() {
    const leftCount = getTodoCount(this.todos);
    if (leftCount === 1) {
      this.$todoCount.innerHTML = `<strong>1</strong> item left`;
    }

    this.$todoCount.innerHTML = `<strong>${leftCount}</strong> items left`;
  }

  updateFilters() {
    this.$filters.querySelectorAll("li a").forEach(($a) => {
			if ($a.textContent === this.filter) {
				$a.classList.add("selected");
			} else {
				$a.classList.remove("selected");
			}
		});
  }

	createFooter() {
		return this.template.content.firstElementChild.cloneNode(true);
	}
}
