
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
var toDoListBox = document.querySelector('#card__area');
var navList = document.querySelector('#nav--list--items')
var message = document.querySelector('#message')
var messageUrgent = document.querySelector('#urgent__message')

/************  EVENT LISTENERS  ***********/

titleInput.addEventListener('keyup', allowAddItem);
taskInput.addEventListener('keyup', allowAddItem);
addItem.addEventListener('click', addAnItem);
clearButton.addEventListener('click', clearFields);
navList.addEventListener('click', checkDeleteButton)
makeTaskButton.addEventListener('click', initializeTask)
window.addEventListener('load', retrieveTask)
toDoListBox.addEventListener('click', taskSelector)
searchInput.addEventListener('keyup', filterSearch)
urgentFilter.addEventListener('click', checkForUrgent)

/************  UNIVERSAL FUNCTIONS  ***********/

function reinstantiate(i) {
  return new Task(storageArray[i].id, storageArray[i].title,
    storageArray[i].item, storageArray[i].urgent, storageArray[i].xButton);
};

function retrieveTask() {
  storageArray.forEach(function(task) {
    checkUrgent(task)
  });
  makeToDoMessage()
};

function taskSelector(event) {
  if (event.target.className === 'crd__li__check') {
    toggleCheckMark(event);
    toggleCheckText(event);
  } else if (event.target.className === 'crd__btn crd__urgent') {
    toggleUrgent(event);
  } else if (event.target.className === 'crd__btn crd__delete') {
    cardDelete(event);
  };
};

function makeToDoMessage(){
  if (storageArray.length > 0) {
    message.className = 'message__inactive';
    toDoListBox.className = 'card__area';
  } else {
    message.className = 'message__active';
    toDoListBox.className = 'no__card__area';
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
  makeToDoMessage();
  checkUrgent(task);
  clearFields();
  checkActiveButtons();
};

function checkUrgent(task) {
  var urgent;
  task.urgent ? urgent = 'images/urgent-Active.svg' : urgent = 'images/urgent.svg'
  task.urgent ? urgentCSS = '__urgent' : urgentCSS = ''
  checkXButton(task, urgent, urgentCSS)
  checkCheckMark(task)
};

function checkXButton(task, urgent, urgentCSS){
  task.xButton ? x = 'images/delete-active.svg' : x = 'images/delete.svg'
  task.xButton ? xText = 'crd__delete__text' : xText = 'crd__text'
  task.xButton ? xDisable = '' : xDisable = 'disabled'
  genToDoList(task, urgent, x, xText, urgentCSS, xDisable)
}

function genToDoList(task, urgent, x, xText, urgentCSS, xDisable) {
  var toDoCard = `
  <article class='task__card${urgentCSS}' data-id='crd--ul${task.id}' id='${task.id}'>
    <section class='crd--stn top--crd--stn'>
      <h3 class='crd__title'>${task.title}</h3>
    </section>
      <ul class='crd--ul${urgentCSS}' id='crd--ul${task.id}' data-id='${task.id}'>
      </ul>
      <section class='crd--stn bottom--crd--stn'>
        <div class='crd--urgent--div'>
          <input type='image' src=${urgent} id='crd__btn__urgent' class='crd__btn crd__urgent'>
          <p class='crd__text${urgentCSS}'>URGENT</p>
        </div>
        <div class='crd--delete--div'>
          <input type='image' src=${x} id='crd__btn__delete' class='crd__btn crd__delete' ${xDisable}>
          <p class=${xText}>DELETE</p>
        </div>
      </section>
    </article>`
    toDoListBox.insertAdjacentHTML('afterbegin', toDoCard)
};

function checkCheckMark(task) {
  task.item.forEach(function(item, index) {
  if (task.item[index].checked === true) {
    var src = 'images/checkbox-active.svg';
    var myClass = 'crd__li__checked';
  } else {
    src = 'images/checkbox.svg';
    myClass = 'crd__li__uncheck';
  } genToDoListItems(task, item, src, myClass);
  });
};

function genToDoListItems(task, item, src, myClass) {
  var cardListItems = document.querySelector(`#crd--ul${task.id}`)
    var taskListItem = `
    <li class='crd__li' data-id='${item.id}' id='${item.id}'>
      <input type='image' src=${src} class='crd__li__check'>
      <p class='${myClass} crd__li__uncheck'>${item.text}</p>
    </li>`
    cardListItems.insertAdjacentHTML('beforeend', taskListItem);
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

function toggleCheckText(event){
  if (event.target.src.match('images/checkbox-active.svg')) {
    console.log('checked')
    event.target.parentNode.childNodes[3].classList.add('crd__li__checked')
   } else {
    event.target.parentNode.childNodes[3].classList.remove('crd__li__checked')
    console.log('unchecked')
   };
}

function toggleCheckMark(event) {
  if (event.target.src.match('images/checkbox.svg')) {
   event.target.src = 'images/checkbox-active.svg'
   var checked = true;
  } else {
    event.target.src = 'images/checkbox.svg'
    checked = false;
  };
  cardCheck(event, checked);
};

function cardCheck(event, checked) {
  storageArray.forEach(function(task, index) {
    var myTask = reinstantiate(index)
    taskCheck(event, task, myTask, checked)
  });
};

function taskCheck(event, task, myTask, checked) {
  task.item.forEach(function(item, index) {
    if (item.id === event.target.parentNode.dataset.id) {
      myTask.updateTask(storageArray, item, checked)
      searchForDeleteCard(event)
    }
  })
}

/***************  MAKE LIST URGENT  ******************/

function toggleUrgent(event){
  console.log(event.target.parentNode.parentNode.parentNode.childNodes[3])
  if (event.target.src.match('images/urgent.svg')) {
    urgentTrue(event)
  } else {
    urgentFalse(event)
  };
};

function urgentTrue(event){
  event.target.src = 'images/urgent-active.svg'
  event.target.parentNode.parentNode.parentNode.classList = 'task__card__urgent';
  event.target.parentNode.parentNode.parentNode.childNodes[3].classList = 'crd--ul__urgent'
  event.target.parentNode.childNodes[3].classList = 'crd__text__urgent'
  var urgent = true;
  cardUrgent(event, urgent)
}

function urgentFalse(event){
  event.target.src = 'images/urgent.svg'
  event.target.parentNode.parentNode.parentNode.classList = 'task__card';
  event.target.parentNode.parentNode.parentNode.childNodes[3].classList = 'crd--ul'
  event.target.parentNode.childNodes[3].classList = 'crd__text'
  var urgent = false;
  cardUrgent(event, urgent)
}

function cardUrgent(event, urgent) {
  storageArray.forEach(function(task, index){
    var myTask = reinstantiate(index)
    if (parseInt(event.target.parentNode.parentNode.parentNode.id) === task.id) {
      myTask.updateToDo(storageArray, urgent, index)
    };
  });
};

/***************  REMOVE TODO LIST  ******************/

function searchForDeleteCard(event) {
  storageArray.forEach(function(task, index) {
    var myTask = reinstantiate(index)
    if (parseInt(event.target.parentNode.parentNode.dataset.id) === task.id) {
      searchForItemDelete(event, task, myTask, index)
    };
});
};

function searchForItemDelete(event, task, myTask, index) {
  var finished = 0;
  task.item.forEach(function(item) {
    if (item.checked === true) {
      finished++
    };
    if (task.item.length === finished) {
      updateDelete(event, active = true, myTask, index);
    } else {updateDelete(event, active = false, myTask, index)};
  });
};

function updateDelete(event, active, myTask, index) {
  if (active === true) {
    deleteTrue(event, myTask, index);
  } else {
    deleteFalse(event, myTask, index);
  };
};

function deleteTrue(event, myTask, index) {
  event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1].disabled = false;
  event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[3].classList = 'crd__delete__text';
  event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1].src = 'images/delete-active.svg';
  var x = true;
  myTask.updateXButton(storageArray, x, index);
};

