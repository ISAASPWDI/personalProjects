export function toDoList() {
    let numberOfTasks = []; // Maintain this for tracking tasks
    const showNumberTasks = () => {
        const $numberOfTasks = document.querySelector('.number-pending-tasks');
        $numberOfTasks.textContent = `You have pending ${numberOfTasks.length} tasks`;
    };

    const setDate = () => {
        const date = new Date();
        const $dayTask = document.querySelector('.day-task'),
            $monthTask = document.querySelector('.month-task'),
            $yearTask = document.querySelector('.year-task'),
            $nameDayTask = document.querySelector('.nameDay-task');
        if ($dayTask && $monthTask && $yearTask && $nameDayTask) {
            $dayTask.textContent = date.getDate();
            $monthTask.textContent = date.toLocaleDateString('en-US', { month: 'short' });
            $yearTask.textContent = date.getFullYear();
            $nameDayTask.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
        }
    };
    setDate();

    const $taskInput = document.querySelector('input[name="taskInput"]');
    document.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskId = $taskInput.dataset.editingId;

        if (taskId) {
            // Editing an existing task
            fetch('/editTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: taskId,
                    task: $taskInput.value,
                    done: false
                })
            })
                .then(response => response.json())
                .then(data => {
                    const $taskDiv = document.querySelector(`.div-task[data-id='${taskId}'] .task-text`);
                    if ($taskDiv) {
                        $taskDiv.textContent = data.task;
                    }
                    delete $taskInput.dataset.editingId;
                    $taskInput.value = '';
                    showNumberTasks();
                })
                .catch(error => console.error('Error updating task:', error));

        } else {
            // Adding a new task
            if ($taskInput.value !== '') {
                fetch('/addTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        task: $taskInput.value,
                        done: false
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        numberOfTasks.push(data); // Update the tasks array
                        const $fragment = document.createDocumentFragment();
                        const $addTaskSection = document.querySelector('.text-date');
                        const $div = document.createElement('div');
                        $div.classList.add('d-flex', 'justify-content-between', 'p-3', 'margin-task-style', 'mt-3', 'rounded', 'div-task');
                        $div.dataset.id = data.id;
                        $div.style.backgroundColor = 'rgb(154, 193, 121)';
                        $div.style.color = 'rgb(255, 255, 255)';

                        const $divContent = document.createElement('div'),
                            $taskParr = document.createElement('p'),
                            $divOptions = document.createElement('div'),
                            $linkEdit = document.createElement('a'),
                            $linkDelete = document.createElement('a'),
                            $iconEdit = document.createElement('i'),
                            $iconDelete = document.createElement('i');

                        // Div text task
                        $divContent.classList.add('d-flex', 'align-items-center', 'div-text-task', 'flex-column', 'text-start');
                        $taskParr.classList.add('mb-0', 'task-text', 'me-3');
                        $taskParr.textContent = data.task;
                        $taskParr.dataset.id = data.id;
                        $divContent.appendChild($taskParr);

                        // Div btn
                        $divOptions.classList.add('d-flex', 'align-items-center', 'div-btn-task');
                        // Edit btn
                        $linkEdit.classList.add('me-3', 'text-white', 'edit-icon-task');
                        $iconEdit.dataset.id = data.id;
                        $iconEdit.classList.add('bi', 'bi-pen-fill');
                        $linkEdit.appendChild($iconEdit);
                        $divOptions.appendChild($linkEdit);

                        // Delete btn
                        $linkDelete.classList.add('text-white', 'delete-icon-task');
                        $iconDelete.dataset.id = data.id;
                        $iconDelete.classList.add('bi', 'bi-trash-fill');
                        $linkDelete.appendChild($iconDelete);
                        $divOptions.appendChild($linkDelete);

                        $div.appendChild($divContent);
                        $div.appendChild($divOptions);
                        $fragment.appendChild($div);
                        $addTaskSection.appendChild($fragment);

                        // Clean the input value
                        $taskInput.value = '';
                        showNumberTasks();
                    })
                    .catch(error => console.error('Error:', error));
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clear-tasks-btn')) {
            const $divTask = document.querySelectorAll('.div-task');
            $divTask.forEach((divTask) => {
                divTask.remove();
            });
            numberOfTasks.length = 0; // Clear the tasks array
            showNumberTasks();
        }
    
        if (e.target.classList.contains('delete-icon-task') || e.target.classList.contains('bi-trash-fill')) {
            const taskId = e.target.dataset.id || e.target.closest('.bi-trash-fill').dataset.id;
            if (taskId) {
                fetch('/delTask', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: taskId })
                })
                    .then(res => res.json())
                    .then(data => {
                        const $taskDiv = document.querySelector(`.div-task[data-id='${taskId}']`);
                        if ($taskDiv) {
                            $taskDiv.remove();
                            numberOfTasks = numberOfTasks.filter(task => task.id !== parseInt(taskId)); // Update tasks array
                            showNumberTasks();
                            // Clean the input value
                            $taskInput.value = '';
                        }
                    })
                    .catch(error => console.error('Error deleting task:', error));
            } else {
                console.error('Task ID not found');
            }
        }
    
        if (e.target.classList.contains('edit-icon-task') || e.target.classList.contains('bi-pen-fill')) {
            const $divTask = e.target.closest('.div-task');
            if ($divTask) {
                const taskId = $divTask.dataset.id; // Get the ID from the parent div
                const $taskText = $divTask.querySelector('.task-text');
                if ($taskText) {
                    $taskInput.dataset.editingId = taskId; // Set the editing ID
                    $taskInput.value = $taskText.textContent; // Populate the input with the task text
                }
            }
        }
    
        if (e.target.classList.contains('task-text')) {
            const $divTask = e.target.closest('.div-task');
            const taskId = $divTask.dataset.id;
            const $taskTextElement = $divTask.querySelector('.task-text');
            fetch('/editTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: taskId,
                    task: $taskTextElement.textContent,
                    done: true
                })
            })
                .then(response => response.json())
                .then(data => {
                    $taskTextElement.style.textDecoration = 'line-through';
                    $taskTextElement.style.textDecorationColor = 'rgb(155,155,155)';
                    $taskTextElement.style.textDecorationThickness = '2px';
                    $taskTextElement.style.transition = '2s all ease';
                    $divTask.classList.add('task-disabled');
                    numberOfTasks = numberOfTasks.filter(task => task.id !== parseInt(taskId)); // Update tasks array
                    showNumberTasks();
                })
                .catch(error => console.error('Error updating task status:', error));
        }
    
        if (e.target.classList.contains('sort-task-btn')) {
            const $taskContainer = document.querySelector('.text-date'); // Container for tasks
            const $divTasks = Array.from(document.querySelectorAll('.div-task')); // Get all task divs
        
            // Sort tasks alphabetically based on the text content of the task
            $divTasks.sort((a, b) => {
                const taskA = a.querySelector('.task-text').textContent.toLowerCase();
                const taskB = b.querySelector('.task-text').textContent.toLowerCase();
                return taskA.localeCompare(taskB);
            });
        
            // Clear existing tasks from the task container only
            $divTasks.forEach(taskDiv => {
                taskDiv.remove(); // Remove each task element from the DOM
            });
        
            // Append sorted tasks back to the container
            $divTasks.forEach(taskDiv => {
                $taskContainer.appendChild(taskDiv);
            });
        
            console.log('Tasks sorted alphabetically.');
            showNumberTasks(); // Update the count of tasks if necessary
        }
    });
}