"use strict";
var Mode;
(function (Mode) {
    Mode[Mode["NEW"] = 0] = "NEW";
    Mode[Mode["EDIT"] = 1] = "EDIT";
})(Mode || (Mode = {}));
let mode = Mode.NEW;
const get = (selector) => {
    return document.querySelector(selector);
};
const todoList = JSON.parse(localStorage.getItem('todos')) || [];
const form = get("#form");
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = get("#field");
    if (mode === Mode.NEW) {
        todoList.push({
            text: field.value,
            completed: false,
        });
    }
    else if (mode === Mode.EDIT) {
        const etarget = field.dataset.target;
        if (typeof etarget === 'string')
            todoList[+etarget].text = field.value;
        const btn = get('#form-btn');
        btn.classList.replace('btn-primary', 'btn-success');
        btn.innerText = 'Add';
        field.dataset.target = undefined;
    }
    setBody(todoList);
    mode = Mode.NEW;
    form.reset();
});
const setBody = (list) => {
    const body = get("#todo-body");
    body.innerHTML = list.length < 1 ? 'Empty' : '';
    list.forEach((el, ind) => {
        const item = document.createElement("div");
        item.classList.add('list-group-item');
        if (el.completed)
            item.classList.add('list-group-item-secondary');
        item.dataset.id = String(ind);
        item.innerHTML = `
    <div class="row">
      <div class="col">
        <span 
          class="c-pointer 
          ${el.completed ? 'text-decoration-line-through' : ''}"
          onclick="toggleComplete(${ind})">
          ${el.text}
        </span>
      </div>
      <div class="col col-3">
        <div class="d-flex gap-1 justify-content-end">
          <button
            onclick="edit(${ind})" 
            class="btn btn-sm btn-outline-primary">Edit</button>
          <button 
            onclick="remove(${ind})"
            class="btn btn-sm btn-outline-danger">Delete</button>
        </div>
      </div>
    </div>`;
        body.appendChild(item);
    });
    localStorage.setItem('todos', JSON.stringify(list));
};
setBody(todoList);
// Utils
const toggleComplete = (index) => {
    todoList[index].completed = !todoList[index].completed;
    setBody(todoList);
};
const edit = (index) => {
    mode = Mode.EDIT;
    const input = get('#field');
    const btn = get("#form-btn");
    btn.innerText = 'Update';
    btn.classList.replace('btn-success', 'btn-primary');
    input.value = todoList[index].text;
    input.dataset.target = String(index);
};
const remove = (index) => {
    todoList.splice(index, 1);
    setBody(todoList);
};
