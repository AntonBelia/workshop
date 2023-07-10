"use strict";

const form = document.querySelector(".create-task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector(".filter-input");
const taskInput = document.querySelector(".task-input");

document.addEventListener("DOMContentLoaded", loadTasks);
form.addEventListener("submit", createTask);
clearBtn.addEventListener("click", clearTasks);
taskList.addEventListener("click", removeOrEditTask);

function createSingleTaskElement(task, index) {
  const li = document.createElement("li");
  li.className = "collection-item";
  li.dataset.index = index;
  li.appendChild(document.createTextNode(task));

  const deleteElement = document.createElement("span");
  deleteElement.className = "delete-item";
  deleteElement.innerHTML = '<i class="fa fa-remove"></i>';
  li.appendChild(deleteElement);

  const editElement = document.createElement("span");
  editElement.className = "edit-item";
  editElement.innerHTML = '<i class="fa fa-edit"></i>';
  li.appendChild(editElement);

  taskList.appendChild(li);
}

function loadTasks() {
  const tasks = checkingLocalStorage();

  tasks.forEach((task, index) => {
    createSingleTaskElement(task, index);
  });
}

function createTask(event) {
  event.preventDefault();
  if (taskInput.value.trim() === "") {
    return;
  }

  const tasks = checkingLocalStorage();
  const index = tasks.length;

  createSingleTaskElement(taskInput.value, index);

  storeTaskInLocalStorage(taskInput.value);

  taskInput.value = "";
}

function storeTaskInLocalStorage(task) {
  const tasks = checkingLocalStorage();

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearTasks() {
  if (confirm("Ви впевнені?")) {
    localStorage.clear();
    taskList.innerHTML = "";
  }
}

function removeOrEditTask(event) { 
  const index = event.target.parentElement.parentElement.dataset.index;
  const longRoad = event.target.parentElement

  if (longRoad.classList.contains('delete-item')) {
    if (confirm("Ви впевнені?")) {
		longRoad.parentElement.remove();
      removeTaskFromLocalStorage(index);
    }
  } else if (longRoad.classList.contains('edit-item')) {
    const tasks = checkingLocalStorage();
	console.log(tasks[index])
    const newTask = prompt("Введіть зміни в завдання", tasks[index]);
	
    if (newTask !== null && newTask.trim() !== "") {
		longRoad.parentElement.firstChild.textContent = newTask;
      updateTaskInLocalStorage(newTask, index);
    }
  }
}

function updateTaskInLocalStorage(newTask, index) {
  const tasks = checkingLocalStorage();

  tasks[index] = newTask;

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(index) {
  const tasks = checkingLocalStorage();

  tasks.splice(index, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function checkingLocalStorage() {
  let tasks;
  if (localStorage.getItem("tasks") !== null) {
    return (tasks = JSON.parse(localStorage.getItem("tasks")));
  } else {
    return (tasks = []);
  }
}