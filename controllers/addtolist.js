const handleAddToList = (req, res, db) => {
    const {itemName, categoryId, itemUrl, ratingValue, avgRating, criterionIds} = req.body;

    if (!Array.isArray(criterionIds) || criterionIds.length !== ratingValue.length) {
        return res.status(400).json('Mismatched criteria and ratings');
    }

    db.transaction(trx => {
        trx.insert({
            name: itemName,
            category_id: categoryId,
            url: itemUrl,
            avg_rating: avgRating
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
                                category_id: categoryId,
                                url: itemUrl,
                                ratings: ratingResults.map(result => result[0]),
                                avg_rating: avgRating
                            }
                        })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleAddToList: handleAddToList
};