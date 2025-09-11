const TODO_KEY = "todos";

export const saveToLocalStorage = (todoList) => {
	localStorage.setItem(TODO_KEY, JSON.stringify(todoList));
};

export const getFromLocalStorage = () => {
	return JSON.parse(localStorage.getItem(TODO_KEY)) || [];
};

export const getDateRepresentation = (date) => {
	return Intl.DateTimeFormat("ru-Ru", {
		day: "numeric",
		month: "numeric",
	}).format(date);
};

export const generateRandomColor = () => {
	const colors = ["limegreen", "skyblue", "coral"];
	const randomIndex = Math.floor(Math.random() * colors.length);
	const randomColor = colors[randomIndex];

	return randomColor;
};
