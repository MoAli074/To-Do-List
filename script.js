// Global Variables And Selectors
const input = document.querySelector(".input input");
const addBtn = document.querySelector(".input button");
const tasksUl = document.querySelector(".list");
const clearBtn = document.querySelector(".clear");
const motivateBtn = document.querySelector(".motivate");
let tasksArray = [];

// Functions To Be Used Through The Project
const addTaskToArray = (taskTitle, IsComplete = false) => {
  const taskObj = { title: taskTitle, id: Date.now(), complete: IsComplete };
  tasksArray.push(taskObj);
};

const saveTasksArrayToStorage = (tasksArr) => {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
};

const addSingleTaskToDiv = (task) => {
  const div = document.createElement("li");
  const input = document.createElement("input");
  input.type = "text";
  input.readOnly = true;
  input.className = "task-title";
  input.value = task.title;
  div.appendChild(input);
  div.className = "task";
  if (task.complete) {
    div.classList.add("complete");
  }
  div.dataset.id = task.id;
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "✔";
  doneBtn.className = "done-btn";
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "remove-btn";
  controlsDiv.appendChild(doneBtn);
  controlsDiv.appendChild(editBtn);
  controlsDiv.appendChild(removeBtn);
  div.appendChild(controlsDiv);
  tasksUl.appendChild(div);
};

const addTasksToDiv = (tasksArr) => {
  tasksUl.innerHTML = "";
  tasksArr.forEach((task) => {
    addSingleTaskToDiv(task);
  });
};

const removeTaskFromArray = (taskLi) => {
  tasksArray = tasksArray.filter((task) => task.id != taskLi.dataset.id);
};

const removeTaskLiFromDom = (taskLi) => {
  taskLi.remove();
};

const checkIfNoTasks = (tasksArr) => {
  if (tasksArr.length == 0) {
    tasksUl.parentNode.style.display = "none";
    clearBtn.style.display = "none";
    motivateBtn.style.display = "block";
  } else {
    tasksUl.parentNode.style.display = "block";
    clearBtn.style.display = "block";
    motivateBtn.style.display = "none";
  }
};

const markTaskAsComplete = (taskli) => {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == taskli.dataset.id) {
      tasksArray[i].complete = !tasksArray[i].complete;
      break;
    }
  }
};

const changeTaskTitleInDom = (input, editBtn) => {
  input.readOnly = false;
  editBtn.textContent = "Save";
  input.focus();
  editBtn.classList.add("save-btn");
};

const revertEditButton = (input, editBtn) => {
  input.readOnly = true;
  editBtn.textContent = "Edit";
  editBtn.classList.remove("save-btn");
};

const updateTitleInTasksArray = (newTitle, task) => {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == task.dataset.id) {
      tasksArray[i].title = newTitle;
      break;
    }
  }
};

const moveTheTaskDown = (taskLi) => {
  removeTaskFromArray(taskLi);
  removeTaskLiFromDom(taskLi);
  addTaskToArray(taskLi.querySelector(".task-title").value, true);
  addSingleTaskToDiv(tasksArray[tasksArray.length - 1]);
};

// Checking If There are tasks in Local Storage
if (localStorage.getItem("tasks") != null) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
  addTasksToDiv(tasksArray);
  checkIfNoTasks(tasksArray);
}

// Handling Events
addBtn.addEventListener("click", (e) => {
  if (input.value.trim().length != 0) {
    addTaskToArray(input.value);
    saveTasksArrayToStorage(tasksArray);
    addSingleTaskToDiv(tasksArray[tasksArray.length - 1]);
    checkIfNoTasks(tasksArray);
    input.value = "";
  }
});

tasksUl.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("remove-btn")) {
    removeTaskFromArray(e.target.parentNode.parentNode);
    removeTaskLiFromDom(e.target.parentNode.parentNode);
    saveTasksArrayToStorage(tasksArray);
    checkIfNoTasks(tasksArray);
  }
});

tasksUl.addEventListener("click", (e) => {
  if (e.target.className == "edit-btn") {
    e.stopImmediatePropagation();
    const inputTitle = e.target.parentNode.parentNode.querySelector(".task-title");
    changeTaskTitleInDom(inputTitle, e.target);
  }
});

tasksUl.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("save-btn")) {
    const inputTitle = e.target.parentNode.parentNode.querySelector(".task-title");
    revertEditButton(inputTitle, e.target);
    updateTitleInTasksArray(inputTitle.value, e.target.parentNode.parentNode);
    saveTasksArrayToStorage(tasksArray);
  }
});

tasksUl.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("done-btn")) {
    e.target.parentNode.parentNode.classList.toggle("complete");
    if (e.target.parentNode.parentNode.classList.contains("complete")) {
      moveTheTaskDown(e.target.parentNode.parentNode);
      saveTasksArrayToStorage(tasksArray);
    } else {
      markTaskAsComplete(e.target.parentNode.parentNode);
      saveTasksArrayToStorage(tasksArray);
    }
  }
});

clearBtn.addEventListener("click", (e) => {
  tasksArray = [];
  tasksUl.innerHTML = "";
  localStorage.removeItem("tasks");
  checkIfNoTasks(tasksArray);
});

motivateBtn.addEventListener("click", () => {
  input.focus();
});

input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    addBtn.click();
  }
});
