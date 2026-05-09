const { ObjectId } = require('mongodb');

// for all
const generateName = (originalName) => {
  let rename = originalName;
  if (/\s/g.test(originalName)) rename = rename.replace(" ", "-");
  const num = Math.floor(Math.random() * 100);
  return num + '-' + rename;
};

const filterQuery = (() => {
    let query;

    const byAlphabet = (input) => {
        query = input;
        const lettersArr = (Array.isArray(query)) 
            ? new RegExp('^[' + query.join("") + ']') 
            : new RegExp('^' + query);
            
        return lettersArr;
    };

    const byPrice = (input) => {
        query = input;
        let num1 = parseInt(query.substring(0, query.indexOf('-'))) - 1;
        let num2 = parseInt(query.substring(query.indexOf('-') + 1, query.length)) + 1;
        let priceVar = query === 'NaN' ? NaN : { $gt :  num1, $lt : num2 };

        return priceVar;
    };

    const byRating = (input) => {
        query = input;
        let ratingsArr;
        if (Array.isArray(query)) {
            let temp = [];
            query.forEach(num => temp.push(parseInt(num)));
            ratingsArr = { $in: temp };
        } else ratingsArr = parseInt(query);

        return ratingsArr;
    };

    const byGenreOrDev = (input) => {
        query = input;
        const arr = (Array.isArray(query)) 
            ? { $in: query } 
            : query;

        return arr;
    };

    return {
        byAlphabet,
        byPrice,
        byRating,
        byGenreOrDev
    };
})();

// for /genres route
const updateGamesGenreArr = async (arr, db, genreToRemove, newName = null) => {
    let tempArr = arr;
    // console.log('tempArr: ', tempArr);
    // console.log('genreToRemove: ', genreToRemove);
    tempArr.map(async game => {
        let tempGenreArr = game.genres;
        const index = tempGenreArr.indexOf(genreToRemove);
        if (index > -1) {
            if (!newName) tempGenreArr.splice(index, 1);
            if (newName) tempGenreArr.splice(index, 1, newName);
        };

        const updateDoc = {
            $set: {
                genres: tempGenreArr.length > 1 ? [...tempGenreArr] : tempGenreArr
            }
        };

        await db.updateOne({ _id: new ObjectId(game._id) }, updateDoc);
    });
};

// for /developers route
const updateGamesDevArray = async (arr, db, devToRemove, newName = null) => {
    let tempArr = arr;
    // console.log('tempArr: ', tempArr);
    tempArr.map(async game => {
        let tempDevArr = game.developers;
        const index = tempDevArr.indexOf(devToRemove);
        if (index > -1) {
            if (!newName) tempDevArr.splice(index, 1);
            if (newName) tempDevArr.splice(index, 1, newName);
        };

        const updateDoc = {
            $set: {
                developers: tempDevArr.length > 1 ? [...tempDevArr] : tempDevArr
            }
        };

        await db.updateOne({ _id: new ObjectId(game._id) }, updateDoc);
    });
};

// for pagination
const paginationProcessing = async (limit = 12, db, filter) => {
    let total = (filter) ? await db.countDocuments(filter) : await db.countDocuments();
    return (total > limit) ? Math.ceil(total / limit) : 1;
};

module.exports = {
    generateName,
    filterQuery,
    paginationProcessing,
    updateGamesGenreArr,
    updateGamesDevArray
};