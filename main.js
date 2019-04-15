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
    checkUrgent(task)
  });
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
  checkUrgent(task);
  clearFields();
  checkActiveButtons();
};

function checkUrgent(task) {
  var urgent;
  task.urgent ? urgent = 'images/urgent-Active.svg' : urgent = 'images/urgent.svg'
  genToDoList(task, urgent)
  checkCheckMark(task)
};

function genToDoList(task, urgent) {
  var toDoCard = `
  <article class='task__card' data-id='crd--ul${task.id}' id='${task.id}'>
    <section class='crd--stn top--crd--stn'>
      <h3 class='crd__title'>${task.title}</h3>
    </section>
      <ul class='crd--ul' id='crd--ul${task.id}' data-id='${task.id}'>
      </ul>
      <section class='crd--stn bottom--crd--stn'>
        <div class='crd--urgent--div'>
          <input type='image' src=${urgent} id='crd__btn__urgent' class='crd__btn crd__urgent'>
          <p class='crd__text crd__urgent__text'>URGENT</p>
        </div>
        <div class='crd--delete--div'>
          <input type='image' src='images/delete.svg' id='crd__btn__delete' class='crd__btn crd__delete' disabled>
          <p class='crd__text crd__delete__text'>DELETE</p>
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
  // console.log(event.target.parentNode.childNodes[3].classList)
};

function cardCheck(event, checked) {
  // console.log(storageArray)
  storageArray.forEach(function(task, index) {
    var myTask = reinstantiate(index)
    // console.log(event.target.parentNode.parentNode)
    // console.log(task)
    if(parseInt(event.target.parentNode.parentNode.dataset.id) === task.id) {
      searchDeleteCard(event, task)
    }
    taskCheck(event, task, myTask, checked)
  });
};

function taskCheck(event, task, myTask, checked) {
  task.item.forEach(function(item, index) {
    if (item.id === event.target.parentNode.dataset.id) {
      myTask.updateTask(storageArray, item, checked)
    }
  })
}


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
      myTask.updateToDo(storageArray, urgent, index)
    };
  });
};

/***************  REMOVE TODO LIST  ******************/
// task = each card
// item = each list item
// index = index of list item

function searchDeleteCard(event, task) {
  var finished = 0;
  task.item.forEach(function(item, index) {
    if (item.checked === true) {
      finished++
      console.log(task.item)
      //console.log(finished)
      //console.log(task.item.length)
      console.log(item.checked)
    } if (task.item.length === finished) {
      searchItemDelete(event, active = true)
    } else {searchItemDelete(event, active = false)}
    // console.log(finished)
    // console.log(active)
    // console.log(task.item.length)
    console.log(item.checked)
  })
}

function searchItemDelete(event, active) {
  // console.log(event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1])
  //console.log(event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[3])
  // console.log(active)
  // console.log(active)
  if (active === true) {
    // console.log('true')
    event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1].src = 'images/delete-active.svg'
  } else {
    event.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].childNodes[1].src = 'images/delete.svg'
    // console.log('false')
  }
}

function cardDelete(event) {
  console.log('delete')
  storageArray.forEach(function(task, index){
    if (parseInt(event.target.parentNode.parentNode.parentNode.id) === task.id) {
      console.log('delete')
    }
  });
};
