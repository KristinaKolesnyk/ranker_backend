const handleEditItem = (req, res, db) => {
    const {id, url, ratings, criteria} = req.body;

    const calculateAverageRating = (ratings) => {
        const numericRatings = ratings.map(r => parseFloat(r)).filter(r => !isNaN(r));
        const sum = numericRatings.reduce((acc, val) => acc + val, 0);
        const average = numericRatings.length > 0 ? sum / numericRatings.length : 0;
        return parseFloat(average.toFixed(1));
    }

    const avgRating = calculateAverageRating(ratings);
    db.transaction(trx => {
        trx('item')
            .where('id', id)
            .update({url: url || null, avg_rating: avgRating})
            .then(() => {
                const updatePromises = ratings.map((rating, index) => {
                    if (rating !== '') {
                        return trx('rating')
                            .where({item_id: id, criterion_id: criteria[index]})
                            .update({value: rating})
                    }
                })
                return Promise.all(updatePromises)
            }).then(trx.commit)
            .catch(trx.rollback)
    }).then(() => res.status(200).json('Item updated successfully'))
        .catch(err => {
            console.error('Error updating item:', err);
            res.status(400).json('Error updating item');
        });
}

module.exports = {
    handleEditItem
}