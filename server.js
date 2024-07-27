const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'Kristina',
            password: 'passwordK',
            email: 'admin@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'James',
            password: 'passwordJ',
            email: 'user@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(401).json('Incorrect credentials');
    }


})

app.post('/signup', (req, res) => {
    const {email, password, name} = req.body;

    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let userFound = false;
    database.users.forEach(user => {
        if (user.id === id) {
            userFound = true;
            return res.json(user);
        }
    })
    if (!userFound) {
        res.status(404).json('User not found');
    }
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    let userFound = false;
    database.users.forEach(user => {
        if (user.id === id) {
            userFound = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!userFound) {
        res.status(404).json('User not found');
    }
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
})