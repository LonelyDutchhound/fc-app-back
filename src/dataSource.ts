import { RESTDataSource } from "apollo-datasource-rest";

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

export interface ICard {
  _id: string;
  title: string;
  description: string;
  theme: string;
}

export interface ITheme {
  _id
  name
  description
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
          console.error('error during connection attempt', err);
          reject(err)
        }
      });
    })
  }

  async getThemes (): Promise<ITheme[]> {
    const db: any = await this.connect();
    const collection = await db.collection('themes');
    return  collection.find({}).toArray();
  }

  async getCards(): Promise<ICard[]> {
    const db: any = await this.connect();
    const collection = await db.collection('cards');
    return collection.find({}).toArray();
  }

  async addCard(args): Promise<ICard> {
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
