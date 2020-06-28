let todoList = [];

const form = document.querySelector('.js-todo__form');
const list = document.querySelector('.js-todo__list');
const clearDoneBtn = document.querySelector('.js-todo__clear-done-btn');
const clearAllBtn = document.querySelector('.js-todo__clear-all-btn');

// Functions

const loadList = () => {
  const saved = window.localStorage.getItem('todo');
  if (saved) {
    todoList = JSON.parse(saved);
  }
}

const saveList = () => {
  const stringified = JSON.stringify(todoList);
  window.localStorage.setItem('todo', stringified);
}

const renderTodo = (todo) => {
  let checked = '';
  if (todo.done) { checked = 'done'; }
  list.innerHTML += `
    <li class="todo__item ${checked}" id="${todo.id}">
      <p class="todo__text">${todo.text}</p>
      <button class="todo__remove-btn js-todo__remove">
        remove
      </button>
    </li>
  `;
}

const renderList = () => {
  list.innerHTML = '';
  todoList.forEach((e) => {
    renderTodo(e);
  });
}

const nextId = (array) => {
  const highestId = array.reduce((acc, curVal) => (curVal.id > acc ? curVal.id : acc), 0);
  return Number.parseInt(highestId, 0) + 1;
};

const addTodo = (text) => {
  const todo = {
    text,
    done: false,
    id: nextId(todoList),
  };
  todoList.push(todo);
  saveList();
  renderTodo(todo);
}

const toggleDone = (id) => {
  const index = todoList.findIndex((item) => item.id === Number.parseInt(id, 10));
  todoList[index].done = !todoList[index].done;
  saveList();

  const item = document.getElementById(id);
  item.classList.toggle('done');

  /* use for IE
    if (todoList[index].done) {
      item.classList.add('done');
    } else {
      Zitem.classList.remove('done');
    }
  */
}

const removeTodo = (id) => {
  todoList = todoList.filter((item) => item.id !== Number(id));
  saveList();
  const item = document.getElementById(id);
  item.remove();
  if (todoList.length === 0) list.innerHTML = '';
}

// Event listeners

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('.js-todo__input');
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});

list.addEventListener('click', (event) => {
  if (event.target.classList.contains('todo__item')) {
    const todoId = event.target.getAttribute('id');
    toggleDone(todoId);
  }
  if (event.target.classList.contains('todo__text')) {
    const todoId = event.target.parentElement.getAttribute('id');
    toggleDone(todoId);
  }
  if (event.target.classList.contains('todo__remove-btn')) {
    const todoId = event.target.parentElement.getAttribute('id');
    removeTodo(todoId);
  }
});

clearDoneBtn.addEventListener('click', () => {
  todoList = todoList.filter((e) => !e.done);
  saveList();
  renderList();
});

clearAllBtn.addEventListener('click', () => {
  todoList = [];
  saveList();
  renderList();
});

// exec

loadList();
renderList();
