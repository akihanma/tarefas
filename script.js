// Array para armazenar as tarefas
var tasks = [];

// Referências dos elementos do DOM
var taskList = document.getElementById("task-list");
var taskInput = document.getElementById("task-input");
var pendingCount = document.getElementById("pending-count");
var clearCompletedBtn = document.getElementById("clear-completed-btn");

// Event listener para o formulário de adicionar tarefa
document.getElementById("add-task-form").addEventListener("submit", function(event) {
  event.preventDefault();
  addTask();
});

// Event listener para o botão "Limpar Tarefas Concluídas"
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

// Inicializar o sistema de tarefas
initTaskSystem();

// Função para inicializar o sistema de tarefas
function initTaskSystem() {
  loadTasks();
  renderTasks();
}

// Função para adicionar uma nova tarefa
function addTask() {
  var taskText = taskInput.value.trim();
  
  if (taskText !== "") {
    var task = {
      text: taskText,
      completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    taskInput.value = "";
  }
}

// Função para marcar uma tarefa como concluída
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Função para excluir uma tarefa
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Função para limpar todas as tarefas concluídas
function clearCompletedTasks() {
  tasks = tasks.filter(function(task) {
    return !task.completed;
  });
  saveTasks();
  renderTasks();
}

// Função para editar uma tarefa
function editTask(index, newText) {
  tasks[index].text = newText;
  saveTasks();
  renderTasks();
}

// Função para salvar as tarefas no armazenamento local
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para carregar as tarefas do armazenamento local
function loadTasks() {
  var storedTasks = localStorage.getItem("tasks");
  
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Função para renderizar as tarefas na interface
function renderTasks() {
  taskList.innerHTML = "";
  
  var pendingTaskCount = 0;
  
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    
    var listItem = document.createElement("li");
    
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", toggleTask.bind(null, i));
    
    var taskText = document.createElement("span");
    taskText.className = "task";
    taskText.textContent = task.text;
    if (task.completed) {
      taskText.classList.add("completed");
    }
    taskText.addEventListener("dblclick", startTaskEdit.bind(null, i));
    
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", deleteTask.bind(null, i));
    
    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(deleteButton);
    
    taskList.appendChild(listItem);
    
    if (!task.completed) {
      pendingTaskCount++;
    }
  }
  
  updatePendingCount(pendingTaskCount);
}

// Função para atualizar a contagem de tarefas pendentes
function updatePendingCount(count) {
  pendingCount.textContent = count;
}

// Função para iniciar a edição de uma tarefa
function startTaskEdit(index) {
  var taskText = taskList.children[index].querySelector(".task");
  var textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = taskText.textContent;
  textInput.classList.add("task-input");

  textInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      finishTaskEdit(index, textInput.value.trim());
    } else if (event.key === "Escape") {
      cancelTaskEdit(index);
    }
  });

  taskList.children[index].replaceChild(textInput, taskText);
  textInput.select();
}

// Função para finalizar a edição de uma tarefa
function finishTaskEdit(index, newText) {
  newText = newText.trim();

  if (newText !== "") {
    editTask(index, newText);
  } else {
    deleteTask(index);
  }
}

// Função para cancelar a edição de uma tarefa
function cancelTaskEdit(index) {
  renderTasks();
}
