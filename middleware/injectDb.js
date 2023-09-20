const {MongoClient} = require("mongodb");
let db;

async function injectDb(req, res, next) {
    const DB_HOST = process.env.DB_HOST || "localhost";
    if (!db) {
        const client = new MongoClient(
            `mongodb://${DB_HOST}:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`
        );
        await client.connect();
        db = client.db("MessageCrawler");
    }
    req.db = db;
    return next();
}

module.exports = injectDb;