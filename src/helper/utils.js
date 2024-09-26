const bcrypt = require('bcrypt');

exports.getHasedPassword = (password, saltRounds) => {
    return bcrypt.hashSync(password, saltRounds);
};

exports.comparedHased = async (password, hasedPass) => {
    return await bcrypt.compare(password, hasedPass);
};
