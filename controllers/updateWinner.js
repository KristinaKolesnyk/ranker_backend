const handleUpdateWinner = (req,res,db) => {
    const {categoryId, winnerId} = req.body;

    db('category')
        .where('id', '=', categoryId)
        .update({
            winner_id: winnerId
        })
        .then(response =>{
            if(response) {
                res.json('Winner updated successfully');
            } else {
                res.status(400).json('Unable to update winner');
            }
        }).catch(err => res.status(400).json('Unable to update winner'))
}

module.exports = {
    handleUpdateWinner: handleUpdateWinner
};