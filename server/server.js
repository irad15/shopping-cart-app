const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');
const PRODUCTS_PATH = path.join(__dirname, 'products.json');

const readDb = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// GET products
app.get('/api/products', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(PRODUCTS_PATH)));
});

// REGISTER
app.post('/api/register', (req, res) => {
  const db = readDb();
  const { email, password } = req.body;
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ error: 'User already exists' });

  db.users.push({ email, password });
  if (!db.carts[email]) db.carts[email] = { items: [] };
  writeDb(db);
  res.json({ success: true, email });
});

// LOGIN
app.post('/api/login', (req, res) => {
  const db = readDb();
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ success: true, email });
});

// GET cart
app.get('/api/cart', (req, res) => {
  const email = req.headers['x-user-email'] || req.query.email;
  if (!email) return res.status(401).json({ error: 'No user email provided' });

  const db = readDb();
  res.json(db.carts[email] || { items: [] });
});

// UPDATE cart
app.post('/api/cart', (req, res) => {
  const email = req.headers['x-user-email'] || req.body.email;
  if (!email) return res.status(401).json({ error: 'No user email provided' });

  const db = readDb();
  db.carts[email] = req.body.cart || req.body;
  writeDb(db);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Backend running at http://localhost:3000');
  console.log('Test: curl http://localhost:3000/api/products');
  console.log('Test: curl http://localhost:3000/api/debug/db');
});





// for DEBUG: see the whole db.json in your browser (remove later if you want)
app.get('/api/debug/db', (req, res) => {
  res.json(readDb());
});