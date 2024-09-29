export function toDoList() {
    let numberOfTasks = [];
    const showNumberTasks = () => {
        const $numberOfTasks = document.querySelector('.number-pending-tasks');
        $numberOfTasks.textContent = `You have pending ${numberOfTasks.length} tasks`;
    }
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
    }
    setDate();
    const $taskInput = document.querySelector('input[name="taskInput"]');
    document.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskId = $taskInput.dataset.editingId;

        if (taskId) {
            // Si hay un ID, estamos editando una tarea existente
            fetch('/.netlify/functions/api/editTask', {
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
                    console.log('Tarea actualizada:', data);
                    // Actualiza la tarea en el DOM si es necesario
                    const $taskDiv = document.querySelector(`.div-task[data-id='${taskId}'] .task-text`);
                    if ($taskDiv) {
                        $taskDiv.textContent = data.task;
                    }
                    // Limpia el input y el dataset
                    delete $taskInput.dataset.editingId;
                    $taskInput.value = '';
                })
                .catch(error => console.error('Error updating task:', error));

        } else {
            // Si no hay un ID, estamos agregando una nueva tarea
            if ($taskInput.value !== '') {
                fetch('/.netlify/functions/api/addTask', {
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


                        numberOfTasks.push(data);
                        const $fragment = document.createDocumentFragment();
                        const $addTaskSection = document.querySelector('.text-date');
                        // create general div
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

                        // div text task
                        $divContent.classList.add('d-flex', 'align-items-center', 'div-text-task','flex-column','text-start');
                        $taskParr.classList.add('mb-0', 'task-text', 'me-3');
                        $taskParr.textContent = data.task;
                        $taskParr.dataset.id = data.id;
                        $taskParr.style.textAlign = 'justify';
                        $divContent.appendChild($taskParr);

                        // div btn
                        $divOptions.classList.add('d-flex', 'align-items-center', 'div-btn-task');
                        // edit btn
                        $linkEdit.classList.add('me-3', 'text-white', 'edit-icon-task');
                        $divOptions.appendChild($linkEdit);
                        $iconEdit.dataset.id = data.id;
                        $iconEdit.classList.add('bi', 'bi-pen-fill');
                        $linkEdit.appendChild($iconEdit);

                        // delete btn
                        $linkDelete.classList.add('text-white', 'delete-icon-task');
                        $divOptions.appendChild($linkDelete);
                        $iconDelete.dataset.id = data.id;
                        $iconDelete.classList.add('bi', 'bi-trash-fill');
                        $linkDelete.appendChild($iconDelete);

                        $div.appendChild($divContent);
                        $div.appendChild($divOptions);
                        $fragment.appendChild($div);
                        $addTaskSection.appendChild($fragment);

                        // clean the input value
                        $taskInput.value = '';
                        showNumberTasks();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clear-tasks-btn')) {
            const $divTask = document.querySelectorAll('.div-task');
            $divTask.forEach((divTask) => {
                divTask.remove();
            });
            numberOfTasks.length = 0;
            showNumberTasks();
        }
        if (e.target.classList.contains('delete-icon-task') || e.target.classList.contains('bi-trash-fill')) {
            const taskId = e.target.dataset.id || e.target.closest('.bi-trash-fill').dataset.id;
            if (taskId) {
                fetch('/.netlify/functions/api/delTask', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: taskId })

                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        
                        const $taskDiv = document.querySelector(`.div-task[data-id='${taskId}']`);
                        if ($taskDiv) {
                            $taskDiv.remove();
                            if (numberOfTasks.length > 0) numberOfTasks.length--;
                            showNumberTasks();
                            //clean the input value
                            $taskInput.value = '';
                        }

                    })
                    .catch(error => console.error('Error deleting task:', error));
            } else {
                console.error('Task ID not found');
            }

        }
        if (e.target.classList.contains('edit-icon-task') || e.target.classList.contains('bi-pen-fill')) {
            const taskId = e.target.dataset.id || e.target.closest('.bi-pen-fill').dataset.id;
            const $taskText = document.querySelector(`.task-text[data-id="${taskId}"]`);
            $taskInput.dataset.editingId = taskId;
            $taskInput.value = $taskText.textContent;

        }
        if (e.target.closest('task-text') || e.target.classList.contains('task-text') || e.target.classList.contains('div-task')) {
            const $divTask = e.target.closest('.div-task');
            const $divTaskId = $divTask.dataset.id;
            const $taskTextContent = $divTask.querySelector('.task-text').textContent;
            fetch('/.netlify/functions/api/editTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: $divTaskId,
                    task: $taskTextContent,
                    done: true
                })
            })
                .then(response => response.json())
                .then(data => {
                    const $divTextTask = $divTask.querySelector('.div-text-task')
                    const $taskTextSibling = $divTask.querySelector('.task-text').nextElementSibling
                    const taskStatus = document.createElement('p')
                    taskStatus.classList.add('mb-0')
                    taskStatus.textContent = `Task Completed`
                    if (!$taskTextSibling) {
                        $divTextTask.insertAdjacentElement('beforeend',taskStatus)
                    }
                    $divTask.classList.add('task-disabled');
                    const $taskTextElement = $divTask.querySelector('.task-text');
                    $taskTextElement.style.textDecoration = 'line-through';
                    $taskTextElement.style.textDecorationColor = 'rgb(155,155,155)';
                    $taskTextElement.style.textDecorationThickness = '2px';
                    $taskTextElement.style.transition = '2s all ease';
                    const $divBtnTask = $divTask.querySelector('.div-btn-task');
                    $divBtnTask.classList.add('dis-btn-task');
                    if (numberOfTasks.length > 0) numberOfTasks.length--;

                    showNumberTasks();
                })
                .catch(error => console.error('Error updating task status:', error));
        }
        if (e.target.classList.contains('sort-task-btn')) {
            
            console.log('xd');
        }
    });

}