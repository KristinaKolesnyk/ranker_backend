const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const path = require('path');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const creatlist = require('./controllers/creatlist');
const upload = require('./controllers/upload');
const addItemToList = require('./controllers/addItemToList')
const getCategories = require('./controllers/getCategories')
const getCategoryData = require('./controllers/getCategoryData')
const deleteItem = require('./controllers/deleteItem')
const deleteCategory = require('./controllers/deleteCategory')
const editItem = require('./controllers/editItem')
const updateWinner = require('./controllers/updateWinner')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'krisya',
        port: 5432,
        password: '',
        database: 'postgres'
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
app.post('/addtolist', (req, res) => {
    addItemToList.handleAddItemToList(req, res, db)
})
app.get('/categories/:userId', (req, res) => {
    getCategories.handleGetCategories(req, res, db)
})
app.get('/category/:categoryId', (req, res) => {
    getCategoryData.handleGetCategoryData(req, res, db)
})
app.delete('/deleteitem/:itemId', (req, res) => {
    deleteItem.handleDeleteItem(req, res, db)
})

app.delete('/category/:id', (req, res) => {
    deleteCategory.handleDeleteCategory(req, res, db)
})
app.put('/edititem', (req, res) => {
    editItem.handleEditItem(req, res, db)
})
app.listen(3000, () => {
    console.log('Server started on port 3000');
})
app.post('/updatewinner', (req, res) => {
    updateWinner.handleUpdateWinner(req, res, db)
})