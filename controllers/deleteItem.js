// deleteItem.js
const handleDeleteItem = (req, res, db) => {
    const { itemId } = req.params;

    db.transaction(trx => {
        trx('item')
            .where('id', itemId)
            .first()
            .then(item => {
                if (!item) {
                    throw new Error(`Item ${itemId} not found`);
                }
                return Promise.all([
                    item,
                    trx('category')
                        .where('winner_id', itemId)
                        .first()
                ]);
            })
            .then(([item, category]) => {
                const queries = [
                    trx('rating').where('item_id', itemId).del(),
                    trx('item').where('id', itemId).del()
                ];
                if (category) {
                    queries.push(trx('category').where('id', category.id).update({ winner_id: null }));
                }
                return Promise.all(queries);
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
        .then(() => res.status(200).json('Item deleted successfully'))
        .catch(err => {
            console.error('Error deleting item:', err);
            res.status(400).json('Error deleting item');
        });
};

module.exports = {
    handleDeleteItem
};
