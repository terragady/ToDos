let todoList = [];

function saveList() {
  const stringifiedItems = JSON.stringify(todoList);
  window.localStorage.setItem('toDo', stringifiedItems);
}

function loadList() {
  const storage = window.localStorage.getItem('toDo');
  if (storage) {
    todoList = JSON.parse(storage);
  }
}

function renderTodo(todo) {
  const list = document.querySelector('.js-todo-list');
  let checked = '';
  if (todo.checked) { checked = 'done'; }
  list.innerHTML += `
    <li class="todo-item ${checked}" id="${todo.id}">
      <p class="todo-text">${todo.text}</p>
      <button class="delete-todo js-delete-todo">
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
  const list = document.querySelector('.js-todo-list');
  if (todoList.length === 0) list.innerHTML = '';
}

loadList();
init();

const form = document.querySelector('.js-todo-form');
const list = document.querySelector('.js-todo-list');
const deleteAll = document.querySelector('.js-delete-all-todo');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('.js-todo-input');
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});

list.addEventListener('click', (event) => {
  if (event.target.classList.contains('todo-item')) {
    const itemKey = event.target.getAttribute('id');
    toggleDone(itemKey);
  }
  if (event.target.classList.contains('todo-text')) {
    const itemKey = event.target.parentElement.getAttribute('id');
    toggleDone(itemKey);
  }

  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.getAttribute('id');
    deleteTodo(itemKey);
  }
});

deleteAll.addEventListener('click', () => {
  todoList = [];
  saveList();
  const all = document.querySelector('.js-todo-list');
  all.innerHTML = '';
});
