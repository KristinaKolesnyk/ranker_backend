const handleCreatList = (req, res, db) => {
    const {categoryName, criteriaName, userId} = req.body;

    db.transaction(trx => {
        trx.insert({
            name: categoryName
        })
            .into('category')
            .returning('id')
            .then(categoryId => {
                const category_id = categoryId[0].id

                return trx('collection')
                    .returning('*')
                    .insert({
                        category_id,
                        user_id: userId
                    })
                    .then(collection => {
                        const criteriaInsertPromises = criteriaName.map(criterion =>
                            trx('criterion')
                                .returning('*')
                                .insert({
                                    name: criterion,
                                    category_id
                                })
                        )
                        return Promise.all(criteriaInsertPromises)
                            .then(criteria => {
                                res.json({
                                    collection: collection[0],
                                    criterion: criteria.map(criterion => criterion[0])
                                })
                            })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleCreatList: handleCreatList
};