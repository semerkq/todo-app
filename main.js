import { saveToLocalStorage, getFromLocalStorage } from "./utils.js";

const openInputButton = document.querySelector("[data-add-button]");
const addInputContainer = document.querySelector("[data-add-input-container]");
const todoListContainer = document.querySelector("[data-todo-list-container]");
const todoTemplate = document.querySelector("[data-todos-template]");

let todoList = getFromLocalStorage();

openInputButton.addEventListener("click", () => {
	const addInput = document.createElement("input");
	addInput.placeholder = "Введите задачу...";

	const addButton = document.createElement("button");
	addButton.textContent = "Добавить";

	addInputContainer.append(addInput, addButton);

	openInputButton.disabled = true;

	addButton.addEventListener("click", () => {
		if (addInput.value.trim()) {
			const newTodo = {
				id: Date.now(),
				text: addInput.value,
				isCompleted: false,
				date: new Date(),
			};
			todoList.push(newTodo);
			addInput.value = "";

			addInput.hidden = true;
			addButton.hidden = true;

			openInputButton.disabled = false;

			saveToLocalStorage(todoList);
			todoRender();
		}
	});

	addInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			addButton.click();
		}
	});
});

const createTodoLayout = (todo) => {
	const todoElement = document.importNode(todoTemplate.content, true);

	const checkbox = todoElement.querySelector("[data-todo-checkbox]");
	checkbox.checked = todo.isCompleted;

	const todoText = todoElement.querySelector("[data-todo-text]");
	todoText.textContent = todo.text;

	const todoDate = todoElement.querySelector("[data-todo-date]");
	todoDate.textContent = todo.date;

	const removeTodoButton = todoElement.querySelector("[data-remove-btn]");
	removeTodoButton.disabled = !todo.isCompleted;

	checkbox.addEventListener("change", (e) => {
		todoList = todoList.map((t) => {
			if (t.id === todo.id) {
				t.isCompleted = e.target.checked;
			}
			return t;
		});
		saveToLocalStorage(todoList);
		todoRender();
	});

	removeTodoButton.addEventListener("click", () => {
		todoList = todoList.filter((t) => {
			if (t.id !== todo.id) {
				return t;
			}
		});
		saveToLocalStorage(todoList);
		todoRender();
	});
	return todoElement;
};

const todoRender = () => {
	todoListContainer.innerHTML = "";

	todoList.forEach((todo) => {
		const todoElement = createTodoLayout(todo);
		todoListContainer.append(todoElement);
	});
};

todoRender();
