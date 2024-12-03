const express = require('express');
const cors = require('cors');
const app = express();

// Configure CORS to allow all origins (for development)
app.use(cors({
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build an API', completed: true }, 
];

// Define routes
app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTodo = { 
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1, 
        task: req.body.task, 
        completed: false 
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');

    todo.completed = true;
    res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    if (todos.length === initialLength) {
        return res.status(404).send('Todo not found');
    }
    res.send('Todo deleted');
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});