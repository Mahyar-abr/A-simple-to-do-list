const addButton = document.querySelector("#add");
const closeModal = document.querySelector(".popup");
const outside = document.querySelector("#todo");
const task = document.querySelector("#task");
const taskInfo = document.querySelector("#taskinfo");
const popupContent = document.querySelector("#popupcontent");
const removeButtonElement = document.getElementById("removeButton");
const saveTasks = document.querySelector("#save");
const doneButton = document.querySelector("#done");

// Opening the data entry form
function openEntry() {
  document.querySelector(".popup").style.display = "flex";
}
addButton.addEventListener("click", openEntry);

function closePopup() {
  document.querySelector(".popup").style.display = "none";
}

document.addEventListener("click", function (event) {
  if (
    event.target !== popupContent &&
    event.target !== taskInfo &&
    event.target !== task &&
    event.target !== addButton
  ) {
    event.preventDefault();
    closePopup();
  }
});

//Adding Tasks

var newButton;

function addValues(event) {
  event.preventDefault();
  var taskValue = task.value.trim();
  var taskdescription = taskInfo.value.trim();

  if (task !== "" || taskdescription !== "") {
    newButton = document.createElement("button");
    newButton.className = "tasktext";
    newButton.textContent = task.value.trim();

    //Add description
    newButton.addEventListener("click", function () {
      var description = document.querySelector(".description");
      var descriptionTitle = description.querySelector(".title");
      var descriptionSubtitle = description.querySelector(".subtitle");
      var descriptionText = description.querySelector(
        ".textcontentdescription"
      );

      descriptionTitle.textContent = taskValue;
      descriptionSubtitle.textContent = taskValue; // You can replace this with an actual subtitle
      descriptionText.textContent = taskdescription;
    });
    //
    var tasksContainer = document.querySelector(".row.tasks");
    tasksContainer.appendChild(newButton);


    var tasksListcontainer = document.querySelector(".row.listback");
    tasksListcontainer.appendChild(tasksContainer);

    task.value = "";
    taskInfo.value = "";

    newButton.setAttribute("data-description", taskdescription);

    // Save to localStorage
    saveToLocalStorage();
  }
}

saveTasks.addEventListener("click", addValues);

var selectedButton = null;

function selectButton(event) {
  selectedButton = event.target;
}

function removeSelectedButton() {
  if (selectedButton && selectedButton.classList.contains("tasktextdone")) {
    selectedButton.remove();
    selectedButton = null;

    var description = document.querySelector(".description");
    var descriptionTitle = description.querySelector(".title");
    var descriptionSubtitle = description.querySelector(".subtitle");
    var descriptionText = description.querySelector(".textcontentdescription");

    descriptionTitle.textContent = "";
    descriptionSubtitle.textContent = "";
    descriptionText.textContent = "";
  } else if (selectedButton && selectedButton.classList.contains("tasktext")) {
    selectedButton.remove();
    selectedButton = null;

    var description = document.querySelector(".description");
    var descriptionTitle = description.querySelector(".title");
    var descriptionSubtitle = description.querySelector(".subtitle");
    var descriptionText = description.querySelector(".textcontentdescription");

    descriptionTitle.textContent = "";
    descriptionSubtitle.textContent = "";
    descriptionText.textContent = "";
  }

  // Save to localStorage
  saveToLocalStorage();
}

document.addEventListener("click", function (event) {
  selectButton(event);
});

if (removeButtonElement) {
  removeButtonElement.addEventListener("click", removeSelectedButton);
}

//-------------------------

var selectButtonForRemove = null;

function selectButtonForRemoveStorage(event) {
  selectButtonForRemove = event.target;
}

function doneFunction() {
  if (
    selectButtonForRemove &&
    selectButtonForRemove.classList.contains("tasktext")
  ) {
    selectButtonForRemove.classList.remove("tasktext");
    selectButtonForRemove.classList.toggle("tasktextdone");
    selectButtonForRemove.classList.toggle("focus");
  } else if (
    selectButtonForRemove &&
    selectButtonForRemove.classList.contains("tasktextdone")
  ) {
    selectButtonForRemove.classList.remove("tasktextdone");
    selectButtonForRemove.classList.remove("focus");
    selectButtonForRemove.classList.toggle("tasktext");
  }

  // Save to localStorage
  saveToLocalStorage();
}

document.addEventListener("click", function (event) {
  selectButtonForRemoveStorage(event);
});

if (doneButton) {
  doneButton.addEventListener("click", doneFunction);
}

//------------ save on localstorage API --------------//

function saveToLocalStorage() {
  const buttons = document.querySelectorAll(".tasktext");
  const data = [];

  buttons.forEach((button, index) => {
    const buttonData = {
      title: button.textContent,
      description: button.getAttribute("data-description"),
      

    };
    data.push(buttonData);
  });

  localStorage.setItem("buttonsData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("buttonsData");
  if (data) {
    const buttonsData = JSON.parse(data);
    var tasksContainer = document.querySelector(".row.tasks");
    
    // Create a map to store button descriptions
    const buttonDescriptions = {};

    // Store descriptions from buttonsData in the map
    buttonsData.forEach((buttonData) => {
      buttonDescriptions[buttonData.title] = buttonData.description;
    });

    // Clear existing buttons
    tasksContainer.innerHTML = "";

    // Create and append new buttons
    buttonsData.forEach((buttonData) => {
      const newButton = document.createElement("button");
      newButton.className = "tasktext";
      newButton.textContent = buttonData.title;

      // Set the data-description attribute using the map
      if (buttonDescriptions.hasOwnProperty(buttonData.title)) {
        newButton.setAttribute("data-description", buttonDescriptions[buttonData.title]);
      }

      newButton.addEventListener("click", function () {
        var description = document.querySelector(".description");
        var descriptionTitle = description.querySelector(".title");
        var descriptionSubtitle = description.querySelector(".subtitle");
        var descriptionText = description.querySelector(".textcontentdescription");
        descriptionTitle.textContent = buttonData.title;
        descriptionSubtitle.textContent = buttonData.title;

        if (newButton.hasAttribute("data-description")) {
          descriptionText.setAttribute("data-description", newButton.getAttribute("data-description"));
          descriptionText.textContent = descriptionText.getAttribute("data-description");
        } else {
          descriptionText.textContent = "No description available";
        }
      });

      tasksContainer.appendChild(newButton);
    });
  }
}


window.addEventListener("load", loadFromLocalStorage);