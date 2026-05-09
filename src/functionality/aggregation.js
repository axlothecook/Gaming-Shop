const countByArrayField = async (db, baseFilter, arrayField) => {
    const result = await db.aggregate([
        { $match: baseFilter },
        { $unwind: `$${arrayField}` },
        { $group: { _id: `$${arrayField}`, count: { $sum: 1 } } }
    ]).toArray();
    return Object.fromEntries(result.map(r => [r._id, r.count]));
};

const countByScalarField = async (db, baseFilter, field) => {
    const result = await db.aggregate([
        { $match: baseFilter },
        { $group: { _id: `$${field}`, count: { $sum: 1 } } }
    ]).toArray();
    return Object.fromEntries(result.map(r => [String(r._id), r.count]));
};

const countByFirstLetter = async (db, baseFilter) => {
    const result = await db.aggregate([
        { $match: baseFilter },
        { $group: { _id: { $toUpper: { $substrCP: ['$name', 0, 1] } }, count: { $sum: 1 } } }
    ]).toArray();
    return Object.fromEntries(result.map(r => [r._id, r.count]));
};

const countByPriceBucket = async (db, baseFilter) => {
    const result = await db.aggregate([
        { $match: baseFilter },
        {
            $bucket: {
                groupBy: '$price',
                boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                default: 'NaN',
                output: { count: { $sum: 1 } }
            }
        }
    ]).toArray();

    const labels = ['0 - 9', '10 - 19', '20 - 29', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70 - 79', '80 - 89', '90 - 99'];
    const counts = {};
    result.forEach(r => {
        if (r._id === 'NaN') counts['NaN'] = r.count;
        else {
            const index = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90].indexOf(r._id);
            if (index >= 0) counts[labels[index]] = r.count;
        }
    });
    return counts;
};

module.exports = {
    countByArrayField,
    countByScalarField,
    countByFirstLetter,
    countByPriceBucket
};