const crypto = require('crypto').randomBytes(256).toString('hex');
// Export config object
module.exports = {
    uri: 'mongodb://localhost:27017/Shop-site', // Databse URI and database name
    secret: crypto, // Cryto-created secret
    db: 'Shop-site' // Database name
}
