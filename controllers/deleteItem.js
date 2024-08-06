const handleDeleteItem = (req, res, db) => {
    const { itemId } = req.params;

    db.transaction(trx => {
        trx('rating')
            .where('item_id', itemId)
            .del()
            .then(() => trx('item')
                .where('id', itemId)
                .del()
            ).then(trx.commit)
            .catch(trx.rollback)
    }).then(() => res.status(200).json('Item deleted successfully'))
    .catch(err => {
        console.error('Error deleting item:', err);
        res.status(400).json('Error deleting item.')
    })
}

module.exports = {
    handleDeleteItem
}