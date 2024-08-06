const handleGetCategoryData = (req, res, db) => {
    const {categoryId} = req.params;

    db.transaction(trx => {
        trx('category')
            .where('category.id', categoryId)
            .first()
            .then(category => {
                if (!category) {
                    throw new Error(`Category ${categoryId} not found`);
                }
                return Promise.all([
                    category,
                    trx('criterion').where('category_id', categoryId),
                    trx('item')
                        .leftJoin('rating', 'item.id', 'rating.item_id')
                        .where('item.category_id', categoryId)
                        .orderBy('item.avg_rating', 'desc')
                        .select(
                            'item.id as itemId',
                            'item.name as itemName',
                            'item.url',
                            'item.avg_rating',
                            'rating.value as ratingValue',
                            'rating.criterion_id'
                        )
                ]);
            })
            .then(([category, criteria, itemRatings]) => {
                const items = {};
                itemRatings.forEach(row => {
                    if (!items[row.itemId]) {
                        items[row.itemId] = {
                            id: row.itemId,
                            name: row.itemName,
                            url: row.url,
                            avg_rating: row.avg_rating,
                            criterions: criteria.map(c => ({
                                criterion_id: c.id,
                                value: '-'
                            }))
                        };
                    }
                    if (row.criterion_id) {
                        const criterion = items[row.itemId].criterions.find(c => c.criterion_id.toString() === row.criterion_id.toString());
                        if (criterion) {
                            criterion.value = row.ratingValue || '-';
                        }
                    }
                });

                res.json({
                    category,
                    criteria,
                    items: Object.values(items)
                });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(err => {
        console.error('Error fetching category data: ', err);
        res.status(400).json('Error fetching category data.');
    });
};

module.exports = {
    handleGetCategoryData: handleGetCategoryData
};
