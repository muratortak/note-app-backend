const client = require('mongodb').MongoClient;

module.exports = (() => {
    let db;
    client.connect(url, connectionOptions, (err, database) => {
      if (err) throw new Error(err);
      console.log('DB is connected.');
      db = database.db(dbName);
    });
});