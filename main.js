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

/************  UNIVERSAL FUNCTIONS  ***********/

function reinstantiate(i){
  return new Task(starageArray[i].title, storageArray[i].item,
  storageArray[i].urgent, storageArray[i].id);
};

/***************  ADD TASK ITEMS  ******************/

function allowAddItem(){
  if (titleInput.value && taskInput.value !== '') {
    addItem.disabled = false;
	} else {
    addItem.disabled = true;
	};
};

function addAnItem(){
  event.preventDefault();
  var id = Date.now();
  genListItem(id);
  addItemToObject(id);
  checkActiveButtons();
};

function genListItem(id){
  var taskListItem = `
  <li class='nav__li' data-id='${id}' id='${id}'>
    <input type='img' src='img' class='nav__li__delete'>
    <p class='nav__li__text'>${taskInput.value}</p>
  </li>`
  toDoListItems.insertAdjacentHTML('beforeend', taskListItem);
};

function addItemToObject(id){
  var itemObject = {
    text:`${taskInput.value}`,
    id:`${id}`
  };
  addObjectToArray(itemObject)
};

function addObjectToArray(object){
  taskObjects.push(object);
};

function checkActiveButtons(){
  if(taskObjects.length > 0){
    makeTaskButton.disabled = false;
    clearButton.disabled = false;
  }else{
    makeTaskButton.disabled = true;
    clearButton.disabled = true;
  };
};

/***************  MAKE TODO LIST  ******************/

function initializeTask(){
  event.preventDefault();
  var task = new Task(Date.now(), titleInput.value, taskObjects);
  console.log(task)
  storageArray.push(task);
  task.saveToStorage(storageArray);
  //clearFields();
  genToDoList(task);
  genToDoListItems(task)
};

function genToDoList(task){
  var toDoCard = `
  <article class='task__card' data-id='crd--ul${task.id}'>
    <section class='crd--stn top--crd--stn'>
      <h3 class='crd__title'>${task.title}</h3>
    </section>
      <ul class='crd--ul' id='crd--ul${task.id}'>
      </ul>
      <section class='crd--stn bottom--crd--stn'>
        <div class='crd--urgent--div'>
          <input type='img' id='crd__btn__urgent' class='crd__btn'>
          <p class='crd__text crd__urgent__text'>URGENT</p>
        </div>
        <div class='crd--delete--div'>
          <input type='img' id='crd__btn__delete' class='crd__btn'>
          <p class='crd__text crd__delete__text'>DELETE</p>
        </div>
      </section>
    </article>`
    toDoListBox.insertAdjacentHTML('afterbegin', toDoCard)
};

function genToDoListItems(task){
  var cardListItems = document.querySelector(`#crd--ul${task.id}`)
  task.item.forEach(function(item, index){
    var taskListItem = `
    <li class='nav__li' data-id='${item.id}' id='${item.id}'>
      <input type='img' src='img' class='nav__li__delete'>
      <p class='nav__li__text'>${item.text}</p>
    </li>`
    cardListItems.insertAdjacentHTML('beforeend', taskListItem);
  })
}

/***************  CLEAR INPUTS  ******************/

function clearFields(){
  event.preventDefault();
  titleInput.value = '';
  taskInput.value = '';
  clearListItems();
  clearArray();
};

function clearListItems(){
  taskObjects.forEach(function(item, index){
    var element = document.getElementById(item.id);
    element.parentNode.removeChild(element);
 });
};

function clearArray(){
  taskObjects = [];
}

/***************  DELETE LIST ITEM  ******************/

function checkDeleteButton(event){
  if(event.target.className === 'nav__li__delete'){
    removeListItem(event)
  };
};

function removeListItem(event){
  event.target.parentNode.remove();
}

/***************  CHECK ITEM COMPLETE  ******************/

/***************  MAKE LIST URGENT  ******************/

/***************  REMOVE TODO LIST  ******************/