import {Request, Response, Router} from "express"
import fs from 'fs'
import path from "path"

type TUser = {
    name: string;
    todos: string[];
}

const router: Router = Router()


const loadTodos = (): TUser[] => {
    try {
        const data = fs.readFileSync("data.json", 'utf-8')
        return JSON.parse(data) as TUser[]
    } catch (err){
        console.error(`Error reading or parsing the todo file: `, err)
        return []
    }
}

const saveTodos = (todos: TUser[]): void => {
    try {
        fs.writeFileSync("data.json", JSON.stringify(todos, null, 2), 'utf-8')
    } catch (err){
        console.error(`Error writing the todo file: `, err)
    }
}

router.post('/add', (req, res) => {
    console.log(req.body)
    const { name, todo } = req.body

    let todos = loadTodos()
    const user = todos.find((user) => user.name === name)

    if(user){
        user.todos.push(todo)
    }else{
        todos.push({name, todos: [todo] })
    }

    saveTodos(todos)

    res.send(`Todo added successfully for user ${name}`)

})

router.get('/todos', (req, res) => {
    let todos = loadTodos()
    res.status(200).json({ todos })
})

router.get('/todos/:id', (req, res) => {
    let userId: string = req.params.id
    let todos = loadTodos()

    const user = todos.find((user) => user.name.toLowerCase() === userId.toLowerCase())

    if(user){
        res.status(200).json(user.todos)
    }else{
        res.status(404).send("User not found")
    }
})

router.delete('/delete', (req, res) => {
    const {name} = req.body
    let todos = loadTodos()

    const userIndex = todos.findIndex((user) => user.name.toLowerCase() === name.toLowerCase())

    if (userIndex !== -1){
        todos.splice(userIndex, 1)
        saveTodos(todos)
        res.status(200).send("User deleted successfully")
    }else{
        res.status(404).send("User not found")
    }
})

router.put("/update", (req, res) => {
    const { name, todo } = req.body;

    let todos = loadTodos()
    const user = todos.find((user) => user.name.toLowerCase() === name.toLowerCase())

    if (user){
        const todoIndex = user.todos.indexOf(todo);
        if (todoIndex !== -1){
            user.todos.splice(todoIndex, 1);
        }
        saveTodos(todos);
        res.status(200).send("Todo deleted successfully")
    }
})


export default router