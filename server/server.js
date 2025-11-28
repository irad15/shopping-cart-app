const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());                    // Allow Angular (4200) to talk to this server
app.use(express.json());            // Automatically parse JSON bodies

const DB_PATH = path.join(__dirname, 'db.json');
const PRODUCTS_PATH = path.join(__dirname, 'products.json');

const readDb = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Public: get all products
app.get('/api/products', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(PRODUCTS_PATH)));
});

// Register new user
app.post('/api/register', (req, res) => {
  const db = readDb();
  const { email, password } = req.body;

  if (db.users.some(u => u.email === email))
    return res.status(400).json({ error: 'User already exists' });

  db.users.push({ email, password });
  db.carts[email] = { items: [] };      // create empty cart for new user
  writeDb(db);

  res.json({ success: true, email });
});

// Login user
app.post('/api/login', (req, res) => {
  const db = readDb();
  const { email, password } = req.body;

  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ success: true, email });
});

// Get user's cart – user identified by x-user-email header
app.get('/api/cart', (req, res) => {
  const email = req.headers['x-user-email'] || req.query.email;
  if (!email) return res.status(401).json({ error: 'No user email provided' });

  const db = readDb();
  const userCart = db.carts[email] || { items: [] };
  res.json(userCart);
});

// Save (replace) user's cart
app.post('/api/cart', (req, res) => {
  const email = req.headers['x-user-email'] || req.body.email;
  if (!email) return res.status(401).json({ error: 'No user email provided' });

  const db = readDb();
  const cartData = req.body.cart || req.body;
  db.carts[email] = cartData;
  writeDb(db);

  res.json({ success: true });
});

// Debug only – view full database
app.get('/api/debug/db', (req, res) => res.json(readDb()));

app.listen(3000, () => {
  console.log('Backend running at http://localhost:3000');
});