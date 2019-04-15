class Task {
  constructor(id, title, item, urgent, xButton){
    this.id =id;
    this.title = title;
    this.item = item;
    this.urgent = urgent || false;
    this.xButton = xButton || false;
  };
  saveToStorage(storageArray){
    localStorage.setItem('task', JSON.stringify(storageArray))
  };

  deleteFromStorage(storageArray, index){
    storageArray.splice(index, 1)
    this.saveToStorage(storageArray)
  };

  updateTask(storageArray, item, checked){
    item.checked = checked
    this.saveToStorage(storageArray)
  };

  updateToDo(storageArray, urgent, index){
    this.urgent = urgent;
    storageArray.splice(index, 1, this)
    this.saveToStorage(storageArray)
  };

  updateXButton(storageArray, x, index){
    this.xButton = x;
    storageArray.splice(index, 1, this)
    this.saveToStorage(storageArray)
  }
};