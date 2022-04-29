interface TodoItem {
  text: string,
  completed: boolean,
}

enum Mode { NEW, EDIT }

let mode: Mode.NEW | Mode.EDIT = Mode.NEW;

const get = (selector: string): HTMLElement => {
  return document.querySelector(selector)!;
}

const todoList: Array<TodoItem> = JSON.parse(<string>localStorage.getItem('todos')) || []

const form = <HTMLFormElement>get("#form");
form.addEventListener('submit', (e: any) => {
  e.preventDefault();
  const field = <HTMLInputElement>get("#field");
  
  if (mode === Mode.NEW) {
    todoList.push({
      text: field.value,
      completed: false,
    })
  }

  else if (mode === Mode.EDIT) {
    const etarget: unknown = field.dataset.target;
    if (typeof etarget === 'string') todoList[+etarget].text = field.value;
    const btn = <HTMLButtonElement>get('#form-btn');
    btn.classList.replace('btn-primary', 'btn-success')
    btn.innerText = 'Add'
    field.dataset.target = undefined;
  }

  setBody(todoList)
  mode = Mode.NEW
  form.reset()
})

const setBody = (list: TodoItem[]): void => {
  const body = <HTMLDivElement>get("#todo-body");
  body.innerHTML = list.length < 1 ? 'Empty' : '';

  list.forEach((el: TodoItem, ind: number) => {
    const item = <HTMLDivElement>document.createElement("div");
    item.classList.add('list-group-item');
    if (el.completed) item.classList.add('list-group-item-secondary')
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
    body.appendChild(item)
  });

  localStorage.setItem('todos', JSON.stringify(list))
}
setBody(todoList)

// Utils
const toggleComplete = (index: number): void => {
  todoList[index].completed = !todoList[index].completed;
  setBody(todoList)
}

const edit = (index: number): void => {
  mode = Mode.EDIT;
  const input = <HTMLInputElement>get('#field');
  const btn = <HTMLButtonElement>get("#form-btn");
  btn.innerText = 'Update'
  btn.classList.replace('btn-success', 'btn-primary')
  input.value = todoList[index].text;
  input.dataset.target = String(index)
}

const remove = (index: number): void => {
  todoList.splice(index, 1)
  setBody(todoList)
}