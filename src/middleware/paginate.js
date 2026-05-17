const paginate = () => {
    return (req, res, next) => {
        const page = parseInt(req.query.page) || 1
        const limit = 12;

        req.pagination = {
            limit,
            skip: (page - 1) * limit
        };

        next();
    }
};

module.exports = paginate;