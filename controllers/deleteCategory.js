const handleDeleteCategory = (req, res, db) => {
    const {id} = req.params;

    db.transaction(trx => {
        trx('rating')
            .whereIn('item_id', function () {
                this.select('id').from('item').where('category_id', id)
            })
            .del()
            .then(() => trx('item').where('category_id', id).del())
            .then(() => trx('criterion').where('category_id', id).del())
            .then(() => trx('category').where('id', id).del())
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .then(() => res.status(200).json('Category deleted successfully'))
        .catch(err => {
            console.error('Error deleting category:', err);
            res.status(400).json('Error deleting category.')
        })
}

module.exports = {
    handleDeleteCategory
}