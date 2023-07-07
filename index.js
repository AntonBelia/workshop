"use strict";

/**
 * Оголошуємо змінні з HTML елементами
 */
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector(".filter-input");
const form = document.querySelector(".create-task-form");

/**
 * Створюємо слухачі на необхідні нам події
 */
document.addEventListener("DOMContentLoaded", renderTasks);
clearBtn.addEventListener("click", clearAllTasks);
taskList.addEventListener("click", clearSingleTask);
form.addEventListener("submit", createTask);

/**
 * Отримуємо дані з localStorage
 * @return {[String]} - масив з задачами, або пустий масив, якщо localStorage пустий
 */
function getTasksFromLocalStorage() {
  return localStorage.getItem("tasks") !== null ? JSON.parse(localStorage.getItem("tasks")) : [];}

/**
 * Записуємо дані в localStorage
 * @param {Array} tasks - масив з задачами
 */
function setTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Створюємо окрему задачу
 * @param {String} task - окрема задача
 */
function createSingleTaskElement(task, index) {
	// Створюємо HTML елемент li
	const li = document.createElement('li');
	// Додаємо елементу клас
	li.className = 'collection-item';
	// Кладемо в нього текстову ноду з задачею
	li.appendChild(document.createTextNode(task));
  
	// Створюємо обгортку для іконки по кліку на яку буде видалена окрема задача
	const deleteElement = document.createElement('span');
	// Додаємо елементу клас
	deleteElement.className = 'delete-item';
	// Задаємо кастомний атрибут для збереження індексу елемента
	deleteElement.dataset.index = index;
  
	// Кладемо в нього іконку видалення
	deleteElement.innerHTML = '<i class="fa fa-remove"></i>';
	// Додаємо елемент в елемент списку
	li.appendChild(deleteElement);
  
	// Створюємо обгортку для іконки редагування
	const editElement = document.createElement('span');
	// Додаємо елементу клас
	editElement.className = 'edit-item';
	// Задаємо кастомний атрибут для збереження індексу елемента
	editElement.dataset.index = index;
  
	// Кладемо в нього іконку редагування
	editElement.innerHTML = '<i class="fa fa-edit"></i>';
	// Додаємо елемент в елемент списку
	li.appendChild(editElement);
  
	// Додаємо елемент списку в список задач
	taskList.appendChild(li);
  }

/**
 * Додаємо в DOM існуючі задачі
 */
function renderTasks() {
  // Отримуємо задачі з localStorage або пустий масив
  const tasks = getTasksFromLocalStorage();

  // Проходимо по масиву задач і додаємо кожну задачу в список, в DOM
  tasks.forEach((task, index) => {
    createSingleTaskElement(task, index);
  });
}

/**
 * Створюємо окрему задачу
 * @param {Event} event - The triggering event
 */
function createTask(event) {
  // Блокуємо дефолтний сабміт форми
  event.preventDefault();
  // Виходимо з функції якщо в полі немає тексту і видаляймо непотрібні пробіли до і після тексту
  if (taskInput.value.trim() === "") {
    return;
  }

  // Створюємо нову задачу і додаємо в DOM
  createSingleTaskElement(taskInput.value);
  // Додаємо нову задачу в localStorage
  storeTaskInLocalStorage(taskInput.value);
  // Очищуємо поле після додавання нової задачі в список
  taskInput.value = "";
}

/**
 * Додаємо нову створену задачу в localStorage
 * @param {String} task - окрема задача
 */
function storeTaskInLocalStorage(task) {
  // Отримуємо поточні задачі з localStorage
  const tasks = getTasksFromLocalStorage();

  // Додаємо нову задачу в масив
  tasks.push(task);
  // Записуємо оновлений масив в localStorage
  setTasksToLocalStorage(tasks);
}

/**
 * Видаляємо всі задачі з localStorage та з DOM
 */
function clearAllTasks() {
  // Показуємо користувачу модальне вікно для підтвердження видалення всіх задач
  if (confirm("Ви впевнені що хочете видалити всі задачі?")) {
    // Якщо користувач підтверджує, то видаємо всі задачі з localStorage та з DOM
    localStorage.clear();
    taskList.innerHTML = "";
  }
}

/**
 * Видаляємо окрему задачу з localStorage та з DOM
 * @param {Event} event - The triggering event
 */
function clearSingleTask(event) {
	// Отримуємо батьківський елемент елементу на якому була подія кліку
	const iconContainer = event.target.parentElement;
  
	// Якщо батьківський елемент має відповідний клас
	if (iconContainer.classList.contains('delete-item')) {
	  // Отримуємо індекс елемента з кастомного атрибуту
	  const index = iconContainer.dataset.index;
  
	  // Отримуємо підтвердження користувача
	  if (confirm('Ви впевнені що хочете видалити цю задачу?')) {
		// Видаляємо елемент з DOM та з localStorage
		iconContainer.parentElement.remove();
		removeTaskFromLocalStorage(index);
  
		// Оновлюємо індекси в кастомних атрибутах
		updateIndexes();
	  }
	} else if (iconContainer.classList.contains('edit-item')) {
	  // Отримуємо індекс елемента з кастомного атрибуту
	  const index = iconContainer.dataset.index;
  
	  // Отримуємо поточний текст завдання
	  const currentTask = taskList.children[index].textContent;
  
	  // Викликаємо діалогове вікно prompt для редагування тексту завдання
	  const updatedTask = prompt('Введіть новий текст завдання:', currentTask);
  
	  if (updatedTask !== null && updatedTask.trim() !== '') {
		// Оновлюємо текст завдання в DOM та в localStorage
		taskList.children[index].textContent = updatedTask;
		updateTaskInLocalStorage(index, updatedTask);
	  }
	}
  }

function updateIndexes() {
    const deleteIcons = document.querySelectorAll('.delete-item');
    deleteIcons.forEach((deleteIcon, newIndex) => {
        deleteIcon.dataset.index = newIndex;
    });

    const editIcons = document.querySelectorAll('.edit-item');
    editIcons.forEach((editIcon, newIndex) => {
        editIcon.dataset.index = newIndex;
    });
}

function updateTaskInLocalStorage(index, updatedTask) {
    const tasks = getTasksFromLocalStorage();
    tasks[index] = updatedTask;
    setTasksToLocalStorage(tasks);
}

/**
 * Видаляємо окрему задачу з localStorage та з DOM
 * @param taskToRemove - DOM елемент
 */
function removeTaskFromLocalStorage(index) {
  // Отримуємо поточні задачі з localStorage
  const tasks = getTasksFromLocalStorage();

  tasks.splice(index, 1);
  console.log(index);
  // Записуємо оновлений масив в localStorage
  setTasksToLocalStorage(tasks);
}
