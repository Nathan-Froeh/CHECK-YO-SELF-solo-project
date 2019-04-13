class Task {
  constructor(id, title, item, urgent){
    this.id =id;
    this.title = title;
    this.item = item;
    this.urgent = urgent || false;
  };
  saveToStorage(storageArray){
    localStorage.setItem('task', JSON.stringify(storageArray))
  };

  deleteFromStorage(){

  };

  updateToDo(){

  };

  updateTask(){

  };
}