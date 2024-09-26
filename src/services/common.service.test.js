const _ = require('lodash');
const { getFilter } = require('./common.service'); // Replace with your actual module path

describe('getFilter function', () => {
    it('should return a valid filter object with default sorting when no options are provided', async () => {
        // Arrange
        const options = {};

        // Act
        const filter = await getFilter(options);

        // Assert
        expect(filter).toBeDefined();
        expect(filter.sort).toEqual({
            createdAt: 'DESC',
            updatedAt: 'DESC',
        });
    });

    it('should correctly apply pagination options when provided', async () => {
        // Arrange
        const options = {
            page: 2,
            limit: 10,
        };

        // Act
        const filter = await getFilter(options);

        // Assert
        expect(filter.skip).toEqual(10); // (2 - 1) * 10
        expect(filter.limit).toEqual(10);
    });

    it('should filter by isActive if provided in options', async () => {
        // Arrange
        const options = {
            isActive: true,
        };

        // Act
        const filter = await getFilter(options);

        // Assert
        expect(filter.where.isActive).toEqual(true);
    });

    it('should prioritize id filter over other filters', async () => {
        // Arrange
        const options = {
            id: 'some-id',
            filter: {
                isActive: true,
            },
        };

        // Act
        const filter = await getFilter(options);

        // Assert
        expect(filter.where.id).toEqual('some-id');
    });

    it('should handle projection options', async () => {
        // Arrange
        const options = {
            project: ['name', 'email'],
        };

        // Act
        const filter = await getFilter(options);

        // Assert
        expect(filter.select).toEqual(['name', 'email']);
    });
});
