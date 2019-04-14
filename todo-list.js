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

  updateTask(storageArray, urgent, index){
    this.urgent = urgent;
    storageArray.splice(index, 1, this) //this updated the array 
    this.saveToStorage(storageArray)
    console.log(storageArray)
  };
};