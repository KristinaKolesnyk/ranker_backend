const { readFileSync } = require('fs');
const { join } = require('path');

const handleCreateList = (req, res, db) => {
    const { categoryName, criteriaName, userId, iconUrl } = req.body;
    if (!categoryName || !criteriaName || !iconUrl) {
        return res.status(400).json('Category name, criteria names, and icon URL are required');
    }

    db.transaction(trx => {

        trx('collection')
            .where({ user_id: userId })
            .first()
            .then(existingCollection => {
                if (existingCollection) {
                    const collection_id = existingCollection.id;

                    return trx('category')
                        .returning('id')
                        .insert({
                            name: categoryName,
                            collection_id: collection_id,
                            icon: iconUrl
                        })
                        .then(categoryId => {
                            if (!categoryId || categoryId.length === 0) {
                                throw new Error('Category insertion failed');
                            }
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

                    return trx('collection')
                        .returning('id')
                        .insert({
                            user_id: userId
                        })
                        .then(collectionId => {
                            if (!collectionId || collectionId.length === 0) {
                                throw new Error('Collection insertion failed');
                            }
                            const collection_id = collectionId[0].id;

                            return trx('category')
                                .returning('id')
                                .insert({
                                    name: categoryName,
                                    collection_id: collection_id,
                                    icon: iconUrl
                                })
                                .then(categoryId => {
                                    if (!categoryId || categoryId.length === 0) {
                                        throw new Error('Category insertion failed');
                                    }
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
                                                category: { id: category_id, name: categoryName },
                                                criteria: criteria.map(criterion => criterion[0])
                                            });
                                        });
                                });
                        });
                }
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(err => res.status(400).json(`Unable to create list: ${err.message}`));
};

module.exports = {
    handleCreateList: handleCreateList
};
