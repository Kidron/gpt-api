const { MongoClient } = require('mongodb');
const uri = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

class User {
  static async init() {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    const db = client.db('auth');
    User.users = db.collection('users');
  }

  static async createUser({ email, password }) {
    const existingUser = await User.users.findOne({ email });

    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    const result = await User.users.insertOne({ email, password });
    const user = result.ops[0];

    return { user };
  }

  static async findByEmail(email) {
    const user = await User.users.findOne({ email });
    return { user };
  }

  static async findById(id) {
    const user = await User.users.findOne({ _id: id });
    return { user };
  }
}

module.exports = User;
