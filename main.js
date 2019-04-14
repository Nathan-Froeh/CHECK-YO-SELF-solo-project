/************  GLOBAL VARIABLES  ***********/
var storageArray = JSON.parse(localStorage.getItem('task')) || [];
var taskObjects = [];
var searchButton = document.querySelector('#btn__search');
var searchInput = document.querySelector('#input__search');
var titleInput = document.querySelector('#input__title');
var taskInput = document.querySelector('#input__item');
var addItem = document.querySelector('#btn__add__li');
var makeTaskButton = document.querySelector('#btn__make__list');
var clearButton = document.querySelector('#btn__clear');
var urgentFilter = document.querySelector('#btn__urgency__filter');
var toDoListItems = document.querySelector('#nav--list--items');
var toDoListBox = document.querySelector('.card__area');
var navList = document.querySelector('#nav--list--items')


/************  EVENT LISTENERS  ***********/

titleInput.addEventListener('keyup', allowAddItem);
taskInput.addEventListener('keyup', allowAddItem);
addItem.addEventListener('click', addAnItem);
clearButton.addEventListener('click', clearFields);
navList.addEventListener('click', checkDeleteButton)
makeTaskButton.addEventListener('click', initializeTask)
window.addEventListener('load', retrieveTask)
toDoListBox.addEventListener('click', taskSelector)

/************  UNIVERSAL FUNCTIONS  ***********/

function reinstantiate(i) {
  return new Task(storageArray[i].id, storageArray[i].title,
    storageArray[i].item, storageArray[i].urgent, storageArray[i].task);
};

function retrieveTask() {
  storageArray.forEach(function(task) {
    genToDoList(task);
    genToDoListItems(task);
  })
};

function taskSelector(event) {
  if (event.target.className === 'crd__li__check') {
    toggleCheckMark(event);
  } else if (event.target.className === 'crd__btn crd__urgent') {
    toggleUrgent(event);
  } else if (event.target.className === 'crd__btn crd__delete') {
    cardDelete(event);
  };
};


/***************  ADD TASK ITEMS  ******************/

function allowAddItem() {
  if (titleInput.value && taskInput.value !== '') {
    addItem.disabled = false;
	} else {
    addItem.disabled = true;
	};
};

function addAnItem() {
  event.preventDefault();
  var id = Date.now();
  genListItem(id);
  addItemToObject(id);
  checkActiveButtons();
};

function genListItem(id) {
  var taskListItem = `
  <li class='nav__li' data-id='${id}' id='${id}'>
    <input type='image' src='images/delete.svg' class='nav__li__delete'>
    <p class='nav__li__text'>${taskInput.value}</p>
  </li>`
  toDoListItems.insertAdjacentHTML('beforeend', taskListItem);
};

function addItemToObject(id) {
  var itemObject = {
    text:`${taskInput.value}`,
    id:`${id}`,
    checked: false
  };
  addObjectToArray(itemObject)
};

function addObjectToArray(object) {
  taskObjects.push(object);
};

function checkActiveButtons() {
  if (taskObjects.length > 0) {
    makeTaskButton.disabled = false;
    clearButton.disabled = false;
  } else {
    makeTaskButton.disabled = true;
    clearButton.disabled = true;
  };
};

/***************  MAKE TODO LIST  ******************/

function initializeTask() {
  event.preventDefault();
  var task = new Task(Date.now(), titleInput.value, taskObjects);
  storageArray.push(task);
  task.saveToStorage(storageArray);
  clearFields();
  genToDoList(task);
  genToDoListItems(task);
  checkActiveButtons();
};

function genToDoList(task) {
  var toDoCard = `
  <article class='task__card' data-id='crd--ul${task.id}' id='${task.id}'>
    <section class='crd--stn top--crd--stn'>
      <h3 class='crd__title'>${task.title}</h3>
    </section>
      <ul class='crd--ul' id='crd--ul${task.id}'>
      </ul>
      <section class='crd--stn bottom--crd--stn'>
        <div class='crd--urgent--div'>
          <input type='image' src='images/urgent.svg' id='crd__btn__urgent' class='crd__btn crd__urgent'>
          <p class='crd__text crd__urgent__text'>URGENT</p>
        </div>
        <div class='crd--delete--div'>
          <input type='image' src='images/delete.svg' id='crd__btn__delete' class='crd__btn crd__delete'>
          <p class='crd__text crd__delete__text'>DELETE</p>
        </div>
      </section>
    </article>`
    toDoListBox.insertAdjacentHTML('afterbegin', toDoCard)
};

function genToDoListItems(task) {
  var cardListItems = document.querySelector(`#crd--ul${task.id}`)
  task.item.forEach(function(item, index) {
    var taskListItem = `
    <li class='crd__li' data-id='${item.id}' id='${item.id}'>
      <input type='image' src='images/checkbox.svg' class='crd__li__check'>
      <p class='nav__li__text'>${item.text}</p>
    </li>`
    cardListItems.insertAdjacentHTML('beforeend', taskListItem);
  });
};

/***************  CLEAR INPUTS  ******************/

function clearFields() {
  event.preventDefault();
  titleInput.value = '';
  taskInput.value = '';
  clearListItems();
  clearArray();
};

function clearListItems() {
  taskObjects.forEach(function(item, index) {
    var element = document.getElementById(item.id);
    element.parentNode.removeChild(element);
 });
};

function clearArray() {
  taskObjects = [];
  checkActiveButtons();
}

/***************  DELETE LIST ITEM  ******************/

function checkDeleteButton(event) {
  if (event.target.className === 'nav__li__delete'){
    removeListItem(event)
  };
};

function removeListItem(event) {
  event.target.parentNode.remove();
};

/***************  CHECK ITEM COMPLETE  ******************/

function toggleCheckMark(event) {
  if (event.target.src.match('images/checkbox.svg')) {
   event.target.src = 'images/checkbox-active.svg'
  } else {
    event.target.src = 'images/checkbox.svg'
  };
  cardCheck(event);
};

function cardCheck(event) {
  console.log(storageArray)
  storageArray.forEach(function(task, index){
    var myTask = reinstantiate(index)
    if(parseInt(event.target.parentNode.id) === task.item[index].id) {
      console.log('it works')
      //myTask.updateTask(storageArray)

    }
    console.log(task.item)
    console.log(index)
    // console.log(event.target.parentNode.id)
    console.log(event.target.parentNode)
  });
};

/***************  MAKE LIST URGENT  ******************/

function toggleUrgent(event){
  if (event.target.src.match('images/urgent.svg')) {
    event.target.src = 'images/urgent-active.svg'
    var urgent = true;
  } else {
    event.target.src = 'images/urgent.svg'
    urgent = false;
  }
  cardUrgent(event, urgent)
};

function cardUrgent(event, urgent) {
  console.log(urgent)
  storageArray.forEach(function(task, index){
    var myTask = reinstantiate(index)
    if (parseInt(event.target.parentNode.parentNode.parentNode.id) === task.id) {
      myTask.updateTask(storageArray, urgent, index)
    };
  });
};

/***************  REMOVE TODO LIST  ******************/

function cardDelete(event) {
  storageArray.forEach(function(task, index){
    if (event.target.parentNode.id === task.id) {
      console.log('delete')
    }
  });
};