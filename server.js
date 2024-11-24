import express from 'express';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json()); // Additional middleware to parse JSON

// Create a MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Route for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (username.length == 0 || password.length == 0) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }else{
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) return res.status(500).json(err); // Handle database error
            res.status(201).json({ message: 'User registered' }); // Success response
        });
    }
});
// Route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        const user = results[0];
        // Check if the password matches the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        // Generate JWT token for the authenticated user
        const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // Send token in response
    });
});

// Middleware to verify JWT tokens
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract token from the header
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.sendStatus(403); // Forbidden if token verification fails
            }
            req.userId = user.id; // Attach user ID to the request object
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        res.sendStatus(401); // Unauthorized if no token is provided
    }
};

// Route to save schedules
app.post('/api/schedule', authenticateJWT, (req, res) => {
    const { day, startDateTime, endDateTime } = req.body;

    // Check for required fields
    if (!day || !startDateTime || !endDateTime) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }
    const userId = req.userId; // Get user ID from the request object

    // Insert schedule into the database
    db.query('INSERT INTO schedules (id_user, day, start_time, end_time) VALUES (?, ?, ?, ?)', [userId, day, startDateTime, endDateTime], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Erreur lors de l'enregistrement des horaires." });
        }
        res.status(201).json({ message: 'Horaires enregistrés avec succès.' }); // Success response
    });
});

// Route to retrieve tasks based on date
app.get('/tasks', authenticateJWT, (req, res) => {
    const { date } = req.query;

    // Check if date parameter is provided
    if (!date) {
        return res.status(400).json({ message: 'Date is required.' });
    }

    const userId = req.userId; // Get user ID from the request object

    // Query the database for schedules on the specified date
    db.query('SELECT * FROM schedules_view WHERE id_user = ? AND day = ?', [userId, date], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des tâches.' });
        }
        res.status(200).json(results); // Send results back to client
    });
});

// Route to change user password
app.post('/api/change-password', authenticateJWT, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Check for required fields
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    const userId = req.userId; // Get user ID from the request object

    // Query the database to find the user's current password
    db.query('SELECT password FROM users WHERE id_user = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' }); // User not found
        }

        const hashedPassword = results[0].password;

        // Compare current password with the stored hashed password
        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
            }

            if (!isMatch) {
                return res.status(403).json({ message: 'Current password is incorrect.' }); // Incorrect current password
            }

            // Hash the new password before updating it in the database
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

                    // Update the user's password in the database
                    db.query('UPDATE users SET password = ? WHERE id_user = ?', [newHashedPassword, userId], (err) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.' });
                        }

                        res.status(200).json({ message: 'Mot de passe modifié avec succès.' }); // Success response
                    });
                });
            });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log server start
});
