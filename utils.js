const TODO_KEY = "todos";

export const saveToLocalStorage = (todoList) => {
	localStorage.setItem(TODO_KEY, JSON.stringify(todoList));
};

export const getFromLocalStorage = () => {
	return JSON.parse(localStorage.getItem(TODO_KEY)) || [];
};
