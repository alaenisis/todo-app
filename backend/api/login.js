const jwt = require('jsonwebtoken');
const config = require('../config');
const express = require('express');
const router=express.Router();
const MY_SECRET = config.MY_SECRET;
const User = require('../model/user');
const bcrypt = require('bcryptjs');


const generateToken = (user) => {
    const tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email
    };
    return jwt.sign( tokenPayload, MY_SECRET, { expiresIn: '1h' });
}; 

router.get('/users', async(req, res) => {
    try {
        const usersdb = await User.find();
        res.json(usersdb);
    }catch (error) {
        res.send("error" + error)
    }
});

router.get('/users/:id', async(req, res) => {
    try{
        const userdb = await User.findById(req.params.id);
        res.json(userdb);
    }catch(err){
        res.send("error" + err)
    }
});

router.post('/register', async(req, res) => {

    try{
        const {name, email } = req.body;

        const existsUser = await User.findOne({ email });
        if (existsUser) {
            return res.status(400).send('User already exists');
        }  

        const encoder = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, encoder);

        const user = new User({
            name,
            email,
            password
        });

        const savedUser = await user.save();
        const token = generateToken(user);
        res.json({
            success: true,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email,
                token: token
            }
        });

    }catch(err){
        res.send("error" + err)
    }
});

router.post('/login', async(req, res) => {
   
    try{

        const {email, password} = req.body;

        const user = await User.findOne({ email });
 
        if (!user) {
            return res.status(401).send('invalid email');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('invalid password');
        }

        const token = generateToken(user);
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token
            }
        }); 
        

   }catch(err){
       res.send("error" + err)
   } 
});

module.exports=router;

