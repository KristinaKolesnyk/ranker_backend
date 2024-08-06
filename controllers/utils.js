const calculateAverageRating = (ratings) => {
    const numericRatings = ratings.map(r => parseFloat(r)).filter(r => !isNaN(r));
    const sum = numericRatings.reduce((acc, val) => acc + val, 0);
    const average = numericRatings.length > 0 ? sum / numericRatings.length : 0;
    return parseFloat(average.toFixed(1));
}

module.exports ={
    calculateAverageRating
}