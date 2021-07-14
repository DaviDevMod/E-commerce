import { MongoClient } from 'mongodb';

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { client: null };
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 20000,
}

export async function connectToDb() {

  if (!cached.client?.isConnected()) {
    try {
      cached.client = await MongoClient.connect(process.env.MONGODB_URI, options);
    } catch (e) {
      console.log(e);
    }
  }

  return cached.client;
}

// input  --> 'hi there hi'
// output --> 'hi the ther there '
export function generateQueryString(query) {
  const originalQuery = decodeURIComponent(query).split(' ');
  const ngrams = new Set();
  for (const word of originalQuery) {
    if (word.length > 3) {
      for (let i = word.length; i > 2; i--) {
        ngrams.add(word.slice(0, i));
      }
    }
    else ngrams.add(word);
  }
  let finalQuery = '';
  ngrams.forEach(word => finalQuery += word + ' ');
  return finalQuery;
}