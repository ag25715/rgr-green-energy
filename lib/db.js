import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'rgr_green_energy';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { maxPoolSize: 10 });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const c = await clientPromise;
  return c.db(dbName);
}

export const COL = {
  users: 'users',
  leads: 'leads',
  projects: 'projects',
  blogs: 'blogs',
  testimonials: 'testimonials',
  faqs: 'faqs',
  solutions: 'solutions',
  settings: 'settings',
  calc: 'calculator_settings',
  media: 'media',
  jobs: 'jobs',
  pages: 'pages',
  applications: 'job_applications',
};
