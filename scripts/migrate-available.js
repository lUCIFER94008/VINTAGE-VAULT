const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Simple .env.local parser
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const MONGODB_URI = envContent.split('\n')
  .find(line => line.startsWith('MONGODB_URI='))
  ?.split('=')[1]
  ?.trim();

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Define a minimal schema
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');

    console.log('Updating all products to set available: true...');
    const result = await Product.updateMany(
      {}, // Update all products
      { $set: { available: true } }
    );

    console.log(`Migration complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

migrate();
