const express = require('express');

const router = express.Router();

let todos = require('../modules/task');

router.get('/todos', (req, res) => {
    res.json(todos);
});

router.post('/todos', (req, res) => {
    const newTodo = { 
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1, 
        task: req.body.task, 
        completed: false 
    };

    const exists = todos.some(todo => todo.task === newTodo.task);

    if (exists) {
        res.status(400).send('Task already exists');
    } else {
        todos.push(newTodo);
        res.status(201).json(newTodo);
    }
});

router.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');

    todo.completed = true;
    res.json(todo);
});

router.delete('/todos/:id', (req, res) => {
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    if (todos.length === initialLength) {
        return res.status(404).send('Todo not found');
    }
    res.send('Todo deleted');
});

module.exports = router;