import { RESTDataSource } from "apollo-datasource-rest";

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

export interface Card {
  id: string;
  title: string;
  description: string;
  theme: string;
}

const dbName = 'flashcards';
const dbUrl = 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl, { useUnifiedTopology: true });

export class StorageAPI extends RESTDataSource {
  private connect() {
    let db;
    return new Promise((resolve, reject) => {
      client.connect(function (err) {
        if (!err) {
          db = client.db(dbName);
          resolve(db)
        } else {
          console.error('error during connection', err);
          reject(err)
        }
      });
    })
  }

  async getCards(): Promise<Card[]> {
    const db: any = await this.connect();
    const collection = await db.collection('cards');
    const res = await collection.find({}).toArray();
    return res.map(item => ({ ...item, id: item._id }));
  }

  async addCard(args): Promise<Card> {
    const {title, description, theme} = args.input;
    const db: any = await this.connect();
    const collection = await db.collection('cards');
    const result = await collection.insertOne({
      title,
      description,
      theme : ObjectID(theme)
    });
    return result.ops[0];
  }

  async deleteCard(args): Promise<boolean> {
    const {id} = args.input;
    const db: any = await this.connect();
    const collection = await db.collection('cards');
    const result = await collection.deleteOne({ _id: ObjectID(id)});
    return result.deletedCount;
  }

}
