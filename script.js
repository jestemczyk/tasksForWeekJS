const addArray = Array.from(document.querySelectorAll(".add"));
const listsArray = Array.from(document.querySelectorAll(".list"));
const clearAllButton = document.querySelector(".clear-all");

const formPopup = document.querySelector(".add-popup-overflow");
const closePopup = document.querySelector(".close-popup");
const confirmButton = document.querySelector(".confirm-button");

const addForm = document.querySelector(".add-popup form");
const taskHours = document.getElementById("hours");
const taskMinutes = document.getElementById("minutes");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");

let targetIndex = 0;

function addTask(hours, minutes, title, description, listIndex) {
  let time = `${hours}:${minutes}`;
  let inner = `
        <div class="task">
            <p class="time">${time}</p>
            <h3 class="title">${title}</h3>
            <p class="description">${description}</p>
            <button class="delete">&#x2715;</button>
        </div>   
    `;

  hours = hours[0] === "0" ? hours[1] : hours;
  minutes = minutes[0] === "0" ? minutes[1] : minutes;

  let tasksArray = Array.from(listsArray[listIndex].querySelectorAll(".task"));
  if (tasksArray[0]) {
    let timeArray = [];
    Array.from(document.querySelectorAll(".time")).forEach((el) => {
      let objectHours = Array.from(el.textContent).splice(0, 2);
      let objectMinutes = Array.from(el.textContent).splice(3, 2);
      timeArray.push({
        hours: objectHours.join(""),
        minutes: objectMinutes.join(""),
      });
    });

    for (let i = 0; i < timeArray.length; i++) {
      if (Number(hours) === Number(timeArray[i].hours)) {
        if (Number(minutes) === Number(timeArray[i].minutes)) {
          tasksArray[i].insertAdjacentHTML("afterend", inner);
          break;
        } else if (Number(minutes) < Number(timeArray[i].minutes)) {
          tasksArray[i].insertAdjacentHTML("beforebegin", inner);
          break;
        } else if (i === timeArray.length - 1) {
          tasksArray[i].insertAdjacentHTML("afterend", inner);
        }
      } else if (Number(hours) < Number(timeArray[i].hours)) {
        tasksArray[i].insertAdjacentHTML("beforebegin", inner);
        break;
      } else if (i === timeArray.length - 1) {
        listsArray[listIndex].innerHTML += inner;
      }
    }
  } else {
    listsArray[listIndex].innerHTML += inner;
  }
}

function deleteTask(delButton) {
  let delButtonsArray = Array.from(document.querySelectorAll(".delete"));
  let allTasksArray = Array.from(document.querySelectorAll(".task"));
  let currentTask = allTasksArray[delButtonsArray.indexOf(delButton)];
  for (let i = 0; i < listsArray.length; i++) {
    if (listsArray[i].contains(currentTask)) {
      let localLists = JSON.parse(localStorage.lists);
      let tasksArr = Array.from(listsArray[i].querySelectorAll(".task"));
      localLists[i].splice(tasksArr.indexOf(currentTask), 1);
      localStorage.lists = JSON.stringify(localLists);
    }
  }
  currentTask.remove();
}

function clearAllTasks() {
  listsArray.forEach((list) => (list.innerHTML = ""));
  localStorage.lists = JSON.stringify([[], [], [], [], [], [], []]);
}

function taskToLocaleStorage(hours, minutes, title, description, listIndex) {
  let taskObject = {
    hours: hours,
    minutes: minutes,
    title: title,
    description: description,
  };
  let localArr = JSON.parse(localStorage.lists);
  if (localArr[listIndex][0]) {
    for (let i = 0; i < localArr[listIndex].length; i++) {
        if (Number(hours) === Number(localArr[listIndex][i].hours)) {
          if (Number(minutes) === Number(localArr[listIndex][i].minutes)) {
            localArr[listIndex].splice(i + 1, 0, taskObject);
            break;
          } else if (Number(minutes) < Number(localArr[listIndex][i].minutes)) {
            localArr[listIndex].splice(i, 0, taskObject);
            break;
          } else if (i === localArr[listIndex].length - 1) {
            localArr[listIndex].push(taskObject);
          }
        } else if (Number(hours) < Number(localArr[listIndex][i].hours)) {
          localArr[listIndex].splice(i, 0, taskObject);
          break;
        } else if (i === localArr[listIndex].length - 1) {
          localArr[listIndex].push(taskObject);
        }
    }
  } else {
    localArr[listIndex].push(taskObject);
  }
  localStorage.lists = JSON.stringify(localArr);
}

window.onload = function () {
  if (!localStorage.lists) {
    let lists = [[], [], [], [], [], [], []];
    localStorage.lists = JSON.stringify(lists);
  } else {
    let localLists = JSON.parse(localStorage.lists);
    for (let indx = 0; indx < localLists.length; indx++) {
      const list = localLists[indx];
      for (let i = 0; i < list.length; i++) {
        addTask(
          list[i].hours,
          list[i].minutes,
          list[i].title,
          list[i].description,
          indx
        );
      }
    }
  }
};

document.addEventListener("click", (e) => {
  if (addArray.includes(e.target)) {
    targetIndex = addArray.indexOf(e.target);
    formPopup.classList.remove("hide");
    document.body.style.overflow = "hidden";
    formPopup.addEventListener("click", (ev) => {
      if (ev.target === closePopup || ev.target === formPopup) {
        formPopup.classList.add("hide");
        document.body.style.overflow = "";
      }
    });
  }

  if (e.target.className === "delete") {
    deleteTask(e.target);
  }

  if (e.target === clearAllButton) {
    clearAllTasks();
  }
});

addForm.addEventListener("submit", (submit) => {
  submit.preventDefault();
  let newHours = taskHours.value;
  let newMinutes = taskMinutes.value;
  let title = taskTitle.value;
  let description = taskDescription.value
    ? taskDescription.value
    : "no description";
  addTask(newHours, newMinutes, title, description, targetIndex);
  taskToLocaleStorage(newHours, newMinutes, title, description, targetIndex);
  taskTitle.value = "";
  taskDescription.value = "";
  formPopup.classList.add("hide");
   document.body.style.overflow = "";
});
