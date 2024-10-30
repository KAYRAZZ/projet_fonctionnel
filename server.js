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
        const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    const { day, startDateTime, endDateTime } = req.body;

    if (!day || !startDateTime || !endDateTime) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }
    const userId = req.userId;

    db.query('INSERT INTO schedules (id_user, day, start_time, end_time) VALUES (?, ?, ?, ?)', [userId, day, startDateTime, endDateTime], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Erreur lors de l'enregistrement des horaires." });
        }
        res.status(201).json({ message: 'Horaires enregistrés avec succès.' });
    });
});

// Route pour récupérer les tâches
app.get('/tasks', authenticateJWT, (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Date is required.' });
    }

    const userId = req.userId;

    db.query('SELECT * FROM schedules_view WHERE id_user = ? AND day = ?', [userId, date], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des tâches.' });
        }
        res.status(200).json(results);
    });
});

// Route pour modifier le mot de 
app.post('/api/change-password', authenticateJWT, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    const userId = req.userId;

    db.query('SELECT password FROM users WHERE id_user = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const hashedPassword = results[0].password;

        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
            }

            if (!isMatch) {
                return res.status(403).json({ message: 'Current password is incorrect.' });
            }

            // Hacher le nouveau mot de passe
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.error('Error generating salt:', err);
                    return res.status(500).json({ message: 'Erreur lors de la création du sel.' });
                }

                bcrypt.hash(newPassword, salt, (err, newHashedPassword) => {
                    if (err) {
                        console.error('Error hashing new password:', err);
                        return res.status(500).json({ message: 'Erreur lors du hachage du nouveau mot de passe.' });
                    }

                    db.query('UPDATE users SET password = ? WHERE id_user = ?', [newHashedPassword, userId], (err) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.' });
                        }

                        res.status(200).json({ message: 'Mot de passe modifié avec succès.' });
                    });
                });
            });
        });
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});