const _ = require('lodash');

module.exports = {
    getFilter: async (options) => {
        let filter = { where: { or: [] } };
        // manage pagination logic
        if (options.page && options.limit) {
            filter.skip = (options.page - 1) * options.limit;
            filter.limit = options.limit;
        }

        // sort by request
        if (options.sort) {
            filter.sort = options.sort;
        } else {
            filter.sort = {
                createdAt: 'DESC',
                updatedAt: 'DESC',
            };
        }

        if (_.has(options, 'isActive')) {
            filter.where.isActive = options.isActive;
        }

        if (options.search && options.search.keys && options.search.keyword) {
            _.forEach(options.search.keys, (key) => {
                if (key) {
                    let orArray = {};
                    orArray[key] = {
                        $regex: options.search.keyword,
                        $options: 'i',
                    };
                    filter.where.or.push(orArray);
                }
            });
        }
        // NOTE:- keep this filter at end
        if (_.has(options, 'id')) {
            filter = { where: { id: options.id } };
        }
        // projection by request
        if (options.project) {
            filter.select = options.project;
        }
        if (options.filter) {
            filter.where = _.extend(filter.where, options.filter);
        }

        if (filter.where.or && !filter.where.or.length) {
            delete filter.where.or;
        } else {
            filter.where['$or'] = filter.where.or;
            delete filter.where.or;
        }

        return filter;
    },

    paginationCount: (count, limit) => {
        let totalPages = parseInt(count) / parseInt(limit);
        totalPages = totalPages ? parseInt(totalPages) + 1 : 0;

        return { page: totalPages, limit: parseInt(limit) || 0 };
    },

    randomNumber: (length = 4) => {
        let numbers = '12345678901234567890';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += numbers[Math.round(Math.random() * (numbers.length - 1))];
        }

        return result;
    },

    pagination: async (count, limit) => {
        let totalPages = parseInt(count) / parseInt(limit);
        totalPages = totalPages ? parseInt(totalPages) + 1 : 0;
        return totalPages;
    },
};
