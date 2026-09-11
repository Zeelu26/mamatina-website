// Generates a bcrypt hash for a new admin password.
//
// Usage:
//   node scripts/hash-password.mjs "your-new-password"
//
// Copy the printed hash, then in the Supabase SQL editor run:
//   update admins set password_hash = 'PASTE_HASH_HERE'
//   where email = 'admin@mamatina.com';

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Please pass a password, e.g.  node scripts/hash-password.mjs "MySecret123"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log("\nPassword hash (copy the line below):\n");
console.log(hash);
console.log("\nSQL to run in Supabase:\n");
console.log(
  `update admins set password_hash = '${hash}' where email = 'admin@mamatina.com';\n`,
);
