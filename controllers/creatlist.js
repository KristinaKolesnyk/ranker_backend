const { readFileSync } = require('fs');
const { join } = require('path');

const handleCreatList = (req, res, db) => {
    const { categoryName, criteriaName, userId, iconUrl} = req.body;

    db.transaction(trx => {
        // Проверка, существует ли коллекция для данного пользователя
        trx('collection')
            .where({ user_id: userId })
            .first()
            .then(existingCollection => {
                if (existingCollection) {
                    // Коллекция существует, используем её collection_id
                    const collection_id = existingCollection.id;

                    return trx('category')
                        .returning('id')
                        .insert({
                            name: categoryName,
                            collection_id: collection_id,
                            icon: iconUrl
                        })
                        .then(categoryId => {
                            const category_id = categoryId[0].id;

                            const criteriaInsertPromises = criteriaName.map(criterion =>
                                trx('criterion')
                                    .returning('*')
                                    .insert({
                                        name: criterion,
                                        category_id
                                    })
                            );

                            return Promise.all(criteriaInsertPromises)
                                .then(criteria => {
                                    res.json({
                                        collection: existingCollection,
                                        category: { id: category_id, name: categoryName },
                                        criteria: criteria.map(criterion => criterion[0])
                                    });
                                });
                        });
                } else {
                    // Коллекция не существует, создаем новую коллекцию
                    return trx('collection')
                        .returning('id')
                        .insert({
                            user_id: userId
                        })
                        .then(collectionId => {
                            const collection_id = collectionId[0].id;

                            return trx('category')
                                .returning('id')
                                .insert({
                                    name: categoryName,
                                    collection_id: collection_id,
                                    icon: iconUrl
                                })
                                .then(categoryId => {
                                    const category_id = categoryId[0].id;

                                    const criteriaInsertPromises = criteriaName.map(criterion =>
                                        trx('criterion')
                                            .returning('*')
                                            .insert({
                                                name: criterion,
                                                category_id
                                            })
                                    );

                                    return Promise.all(criteriaInsertPromises)
                                        .then(criteria => {
                                            res.json({
                                                collection: { id: collection_id },
                                                category: { id: category_id, name: categoryName},
                                                criteria: criteria.map(criterion => criterion[0])
                                            });
                                        });
                                });
                        });
                }
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(err => res.status(400).json('Unable to create list'));
};



module.exports = {
    handleCreatList: handleCreatList
};