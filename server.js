const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'farmer_platform'
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Register Route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) throw err;
        res.send('User registered');
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// Get User Profile
app.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT username, email, first_name, last_name, phone FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Update User Profile
app.put('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;
    const sql = 'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?';
    db.query(sql, [first_name, last_name, phone, userId], (err, results) => {
        if (err) throw err;
        res.send('Profile updated');
    });
});

//create a new product
app.post('/products', authenticateToken, (req, res) => {
    const { name, description, price, quantity, image_url, category } = req.body;
    const farmer_id = req.user.id;
    const sql = 'INSERT INTO products (farmer_id, name, description, price, quantity, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [farmer_id, name, description, price, quantity, image_url, category], (err, result) => {
        if (err) throw err;
        res.send('Product created');
    });
});

// get all products
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

//get a single product by ID
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

//update a product
app.put('/products/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;
    const { name, description, price, quantity, image_url, category } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?, category = ? WHERE id = ? AND farmer_id = ?';
    db.query(sql, [name, description, price, quantity, image_url, category, productId, req.user.id], (err, result) => {
        if (err) throw err;
        res.send('Product updated');
    });
});

//update a product
app.delete('/products/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ? AND farmer_id = ?';
    db.query(sql, [productId, req.user.id], (err, result) => {
        if (err) throw err;
        res.send('Product deleted');
    });
});

//search endpoint
app.get('/search', (req, res) => {
    const query = req.query.q;
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const location = req.query.location; // Assuming you have location data

    let sql = 'SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?)';
    let params = [`%${query}%`, `%${query}%`];

    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }
    if (minPrice) {
        sql += ' AND price >= ?';
        params.push(minPrice);
    }
    if (maxPrice) {
        sql += ' AND price <= ?';
        params.push(maxPrice);
    }
    if (location) {
        sql += ' AND location = ?'; // Adjust based on your location data structure
        params.push(location);
    }

    db.query(sql, params, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Middleware to Authenticate Token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(5000, () => {
    console.log('Server running on port 5000');
});