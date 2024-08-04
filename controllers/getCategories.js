const handleGetCategories = (req, res, db) => {
    const {userId} = req.params;
    db.select('category.id', 'category.name', 'category.icon')
        .from('category')
        .join('collection', 'category.collection_id', 'collection.id')
        .where('collection.user_id', userId)
        .then(categories => {
            if (categories.length) {
                res.json(categories);
            } else {
                res.status(400).json('No categories found');
            }
        }).catch(err => {
        console.log('Error getting categories: ', err);
        res.status(400).json('Error getting categories');
    })
}

module.exports = {
    handleGetCategories: handleGetCategories
};