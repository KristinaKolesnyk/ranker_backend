const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'krisya',
        port: 5432,
        password: '',
        database: 'rankerdb'
    }
})

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if(!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage});

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})
app.post('/signup', (req, res) => { signup.handleSignup(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'))
})

app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const filePath = req.file.path;
        res.json({imageUrl: `http://localhost:3000/${filePath}`});
    } catch (err) {
        console.error(err);
        res.status(500).json('Error uploading file');
    }
})

app.use('/uploads', express.static(UPLOAD_DIR));


app.listen(3000, () => {
    console.log('Server started on port 3000');
})