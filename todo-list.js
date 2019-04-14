class Task {
  constructor(id, title, item, urgent, task){
    this.id =id;
    this.title = title;
    this.item = item;
    this.urgent = urgent || false;
    this.task = task || false;
  };
  saveToStorage(storageArray){
    localStorage.setItem('task', JSON.stringify(storageArray))
  };

  deleteFromStorage(){

  };

  updateToDo(){

  };

  updateTask(storageArray, urgent){
    this.urgent = urgent;
    this.saveToStorage(storageArray)
    console.log(storageArray)
  };
};