const request = require('request');

module.exports = {
    getUsers: async function() {
        const requestUrl = `http://localhost:3000/retrive`;
        return new Promise((resolve, reject) => {
            request.get(requestUrl, (err, res, body) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(body));
            });
        });
    }
};