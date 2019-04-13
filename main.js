/************  GLOBAL VARIABLES  ***********/
var storageArray;
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



/************  EVENT LISTENERS  ***********/

titleInput.addEventListener('keyup', allowAddItem);
taskInput.addEventListener('keyup', allowAddItem);
addItem.addEventListener('click', addAnItem)
clearButton.addEventListener('click', clearFields)

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
  <li class='nav__li'>
    <input type='img' src='img' data-id='${id}' class='nav__li__delete'>
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
  console.log(taskObjects)
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

function createTask(e){
  event.preventDefault();
  var task = new task(Date.now(), titleInput.value, taskInput.value);
  storageArray.push(task);
  task.saveToStorage(storageArray);
};

/***************  CLEAR INPUTS  ******************/

function clearFields(){
  event.preventDefault();
  //titleInput.innerText = '';
  //taskInput.innerText = '';
  clearListItems();
  //clearArray();
};

function clearListItems(){
 taskObjects.forEach(function(item, index){
  console.log(item.id + ' ! ' + index)
  
 });
};

function clearArray(){
  taskObjects = [];
}

/***************  DELETE LIST ITEM  ******************/

/***************  CHECK ITEM COMPLETE  ******************/

/***************  MAKE LIST URGENT  ******************/

/***************  REMOVE TODO LIST  ******************/