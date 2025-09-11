import {
	saveToLocalStorage,
	getFromLocalStorage,
	getDateRepresentation,
	generateRandomColor,
} from "./utils.js";

const openInputButton = document.querySelector("[data-add-button]");
const addInputContainer = document.querySelector("[data-add-input-container]");
const todoListContainer = document.querySelector("[data-todo-list-container]");
const todoTemplate = document.querySelector("[data-todos-template]");
const searchInput = document.querySelector("[data-search-input]");

let todoList = getFromLocalStorage();
let filteredTodoList = [];

//функция для обновления состояния страницы к начальному (до открытия формы), используется при закрывания формы
const updateState = () => {
	const blurContainer = document.querySelector("[data-blur-background]");
	blurContainer.classList.remove("blur-background");
	document.body.style.overflow = "auto";
	openInputButton.textContent = "+";
	openInputButton.classList.remove("add-todo-button--cross");

	addInputContainer.innerHTML = "";
};

//обработчик для нажатия на escape и закрытия поля ввода
const handleEscape = (e) => {
	if (e.key === "Escape") {
		updateState();
		document.removeEventListener("keydown", handleEscape);
	}
};

//функция для открытия поля ввода
const openInput = () => {
	const blurContainer = document.querySelector("[data-blur-background]");
	blurContainer.classList.add("blur-background");

	document.body.style.overflow = "hidden";

	openInputButton.textContent = "\u2716";
	openInputButton.classList.add("add-todo-button--cross");

	const addInput = document.createElement("input");
	addInput.placeholder = "Введите задачу...";
	addInput.classList.add("add-input");

	const addButton = document.createElement("button");
	addButton.textContent = "Добавить";
	addButton.classList.add("add-input-button");

	addInputContainer.append(addInput, addButton);

	//обработчик для кнопки добавления задачи
	addButton.addEventListener("click", () => {
		if (addInput.value.trim()) {
			const newTodo = {
				id: Date.now(),
				text: addInput.value.toLowerCase(),
				isCompleted: false,
				date: getDateRepresentation(new Date()),
				color: generateRandomColor(),
			};
			todoList.push(newTodo);
			addInput.value = "";

			addInput.hidden = true;
			addButton.hidden = true;

			openInputButton.disabled = false;

			saveToLocalStorage(todoList);
			todoRender();
			updateState();
		}
	});

	document.addEventListener("keydown", handleEscape);

	//обработчик нажатия на Enter
	addInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			addButton.click();
			updateState();
		}
	});
};

//обработчик нажатия на кнопку открытия формы
openInputButton.addEventListener("click", () => {
	if (openInputButton.textContent === "+") {
		openInput();
		window.scrollTo(0, 0);
	} else {
		updateState();
	}
});

//обработчик для search input
searchInput.addEventListener("input", (e) => {
	const searchValue = e.target.value.trim().toLowerCase();
	filterAndRenderFIlteredList(searchValue);
});

//фильтрация filteredList
const filterAndRenderFIlteredList = (searchValue) => {
	filteredTodoList = todoList.filter((todo) => {
		return todo.text.includes(searchValue);
	});
	renderFilteredTodo();
};

//создание dom элемента из template, заполнение элементов данными
const createTodoLayout = (todo) => {
	const todoElement = document.importNode(todoTemplate.content, true);

	const checkbox = todoElement.querySelector("[data-todo-checkbox]");
	checkbox.checked = todo.isCompleted;

	const todoText = todoElement.querySelector("[data-todo-text]");
	todoText.textContent = todo.text;

	const todoDate = todoElement.querySelector("[data-todo-date]");
	todoDate.textContent = todo.date;

	todoDate.style.backgroundColor = todo.color;

	const removeTodoButton = todoElement.querySelector("[data-remove-btn]");
	removeTodoButton.disabled = !todo.isCompleted;

	//обработчик для чекбокса
	checkbox.addEventListener("change", (e) => {
		//меняем статус задачи в списке с помощью map
		todoList = todoList.map((t) => {
			if (t.id === todo.id) {
				t.isCompleted = e.target.checked;
			}
			return t;
		});
		saveToLocalStorage(todoList); //сохраняем список с обновленными статусами в local storage
		todoRender();
	});

	//обработчик для кнопки удаления задачи
	removeTodoButton.addEventListener("click", () => {
		//с помощью filter оставляем только те задачи, id которых не совпадает с удаляемой задачей
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

//рендер фильтрованного списка
const renderFilteredTodo = () => {
	todoListContainer.innerHTML = "";

	if (filteredTodoList.length === 0) {
		const textSearch = document.createElement("p");
		textSearch.textContent = "Нет таких задач";
		todoListContainer.append(textSearch);

		return;
	}

	filteredTodoList.forEach((todo) => {
		const todoElement = createTodoLayout(todo);
		todoListContainer.append(todoElement);
	});
};

//рендер обычного списка
const todoRender = () => {
	todoListContainer.innerHTML = "";

	todoList.forEach((todo) => {
		const todoElement = createTodoLayout(todo);
		todoListContainer.append(todoElement);
	});
};

todoRender();
