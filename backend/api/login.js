const jwt = require('jsonwebtoken');
const config = require('../config');
const express = require('express');
const router=express.Router();
const MY_SECRET = config.MY_SECRET;
let users = require('../modules/users');


const generateToken = (user) => {
    return jwt.sign( user, MY_SECRET, { expiresIn: '1h' });
};

router.get('/users', (req, res) => {
    res.json(users);
});

router.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

router.post('/register', (req, res) => {


    const { name, email, password } = req.body;
    const user = { id: users.length + 1, name, email, password };
    users.push(user);
    res.json(user);
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {

        const { id, name, email } = user;

        res.json({
        success: true,
        user: {
            id,
            name,
            email,
            token: generateToken(user)
        },
       
    });

    ;

    } else {
        res.status(401).send('Invalid email or password');
    }   
});

module.exports=router;

