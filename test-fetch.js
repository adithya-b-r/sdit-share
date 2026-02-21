import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { fetchFiles } from './src/appwrite/config.js';

fetchFiles().then(res => {
  console.log(JSON.stringify(res, null, 2));
}).catch(err => {
  console.error(err);
});
