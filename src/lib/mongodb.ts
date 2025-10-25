import { MongoClient } from 'mongodb';

const MONGODB_URI = import.meta.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

await client.connect();
const db = client.db('osuturkiye-website');

export default db;
