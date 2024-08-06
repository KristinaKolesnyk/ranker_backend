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
const creatlist = require('./controllers/creatlist');
const upload = require('./controllers/upload');
const addToList = require('./controllers/addToList')
const getCategories = require('./controllers/getCategories')
const getCategoryData = require('./controllers/getCategoryData')

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

app.use('/data/img', express.static(path.join(__dirname, '/data/img')))
app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt)
})
app.post('/signup', (req, res) => {
    signup.handleSignup(req, res, db, bcrypt)
})
app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db)
})
app.post('/creatlist', (req, res) => {
    creatlist.handleCreatList(req, res, db)
})
app.post('/upload', upload.upload.single('file'), upload.handleFileUpload)
//app.use('/data/img', express.static(path.join(__dirname, '/data/img')));
app.post('/addtolist', (req, res) => {
    addToList.handleAddToList(req, res, db)
})
app.get('/categories/:userId', (req, res) => {
    getCategories.handleGetCategories(req, res, db)
})
app.get('/category/:categoryId', (req, res) => {
    getCategoryData.handleGetCategoryData(req, res, db)
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
})