function deleteFalse(event, myTask, index) {
  event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1].disabled = true;
  event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[3].classList = 'crd__text';
  event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1].src = 'images/delete.svg';
  var x = false;
  myTask.updateXButton(storageArray, x, index);
};

function cardDelete(event) {
  event.target.parentNode.parentNode.parentNode.remove();
  storageArray.forEach(function(task, index) {
    var myTask = reinstantiate(index);
    if (parseInt(event.target.parentNode.parentNode.parentNode.id) === task.id) {
      console.log('delete')
      myTask.deleteFromStorage(storageArray, index)
    };
  });
  makeToDoMessage();
};

/************  SEARCHAREA  *************/

function filterSearch() {
  var search = searchInput.value.toUpperCase();
  var searchArray = [];
  storageArray.forEach(function(item) {
    var title = item.title.toUpperCase()
    if (title.indexOf(search) > -1) {
      searchArray.unshift(item);
      genFiltered(searchArray);
    };
  });
};

function genFiltered(searchArray) {
  console.log(searchArray)
  toDoListBox.innerHTML = '';
  searchArray.forEach(function(item){
    checkUrgent(item)
  });
};

/***************  FILTER BY URGENT  ***************/

function filterUrgent() {
  var urgentArray = [];
  storageArray.forEach(function(item) {
    if (item.urgent === true) {
      urgentArray.push(item)
    } 
  })
  urgentCounter(urgentArray)
}

function urgentCounter(urgentArray){
  if (urgentArray.length > 0){
    urgentIsTrue(urgentArray)
  } else {
    urgentIsFalse()
  }
}

function checkForUrgent() {
  if (urgentFilter.className === 'btn btn__urgency__filter') {
    urgentFilter.className = 'btn btn__urgency__filter__active';
    filterUrgent();
  } else {
    urgentFilter.className = 'btn btn__urgency__filter';
    toDoListBox.innerHTML = '';
    retrieveTask();
  }
}

function urgentIsFalse(){
  toDoListBox.innerHTML = `
  <p class='message__active' id='urgent__message'>You have nothing urgent today</p>`;
  toDoListBox.className = 'no__card__area';
}

function urgentIsTrue(urgentArray){
  toDoListBox.className = 'card__area';
  genFiltered(urgentArray)
}

// css outline: none