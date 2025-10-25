const mongoose = require('mongoose');

async function connectMongo(uri) {
  if (!uri) throw new Error('MONGO_URI is not set');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  return mongoose.connection;
}

module.exports = { connectMongo };



