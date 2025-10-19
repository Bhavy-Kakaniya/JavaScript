// select dom elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// try to load saved todos from local storage
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

function saveToDo() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// create node for todo object and add it to list
function createTodoNode(todo, index) {
    const li = document.createElement('li');

    // check box to toggle completion
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = !!todo.completed;
    checkBox.addEventListener("change", () => {
        todo.completed = checkBox.checked;
        // strike through when completed
        textSpan.style.textDecoration = todo.completed ? 'line-through' : "";
        saveToDo();
    })

    // text span
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.margin = '0 8px';
    if (todo.completed) {
        textSpan.style.textDecoration = 'line-through';
    }

    // double click to edit
    textSpan.addEventListener("dblclick", () => {
        const newText = prompt("Edit todo", todo.text);
        if (newText != null) {
            todo.text = newText.trim();
            textSpan.textContent = todo.text;
            saveToDo();
        }
    })

    // delete todo
    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render();
        saveToDo();
    })

    li.appendChild(checkBox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    return li;
}

// render whole todo list from todo array
function render() {
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        list.appendChild(node)
    });
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    // push new todo
    todos.push({ text, completed: false }); // text or text: text both means same
    input.value = '';
    render();
    saveToDo();
}

addBtn.addEventListener("click", addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') addTodo();
})
render();
