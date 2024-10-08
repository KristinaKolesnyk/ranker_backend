const {readFileSync} = require('fs');
const {join} = require('path');

const handleSignup = (req, res, db, bcrypt) => {
    const {email, password, name} = req.body;

    if (!email || !password || !name) {
        return res.status(400).json('Please provide all required fields.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json('Invalid email format.');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({hash, email})
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name,
                        joined: new Date()
                    })
                    .then(user => {
                        const userId = user[0].id;


                        return addDefaultDataForUser(trx, userId)
                            .then(() => {
                                trx.commit();
                                res.json(user[0]);
                            })
                            .catch(err => {
                                trx.rollback();
                                console.error('Error adding default data:', err);
                                res.status(500).json('Error adding default data.');
                            });
                    })
                    .catch(err => {
                        trx.rollback();
                        console.error('Error inserting user:', err);
                        res.status(500).json('Error inserting user.');
                    });
            })
            .catch(err => {
                trx.rollback();
                console.error('Error inserting login:', err);
                res.status(500).json('Error inserting login.');
            });
    })
        .catch(err => {
            console.error('Transaction error:', err);
            res.status(500).json('Transaction error.');
        });
};

const addDefaultDataForUser = (trx, userId) => {
    const filePath = join(__dirname, '..', 'data', 'defaultData.json');
    const defaultData = JSON.parse(readFileSync(filePath, 'utf8'));

    return trx('collection')
        .returning('id')
        .insert({user_id: userId})
        .then(collectionId => {
            const collection_id = collectionId[0].id;

            const categoryPromises = Object.keys(defaultData.itemsByCategory).map(categoryName => {
                const icon = defaultData.iconsByCategory[categoryName] || '/data/img/default_icon.png';
                return trx('category')
                    .returning('id')
                    .insert({
                        name: categoryName,
                        icon: icon,
                        collection_id
                    })
                    .then(categoryId => {
                        const category_id = categoryId[0].id;
                        const criteria = defaultData.criteriaByCategory[categoryName];
                        const criteriaInsertPromises = criteria.map(criterion =>
                            trx('criterion')
                                .returning('id')
                                .insert({
                                    name: criterion,
                                    category_id
                                })
                                .then(criterionId => {
                                    return {
                                        criterion_id: criterionId[0].id,
                                        category_id
                                    };
                                })
                        );


                        const items = defaultData.itemsByCategory[categoryName];
                        const itemInsertPromises = items.map(item =>
                            trx('item')
                                .returning('id')
                                .insert({
                                    name: item.name,
                                    url: item.URL,
                                    category_id,
                                    avg_rating: item.avgRating
                                })
                                .then(itemId => {
                                    const item_id = itemId[0].id;


                                    return Promise.all(
                                        criteriaInsertPromises.map((criterionPromise, index) =>
                                            criterionPromise.then(criterionData =>
                                                trx('rating')
                                                    .insert({
                                                        value: item.criterions[index],
                                                        item_id,
                                                        criterion_id: criterionData.criterion_id
                                                    })
                                            )
                                        )
                                    );
                                })
                        );

                        return Promise.all(itemInsertPromises);
                    });
            });

            return Promise.all(categoryPromises);
        });
};
module.exports = {
    handleSignup: handleSignup
};