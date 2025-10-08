// In-memory storage
let tasks = [];
let editingId = null;
let currentPriority = 'medium';
let currentFilter = 'all';

// DOM Elements
const inputElm = document.getElementById("inputText");
const saveBtn = document.getElementById("saveBtn");
const notification = document.getElementById("notification");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const taskStats = document.getElementById("taskStats");
const formTitle = document.getElementById("formTitle");
const priorityBtns = document.querySelectorAll(".priority-btn");
const filterBtns = document.querySelectorAll(".filter-btn");

// Priority Selection
priorityBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        priorityBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentPriority = btn.dataset.priority;
    });
});

// Filter Selection
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        displayTasks();
    });
});

// Add/Update Task
saveBtn.addEventListener("click", saveTask);
inputElm.addEventListener("keypress", (e) => {
    if (e.key === "Enter") saveTask();
});

function saveTask() {
    const input = inputElm.value.trim();

    if (input === "") {
        showNotification("Please enter a task!", "error");
        inputElm.focus();
        return;
    }

    if (editingId !== null) {
        // Update existing task
        const task = tasks.find(t => t.id === editingId);
        if (task) {
            task.text = input;
            task.priority = currentPriority;
            task.updatedAt = new Date().toISOString();
        }
        showNotification("Task updated successfully!", "success");
        resetForm();
    } else {
        // Add new task
        const task = {
            id: Date.now(),
            text: input,
            priority: currentPriority,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.unshift(task);
        showNotification("Task added successfully!", "success");
    }

    inputElm.value = "";
    displayTasks();
    inputElm.focus();
}

// Display Tasks
function displayTasks(searchQuery = "") {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = 
            currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);
        return matchesSearch && matchesFilter;
    });

    updateStats();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class='bx bx-task'></i>
                <p>${searchQuery ? 'No tasks found' : 'No tasks yet. Create one to get started!'}</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const date = new Date(task.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });

        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        if (task.completed) taskItem.classList.add("completed");
        
        taskItem.innerHTML = `
            <div class="task-header">
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-meta">
                        <div class="task-date">
                            <i class='bx bx-calendar'></i>
                            ${formattedDate}
                        </div>
                        <div class="task-date">
                            <i class='bx bx-time'></i>
                            ${formattedTime}
                        </div>
                        <span class="priority-badge ${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn complete" onclick="toggleComplete(${task.id})" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        <i class='bx ${task.completed ? 'bx-undo' : 'bx-check'}'></i>
                    </button>
                    <button class="task-btn edit" onclick="editTask(${task.id})" title="Edit task">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="task-btn delete" onclick="deleteTask(${task.id})" title="Delete task">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// Toggle Complete
window.toggleComplete = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        displayTasks(searchInput.value);
    }
};

// Edit Task
window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingId = id;
        inputElm.value = task.text;
        currentPriority = task.priority;
        
        // Update priority buttons
        priorityBtns.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.priority === task.priority);
        });
        
        // Update UI
        formTitle.textContent = "Edit Task";
        saveBtn.innerHTML = '<i class="bx bx-save"></i> Update Task';
        saveBtn.className = 'update-btn';
        
        // Add cancel button
        if (!document.getElementById('cancelBtn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancelBtn';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.innerHTML = '<i class="bx bx-x"></i> Cancel';
            cancelBtn.onclick = resetForm;
            saveBtn.parentElement.appendChild(cancelBtn);
        }
        
        inputElm.focus();
        inputElm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Delete Task
window.deleteTask = function(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        displayTasks(searchInput.value);
        showNotification("Task deleted successfully!", "success");
    }
};

// Clear All Tasks
clearBtn.addEventListener("click", () => {
    if (tasks.length === 0) return;
    
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        displayTasks();
        showNotification("All tasks cleared!", "success");
    }
});

// Search
searchInput.addEventListener("input", (e) => {
    displayTasks(e.target.value);
});

// Reset Form
function resetForm() {
    editingId = null;
    inputElm.value = "";
    formTitle.textContent = "Add New Task";
    saveBtn.innerHTML = '<i class="bx bx-save"></i> Save Task';
    saveBtn.className = 'save-btn';
    
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.remove();
    
    currentPriority = 'medium';
    priorityBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.priority === 'medium');
    });
}

// Update Stats
function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    let statsText = `${total} Task${total !== 1 ? 's' : ''}`;
    if (total > 0) {
        statsText += ` (${active} active, ${completed} completed)`;
    }
    
    taskStats.textContent = statsText;
}

// Show Notification
function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "flex";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// Initialize
displayTasks();

// ScrollReveal Animations
ScrollReveal({
    distance: '60px',
    duration: 1000,
    delay: 100,
    reset: false
});

ScrollReveal().reveal('.add-box', { 
    origin: 'left',
    delay: 200
});

ScrollReveal().reveal('.display-data', { 
    origin: 'right',
    delay: 300
});