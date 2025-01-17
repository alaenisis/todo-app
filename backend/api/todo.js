const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
let task = require('../model/todo');
const config = require('../config');
const Todo = require('../model/todo');
const user = require('../model/user');
const MY_SECRET = config.MY_SECRET;
const mongoose = require('mongoose');


const validate= (token)=>{
    try{
        jwt.verify(token, MY_SECRET);
        return true;
    }catch(err){
        return false;
    }
};

router.get('/todos', async (req, res) => {
    if (validate(req.headers.token)) {
        const decodedUser = jwt.decode(req.headers.token);
        try {
            const tasks = await Todo.find({ user: decodedUser.id });
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving tasks', error: err.message });
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

router.post('/todos', async(req, res) => {
    if(validate(req.headers.token)){

        const decodedUser = jwt.decode(req.headers.token);
        const {task} = req.body;

        if (!task) {
            return res.status(400).json({ message: 'Task is required' });
        }

        const existingTask = await Todo.findOne({ 
            task, 
            user: decodedUser.id
        });

        if (existingTask) {
            return res.status(400).json({ message: 'Task already exists' });
        }

        const newTodo = new Todo({task, user: decodedUser.id});

        try{
            const savedTask = await newTodo.save();
            res.json(savedTask);
        }catch(err){
            res.status(500).send({ message: 'Error saving task', error: err });
        }

    }else{
        res.status(401).send('Unauthorized');
    }
});

router.put('/todos/:id', async(req, res) => {
    if(validate(req.headers.token)){
        const decodedUser = jwt.decode(req.headers.token);
        const ObjectId = new mongoose.Types.ObjectId(req.params.id);
        try {
            const todo = await Todo.findOneAndUpdate(
                { _id: ObjectId , user: decodedUser.id },
                { completed: true },
                { new: true }
            );
    
            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
    
            res.json(todo);
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }

    }else{
        res.status(401).send('Unauthorized');
    }
});

router.delete('/todos/:id', async(req, res) => {
    if(validate(req.headers.token)){

        const ObjectId = new mongoose.Types.ObjectId(req.params.id);
        const decodedUser = jwt.decode(req.headers.token);
        try {
            const todo = await Todo.findOneAndDelete({ 
                _id: ObjectId, 
                user: decodedUser.id 
            });
    
            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
    
            res.json({ message: 'Todo deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }else{
        res.status(401).send('Unauthorized');
    }

});

module.exports = router;
