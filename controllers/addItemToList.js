const {calculateAverageRating} = require('../controllers/utils');

const handleAddItemToList = (req, res, db) => {
    const {categoryId, name, url, ratings} = req.body;
    if (!categoryId || !name || !ratings || ratings.length === 0) {
        return res.status(400).json('Category ID, name, and ratings are required.');
    }
    const avgRating = calculateAverageRating(ratings);

    db.transaction(trx => {
        trx('item')
            .returning('id')
            .insert({
                name: name,
                url: url || null,
                avg_rating: avgRating,
                category_id: categoryId
            })
            .then(itemId => {
                const item_id = itemId[0].id;
                return trx('criterion')
                    .where({category_id: categoryId})
                    .select('id')
                    .then(criteria => {
                        const ratingPromises = ratings.map((rating, index) => {
                            if (criteria[index]) {
                                return trx('rating')
                                    .insert({
                                        value: rating,
                                        item_id,
                                        criterion_id: criteria[index].id
                                    })
                            }
                        })
                        return Promise.all(ratingPromises)
                    });
            }).then(trx.commit)
            .catch(trx.rollback);
    }).then(() => res.status(200).json('Item added successfully'))
        .catch(err => {
            console.error('Error adding item to list:', err);
            res.status(400).json('Error adding item to list.')
        })
}

module.exports = {
    handleAddItemToList:handleAddItemToList
};