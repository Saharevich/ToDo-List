(function () {
  // Функция для сохранения данных в LocalStorage
  function saveDataToLocalStorage(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  }

  // Функция для загрузки данных из LocalStorage
  function loadDataFromLocalStorage(key) {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  }
  // Объединенная функция для сохранения данных в LocalStorage
  function saveData(key, data) {
    saveDataToLocalStorage(key, data);
  }

  // Объединенная функция для загрузки данных из LocalStorage
  function loadData(key) {
    return loadDataFromLocalStorage(key);
  }

  // Создаём функцию , которая будет создавать заголовок ToDO листа и возвращать его 
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }
  //Создаём функцию , которая будет создавать форму для ввода нового дела с кнопкой для добавления дела в список 
  function createTodoItemForm() {
    //Создаём переменные, которые дабавят на страницу все составляющие формы для добавления новых дел
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');
    // Добавляем классы для всех составляющих формы для дальнейшей стилизации этих элементов
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    // Добавляем созданные элементы на страницу нашего приложения
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    // Возвращаем на страницу ранее созданные переменные с присвоенными к ним значениями элементов
    return {
      form,
      input,
      button,
    };
  };

  // Создаём функцию , которая будет создавать наш список дел
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }
  // Создаём функцию , которая будет создавать наши дела(элементы списка)
  function createTodoItem(todoObj) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе 
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    // Присваиваем классы нашим элементам списка дел для их стилизации
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    // Задаём текст , который будет принимать наш элемент списка дел
    item.textContent = todoObj.name;
    // Присваиваем классы и наполняем текстом составляющие наших элементов списка
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success')
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';
    // Добавляем созданные составляющие элементов списка на страницу в тело элементов
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    if (todoObj.done) {
      item.classList.add('list-group-item-success');
    }
    // Возвращаем созданный ранее элемент списка с его составными частями
    return {
      id: todoObj.id,
      item,
      doneButton,
      deleteButton,
    };
  }
  // Создаём функцию, которая создаст всё тело списка дел , со всеми его составляющими
  function createTodoApp(container, title = 'Список дел', listName) {
    // Загружаем данные из LocalStorage при инициализации
    let todoItems = loadData(listName) || [];
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    // Загружаем созданные элементы приложения в основной контейнер
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
     // Проверяем наличие данных в LocalStorage и отрисовываем список дел
     if (todoItems.length > 0) {
      todoItems.forEach((todoObj) => {
      const todoItem = createTodoItem(todoObj);
      // Добавляем обработчики (слушатели событий) на кнопки
      todoItem.doneButton.addEventListener('click', function () {
        const todoObj = todoItems.find((item) => item.id === todoItem.id);
        if (todoObj) {
          todoObj.done = !todoObj.done;
          todoItem.item.classList.toggle('list-group-item-success');
          saveData(listName, todoItems); // Сохраняем данные после изменения
        }
      });
      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          const index = todoItems.findIndex((item) => item.id === todoItem.id);
          if (index !== -1) {
            todoItems.splice(index, 1);
            todoItem.item.remove();
            saveData(listName, todoItems); // Сохраняем данные после изменения
          }
        }
      });

      // Добавляем в список новое дело с названием из поля ввода
      todoList.append(todoItem.item);
    });
  }
    // Создём обработчик событий для кнопки добавления задачи в список дел и ставим парамметр для отмены перезагрузки страницыпри добавлении задачи в список задач
    todoItemForm.input.addEventListener('input', function() {
      todoItemForm.button.disabled = !todoItemForm.input.value.trim();
    });
    
    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value.trim()) {
        return;
      };

      const newTodoObj = {
        id: Date.now(),
        name: todoItemForm.input.value,
        done: false,
      };

      const todoItem = createTodoItem(newTodoObj);
      todoItems.push(newTodoObj);
      // Добавляем обработчики(слушатели событий) на кнопки
      todoItem.doneButton.addEventListener('click', function() {
        const todoObj = todoItems.find(item => item.id === todoItem.id);
        if (todoObj) {
            todoObj.done = !todoObj.done;
            todoItem.item.classList.toggle('list-group-item-success');
            saveData(listName, todoItems); // Сохраняем данные после изменения
        }
    });
      todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          const index = todoItems.findIndex(item => item.id === todoItem.id);
          if (index !== -1) {
            todoItems.splice(index, 1);
            todoItem.item.remove();
            saveData(listName, todoItems); // Сохраняем данные после изменения
          } 
        }
      });
      // Создаём и добавляем в список новое дело с названием из поля ввода
      todoList.append(todoItem.item);
      // Обнуляем значение в поле, чтобы не пришлось стирать его  в ручную
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;

      saveData(listName, todoItems); // Сохраняем данные после добавления нового дела
    });
    todoItemForm.button.disabled = true;
  }
  window.createTodoApp = createTodoApp;
})();
