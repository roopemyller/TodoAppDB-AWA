"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const loadTodos = () => {
    try {
        const data = fs_1.default.readFileSync("data.json", 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(`Error reading or parsing the todo file: `, err);
        return [];
    }
};
const saveTodos = (todos) => {
    try {
        fs_1.default.writeFileSync("data.json", JSON.stringify(todos, null, 2), 'utf-8');
    }
    catch (err) {
        console.error(`Error writing the todo file: `, err);
    }
};
router.post('/add', (req, res) => {
    console.log(req.body);
    const { name, todo } = req.body;
    let todos = loadTodos();
    const user = todos.find((user) => user.name === name);
    if (user) {
        user.todos.push(todo);
    }
    else {
        todos.push({ name, todos: [todo] });
    }
    saveTodos(todos);
    res.send(`Todo added successfully for user ${name}`);
});
router.get('/todos', (req, res) => {
    let todos = loadTodos();
    res.status(200).json({ todos });
});
router.get('/todos/:id', (req, res) => {
    let userId = req.params.id;
    let todos = loadTodos();
    const user = todos.find((user) => user.name.toLowerCase() === userId.toLowerCase());
    if (user) {
        res.status(200).json(user.todos);
    }
    else {
        res.status(404).send("User not found");
    }
});
router.delete('/delete', (req, res) => {
    const { name } = req.body;
    let todos = loadTodos();
    const userIndex = todos.findIndex((user) => user.name.toLowerCase() === name.toLowerCase());
    if (userIndex !== -1) {
        todos.splice(userIndex, 1);
        saveTodos(todos);
        res.status(200).send("User deleted successfully");
    }
    else {
        res.status(404).send("User not found");
    }
});
router.put("/update", (req, res) => {
    const { name, todo } = req.body;
    let todos = loadTodos();
    const user = todos.find((user) => user.name.toLowerCase() === name.toLowerCase());
    if (user) {
        const todoIndex = user.todos.indexOf(todo);
        if (todoIndex !== -1) {
            user.todos.splice(todoIndex, 1);
        }
        saveTodos(todos);
        res.status(200).send("Todo deleted successfully");
    }
});
exports.default = router;
