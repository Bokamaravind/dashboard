require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bokamaravind_db_user:Aravind@007@cluster0.mfyvep3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected for seeding');

  await User.deleteMany({});
await Product.deleteMany({});
await Order.deleteMany({});
    console.log('Cleared existing data');
  
  // Add many users
  const users = await User.insertMany([
    { name: 'Charlie', email: 'charlie@example.com' },
    { name: 'David', email: 'david@example.com' },
    { name: 'Eva', email: 'eva@example.com' },
    { name: 'Frank', email: 'frank@example.com' },
    { name: 'Grace', email: 'grace@example.com' }
  ]);
  console.log(`Inserted ${users.length} new users`);

  // Add many products
  const products = await Product.insertMany([
    { name: 'Phone', category: 'Electronics', price: 499.99, stock: 30 },
    { name: 'Tablet', category: 'Electronics', price: 299.99, stock: 20 },
    { name: 'Shoes', category: 'Fashion', price: 79.99, stock: 100 },
    { name: 'Watch', category: 'Fashion', price: 199.99, stock: 50 },
    { name: 'Backpack', category: 'Accessories', price: 59.99, stock: 200 }
  ]);
  console.log(`Inserted ${products.length} new products`);

    // Insert fixed sample orders (with specific dates)
await Order.insertMany([
  {
    userId: users[0]._id, // e.g. Charlie
    items: [{ productId: products[0]._id, qty: 2, price: products[0].price }],
    total: products[0].price * 2,
    status: "delivered",
    createdAt: new Date("2025-09-22")
  },
  {
    userId: users[1]._id, // e.g. David
    items: [{ productId: products[1]._id, qty: 1, price: products[1].price }],
    total: products[1].price,
    status: "processing",
    createdAt: new Date("2025-09-23")
  }
]);

// Insert bulk random orders

const fixedOrders = [
  {
    userId: users[0]._id,
    items: [{ productId: products[0]._id, qty: 2, price: products[0].price }],
    total: products[0].price * 2,
    status: "delivered",
    createdAt: new Date("2025-09-22")
  },
  {
    userId: users[1]._id,
    items: [{ productId: products[1]._id, qty: 1, price: products[1].price }],
    total: products[1].price,
    status: "processing",
    createdAt: new Date("2025-09-23")
  }
];
await Order.insertMany(fixedOrders);
console.log(`Inserted fixed sample orders`);

  // Add many orders (loop to generate more data)
  const orders = [];
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const qty = Math.ceil(Math.random() * 5);
    const total = qty * randomProduct.price;

    orders.push({
      userId: randomUser._id,
      items: [{ productId: randomProduct._id, qty, price: randomProduct.price }],
      total,
      status: ['pending', 'processing', 'delivered'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // random past date
    });
  }

  await Order.insertMany(orders);
  console.log(`Inserted ${orders.length} new orders`);

  mongoose.disconnect();
  console.log('Seeding finished ✅');
}

seed().catch(err => console.error(err));
