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

app.listen(5000, () => {
    console.log('Server running on port 5000');
});