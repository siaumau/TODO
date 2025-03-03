document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    initDragAndDrop();
});

function updateStats() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const completedCount = todos.filter(todo => todo.completed).length;
    const incompleteCount = todos.length - completedCount;

    document.getElementById("complete-count").textContent = completedCount;
    document.getElementById("incomplete-count").textContent = incompleteCount;
}

function addTodo() {
    const input = document.getElementById("todo-input");
    const task = input.value.trim();
    if (task === "") return;

    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push({
        text: task,
        completed: false,
        id: Date.now()
    });
    localStorage.setItem("todos", JSON.stringify(todos));

    input.value = "";
    loadTodos();
}

function loadTodos() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach((todo) => {
        const li = document.createElement("li");
        li.draggable = true;
        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="drag-handle">⋮⋮</div>
            <div class="checkbox ${todo.completed ? 'checked' : ''}"
                 onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" onclick="removeTodo(${todo.id})">×</button>
        `;
        todoList.appendChild(li);
    });

    updateStats();
}

function toggleTodo(id) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        localStorage.setItem("todos", JSON.stringify(todos));
        loadTodos();
    }
}

function removeTodo(id) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const filteredTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
    loadTodos();
}

// 添加回車鍵支持
document.getElementById("todo-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTodo();
    }
});

function initDragAndDrop() {
    const todoList = document.getElementById("todo-list");
    let draggedItem = null;

    todoList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        if (e.target.tagName === 'LI') {
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    todoList.addEventListener('dragend', (e) => {
        if (e.target.tagName === 'LI') {
            e.target.classList.remove('dragging');
        }
    });

    todoList.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'LI') {
            const bounding = e.target.getBoundingClientRect();
            const offset = bounding.y + bounding.height / 2;
            if (e.clientY - offset > 0) {
                e.target.style.borderBottom = 'solid 2px var(--primary-color)';
                e.target.style.borderTop = '';
            } else {
                e.target.style.borderTop = 'solid 2px var(--primary-color)';
                e.target.style.borderBottom = '';
            }
        }
    });

    todoList.addEventListener('dragleave', (e) => {
        if (e.target.tagName === 'LI') {
            e.target.style.borderTop = '';
            e.target.style.borderBottom = '';
        }
    });

    todoList.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'LI' && draggedItem) {
            const items = [...todoList.querySelectorAll('li')];
            const todos = JSON.parse(localStorage.getItem("todos")) || [];
            const fromIndex = items.indexOf(draggedItem);
            let toIndex = items.indexOf(e.target);

            const bounding = e.target.getBoundingClientRect();
            const offset = bounding.y + bounding.height / 2;
            if (e.clientY - offset > 0) {
                toIndex++;
            }

            // 更新數組順序
            const [removed] = todos.splice(fromIndex, 1);
            todos.splice(toIndex, 0, removed);

            // 保存新順序
            localStorage.setItem("todos", JSON.stringify(todos));
            loadTodos();
        }

        // 清除所有臨時樣式
        todoList.querySelectorAll('li').forEach(item => {
            item.style.borderTop = '';
            item.style.borderBottom = '';
        });
    });
}
