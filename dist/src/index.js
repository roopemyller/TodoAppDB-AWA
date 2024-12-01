"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("./models/User");
const router = (0, express_1.Router)();
router.post('/add', async (req, res) => {
    const { name, todo } = req.body;
    try {
        let user = await User_1.User.findOne({ name });
        if (user) {
            user.todos.push({
                todo,
                checked: false
            });
        }
        else {
            user = new User_1.User({ name, todos: [{ todo }] });
        }
        await user.save();
        res.send(`Todo added successfully for user ${name}`);
    }
    catch (err) {
        console.error(err);
        res.send("Server error");
    }
});
router.get('/todos', async (req, res) => {
    try {
        const users = await User_1.User.find();
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.send("Server error");
    }
});
router.get('/todos/:id', async (req, res) => {
    let userId = req.params.id;
    try {
        const user = await User_1.User.findOne({ name: userId });
        if (user) {
            const todos = user.todos.map(todo => ({
                todo: todo.todo,
                checked: todo.checked
            }));
            res.status(200).json(todos);
        }
        else {
            console.log("Error fetching user");
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.send("Server error");
    }
});
router.delete('/delete', async (req, res) => {
    const { name } = req.body;
    if (name) {
        try {
            const user = await User_1.User.findOneAndDelete({ name });
            if (user) {
                res.status(200).send("User deleted successfully");
            }
            else {
                console.log("Error fetching user");
                return;
            }
        }
        catch (err) {
            console.error(err);
            res.send("Server error");
        }
    }
    else {
        console.log("No name");
    }
});
router.put("/update", async (req, res) => {
    const { name, todo } = req.body;
    if (name && todo) {
        try {
            const user = await User_1.User.findOne({ name });
            if (user) {
                const todoIndex = user.todos.findIndex((t) => t.todo === todo);
                if (todoIndex !== -1) {
                    user.todos.splice(todoIndex, 1);
                    await user.save();
                    res.status(200).send("Todo deleted successfully");
                }
            }
            else {
                console.log("Error fetching user");
                return;
            }
        }
        catch (err) {
            console.error(err);
            res.send("Server error");
        }
    }
    else {
        console.log("No name or todo");
    }
});
router.put("/updateTodo", async (req, res) => {
    const { name, todo, checked } = req.body;
    console.log(req.body);
    try {
        const user = await User_1.User.findOne({ name });
        if (user) {
            const todoItem = user.todos.find(t => t.todo === todo);
            if (todoItem) {
                todoItem.checked = checked;
                await user.save();
                res.status(200).send("Todo updated successfully");
            }
            else {
                console.log("todoitem not found");
            }
        }
        else {
            console.log("user not found error");
        }
    }
    catch (err) {
        console.error(err);
        res.send("Server error");
    }
});
exports.default = router;
