import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import env from '../config/env.js';
import { connectDatabase } from '../config/database.js';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: node src/scripts/createAdmin.js "Admin Name" admin@example.com "strong-password"');
  process.exit(1);
}

await connectDatabase();
const passwordHash = await bcrypt.hash(password, 12);
const user = await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  { name, email: email.toLowerCase(), passwordHash, role: 'admin' },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`Admin ready: ${user.email}`);
await (await import('mongoose')).default.disconnect();
