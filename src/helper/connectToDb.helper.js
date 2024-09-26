const mongoose = require('mongoose');

module.exports = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    // connect to database.
    try {
        await mongoose.connect(process.env.MONGODB_URL, options);
        console.log(
            `************************ DB connect successfully! ************************`
        );
    } catch (error) {
        console.log(
            `************************ DB connection failed ************************`,
            error
        );
    }
};
