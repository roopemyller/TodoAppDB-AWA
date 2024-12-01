document.addEventListener("DOMContentLoaded", function (){
    document.getElementById("todoForm").addEventListener("submit", async (e) => {
        e.preventDefault()
        const todoForm = document.getElementById("todoForm")
        const name = document.getElementById("userInput").value
        const todo = document.getElementById("todoInput").value
        const messageElement = document.getElementById('message')
        
        try{
            const response = await fetch('/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: name, todo: todo})
            })
    
            if (response.ok) {
                const message = await response.text()
                messageElement.textContent = message
                messageElement.style.color = 'green'
            } else {
                messageElement.textContent = 'Failed to add todo!'
                messageElement.style.color = 'red'
            }
            todoForm.reset()
        }catch (error){
            console.error('Error:', error)
            messageElement.textContent = 'An error occurred!'
            messageElement.style.color = 'red'
        }
    }),
    document.getElementById("searchForm").addEventListener('submit', function (e) {
        e.preventDefault()

        const userId = document.getElementById('searchInput').value
        const messageElement = document.getElementById('message')
        const todoList = document.getElementById("todoList")

        messageElement.textContent = ''
        todoList.innerHTML = ''

        if (userId){
            fetch(`/todos/${userId}`).then(response => {
                if (!response.ok) {
                    throw new Error("User not found")
                }
                return response.json()
            }).then(todos => {
                todos.forEach(todo => {
                    const li = document.createElement('li')
                    const a = document.createElement('a')
                    a.href = "#"
                    a.classList.add('delete-task')
                    a.textContent = todo
                    li.appendChild(a)
                    todoList.appendChild(li)
                    a.addEventListener('click', function() {
                        fetch('/update', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ name: userId, todo: todo })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error deleting todo')
                            }
                            return response.text()
                        })
                        .then(message => {
                            alert(message)                            
                            const todoList = document.getElementById('todoList')
                            todoList.removeChild(li)
                        })
                        .catch(error => {
                            alert(error.message)
                        })
                    })
                })
                const constDiv = document.getElementById("todoDiv")

                const deleteButton = document.createElement('button')
                deleteButton.textContent = "Delete User"
                deleteButton.id = "deleteUser"
                constDiv.appendChild(deleteButton)
                
                deleteButton.addEventListener('click', function () {
                    fetch('/delete', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: userId })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error deleting user");
                        }
                        return response.text()
                    })
                    .then(message => {
                        messageElement.textContent = message;
                        todoList.innerHTML = ''
                    })
                    .catch(error => {
                        messageElement.textContent = error.message
                    })
                    constDiv.removeChild(deleteButton)
                })
            })
            .catch(error => {
                messageElement.textContent = error.message;
            })
    } else {
        messageElement.textContent = "Please enter a username.";
    }
    })
    function displayTodos(user){
        const todoList = document.getElementById("todoList")
        todoList.innerHTML = ''
    }
})
