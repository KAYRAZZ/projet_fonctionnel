import express from 'express';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Inscription
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'User registered' });
    });
});

// Connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware pour vérifier le token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.sendStatus(403);
            }
            req.userId = user.id; 
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Route pour enregistrer les horaires
app.post('/api/schedule', authenticateJWT, (req, res) => {
    console.log('Request received at /api/schedule');
    const { day, startDateTime, endDateTime } = req.body;
    console.log('Received data:', req.body);
    console.log('Day:', day);
    console.log('Start DateTime:', startDateTime);
    console.log('End DateTime:', endDateTime);

    if (!day || !startDateTime || !endDateTime) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }
    const userId = req.userId;

    db.query('INSERT INTO schedules (user_id, day, start_time, end_time) VALUES (?, ?, ?, ?)', [userId, day, startDateTime, endDateTime], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Erreur lors de l'enregistrement des horaires." });
        }
        res.status(201).json({ message: 'Horaires enregistrés avec succès.' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});