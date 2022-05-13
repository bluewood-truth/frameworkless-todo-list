export const EVENTS = {
	DELETE_ITEM: "DELETE_ITEM",
};

export class List extends HTMLElement {
	static get observedAttributes() {
		return ["todos"];
  }

	get todos() {
		if (!this.hasAttribute("todos")) return [];
		return JSON.parse(this.getAttribute("todos"));
	}

	set todos(value) {
		this.setAttribute("todos", JSON.stringify(value));
	}

  constructor() {
    super();
		this.listTemplate = document.getElementById("todo-list");
		this.itemTemplate = document.getElementById("todo-item");
	}

  connectedCallback() {
		this.appendChild(this.createTodoList());
		this.$list = this.querySelector("ul");
		this.$list.addEventListener("click", (e) => {
			if (e.target.matches("button.destroy")) {
				this.onDeleteClick(e.target.dataset.index);
			}
		});

		this.updateList();
	}

	attributeChangedCallback() {
		this.updateList();
	}

  updateList() {
		this.$list.innerHTML = "";
		this.todos
			.map(this.getTodoElement.bind(this))
			.forEach(($todo) => this.$list.appendChild($todo));
	}

	getTodoElement(todo, index) {
    const { text, completed } = todo;
		const $todo = this.createTodoItem();

		$todo.querySelector("label").textContent = text;
		$todo.querySelector("input.edit").value = text;

		if (completed) {
			$todo.classList.add("completed");
			$todo.querySelector("input.toggle").checked = true;
		}

		$todo.querySelector("button.destroy").dataset.index = index;

		return $todo;
	}

	createTodoList() {
		return this.listTemplate.content.firstElementChild.cloneNode(true);
	}

  createTodoItem() {
    console.log(1);
		return this.itemTemplate.content.firstElementChild.cloneNode(true);
	}

	onDeleteClick(index) {
		const event = new CustomEvent(EVENTS.DELETE_ITEM, { detail: { index } });
		this.dispatchEvent(event);
	}
}
