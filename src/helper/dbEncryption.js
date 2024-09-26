const crypto = require('crypto');

// Generate a 32-byte key (256 bits)
const secretKey = Buffer.from(
    '2b7e151628aed2a6abf7158809cf4f3c2b7e151628aed2a6abf7158809cf4f3c',
    'hex'
);

module.exports.encrypt = (text) => {
    if (!text || typeof text !== 'string') {
        return text;
    }
    if (text.startsWith('{"iv":')) {
        return text;
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
    });
};

module.exports.decrypt = (hash) => {
    return new Promise((resolve, reject) => {
        try {
            if (
                !hash ||
                typeof hash !== 'string' ||
                !hash.startsWith('{"iv":')
            ) {
                return resolve(hash);
            }

            const hashObj = JSON.parse(hash);
            const decipher = crypto.createDecipheriv(
                'aes-256-ctr',
                secretKey,
                Buffer.from(hashObj.iv, 'hex')
            );
            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(hashObj.content, 'hex')),
                decipher.final(),
            ]);

            return resolve(decrypted.toString());
        } catch (error) {
            return reject(error);
        }
    });
};
