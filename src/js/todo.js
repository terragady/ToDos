let todoList = [];

const form = document.querySelector('.js-todo__form');
const list = document.querySelector('.js-todo__list');
const clearAllBtn = document.querySelector('.js-todo__clear-all-btn');
const clearDoneBtn = document.querySelector('.js-todo__clear-done-btn');

function saveList() {
  const stringifiedItems = JSON.stringify(todoList);
  window.localStorage.setItem('todo', stringifiedItems);
}

function loadList() {
  const storage = window.localStorage.getItem('todo');
  if (storage) {
    todoList = JSON.parse(storage);
  }
}

function renderTodo(todo) {
  let checked = '';
  if (todo.checked) { checked = 'done'; }
  list.innerHTML += `
    <li class="todo__item ${checked}" id="${todo.id}">
      <p class="todo__text">${todo.text}</p>
      <button class="todo__remove-btn js-todo__remove">
        remove
      </button>
    </li>
  `;
}

function init() {
  todoList.forEach((e) => {
    renderTodo(e);
  });
}

const nextId = (array) => {
  const highestId = array.reduce((acc, curVal) => (curVal.id > acc ? curVal.id : acc), 0);
  return Number.parseInt(highestId, 0) + 1;
};

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: nextId(todoList),
  };
  todoList.push(todo);
  saveList();
  renderTodo(todo);
}

function toggleDone(id) {
  const index = todoList.findIndex((item) => item.id === Number.parseInt(id, 10));
  todoList[index].checked = !todoList[index].checked;
  saveList();

  const item = document.getElementById(id);
  if (todoList[index].checked) {
    item.classList.add('done');
  } else {
    item.classList.remove('done');
  }
}

function deleteTodo(id) {
  todoList = todoList.filter((item) => item.id !== Number(id));
  saveList();
  const item = document.getElementById(id);
  item.remove();
  if (todoList.length === 0) list.innerHTML = '';
}

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
    const itemKey = event.target.getAttribute('id');
    toggleDone(itemKey);
  }
  if (event.target.classList.contains('todo__text')) {
    const itemKey = event.target.parentElement.getAttribute('id');
    toggleDone(itemKey);
  }
  if (event.target.classList.contains('todo__remove-btn')) {
    const itemKey = event.target.parentElement.getAttribute('id');
    deleteTodo(itemKey);
  }
});

clearAllBtn.addEventListener('click', () => {
  todoList = [];
  saveList();
  list.innerHTML = '';
});

clearDoneBtn.addEventListener('click', () => {
  todoList = todoList.filter((e) => !e.checked);
  saveList();
  list.innerHTML = '';
  init();
});

loadList();
init();
