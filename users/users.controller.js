const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const userService = require('./user.service');
const fs = require('fs')
// routes
router.post('/login', authenticate);
router.post('/saveUserData', saveUserData);
router.get('/', getAll);

module.exports = router;

function saveUserData(req, res, next) {

    try{
        console.log("req.body*****",req.body);
        const userData = req.body;
        const existingData = fs.readFileSync('users.json', 'utf-8');
        console.log(existingData)
        const dataArray = existingData ? JSON.parse(existingData) : [];
        
        console.log("process.env.REFRESH_TOKEN_SECRET",process.env.REFRESH_TOKEN_SECRET);
        console.log("userData",userData);
        if(userData.firstname && userData.password){
            const refreshToken = jwt.sign({ firstname: userData.firstname, password: userData.password }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
            userData['refreshToken'] = refreshToken;
        }
        console.log("userData******",userData);
    
    
        dataArray.push(userData);
    
    
        fs.writeFileSync('users.json', JSON.stringify(dataArray, null, 2));
    
    
        res.status(200).json({ message: 'user data saved successfully'})
    }
    catch (error){
        console.log('catch error',error);
        res.status(400).json({ message: 'user data saving failed', error});
    }
}




function authenticate(req, res, next){
    userService.authenticate(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
