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

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        port: 5432,
        password: '13346939',
        database: 'rankerdb'
    }
})

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/addtolist', (req, res) => {
    const {itemName, collectionId, itemUrl, itemAvgRating, ratingValue, criterionIds} = req.body;

    if (!Array.isArray(criterionIds) || criterionIds.length !== ratingValue.length) {
        return res.status(400).json('Mismatched criteria and ratings');
    }

    db.transaction(trx => {
        trx.insert({
            name: itemName,
            collection_id: collectionId,
            url: itemUrl,
            avg_rating: itemAvgRating
        })
            .into('item')
            .returning('id')
            .then(itemIds => {
                const item_id = itemIds[0].id;

                const ratingInsertPromises = ratingValue.map((rating, index) => (
                    trx('rating')
                        .returning('*')
                        .insert({
                            item_id,
                            value: rating,
                            criterion_id: criterionIds[index]
                        })
                ))
                return Promise.all(ratingInsertPromises)
                    .then(ratingResults => {
                        res.json({
                            newItem: {
                                id: item_id,
                                name: itemName,
                                collection_id: collectionId,
                                url: itemUrl,
                                avg_rating: itemAvgRating,
                                ratings: ratingResults.map(result => result[0])
                            }
                        })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'))
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
})