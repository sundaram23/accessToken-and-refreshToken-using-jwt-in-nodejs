const config = require('config.json');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'sundaram', password: '123456', firstName: 'sundaram', lastName: 'krish' }];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
    const existingData = fs.readFileSync('users.json', 'utf-8')
    console.log('authenticate', existingData,username,password)
    const user = JSON.parse(existingData).find(u => u.username === username && u.password === password);

    if (!user) throw 'Username or password is incorrect';

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}