const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js Backend');
});

// Function to test the database connection and create the 'course' table if it doesn't exist
const testDbConnection = async () => {
    try {
        // Execute a simple query to test the connection
        const [rows] = await db.query('SELECT 1');
        console.log('Database connection successful!');

        // Create 'course' table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS course (
                id INT AUTO_INCREMENT PRIMARY KEY,
                srno INT,
                name VARCHAR(100),
                description VARCHAR(300),
                isActive BOOLEAN
            );
        `;
        await db.query(createTableQuery);
        console.log('Course table created or already exists.');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

// API to insert data into the 'course' table
app.post('/course', async (req, res) => {
    const { srno, name, description, isActive } = req.body;

    if (!srno || !name || !description || isActive === undefined) {
        return res.status(400).send('Missing required fields');
    }

    const insertQuery = `
        INSERT INTO course (srno, name, description, isActive) 
        VALUES (?, ?, ?, ?);
    `;
    
    try {
        await db.query(insertQuery, [srno, name, description, isActive]);
        res.status(201).send('Course inserted successfully');
    } catch (error) {
        res.status(500).send('Error inserting course: ' + error.message);
    } 
});

// API to get all courses from the 'course' table
app.get('/courses', async (req, res) => {
    const selectQuery = 'SELECT * FROM course';

    try {
        const [rows] = await db.query(selectQuery);
        if (rows.length === 0) {
            return res.status(404).send('No courses found');
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error fetching courses: ' + error.message);
    }
});

// API to delete a course by ID
app.delete('/course/:id', async (req, res) => {
    const courseId = req.params.id;

    if (!courseId) {
        return res.status(400).send('Course ID is required');
    }

    const deleteQuery = 'DELETE FROM course WHERE id = ?';

    try {
        const [result] = await db.query(deleteQuery, [courseId]);
        
        // If no rows are affected, the course with the given ID doesn't exist
        if (result.affectedRows === 0) {
            return res.status(404).send('Course not found');
        }

        res.status(200).send('Course deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting course: ' + error.message);
    }
});

// API to update a course by ID
app.put('/course/:id', async (req, res) => {
    const courseId = req.params.id;
    const { srno, name, description, isActive } = req.body;

    if (!srno || !name || !description || isActive === undefined) {
        return res.status(400).send('Missing required fields');
    }

    const updateQuery = `
        UPDATE course 
        SET srno = ?, name = ?, description = ?, isActive = ? 
        WHERE id = ?;
    `;
    
    try {
        const [result] = await db.query(updateQuery, [srno, name, description, isActive, courseId]);

        // If no rows are affected, the course with the given ID doesn't exist
        if (result.affectedRows === 0) {
            return res.status(404).send('Course not found');
        }

        res.status(200).send('Course updated successfully');
    } catch (error) {
        res.status(500).send('Error updating course: ' + error.message);
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    // Test the DB connection and create the table as soon as the server starts
    await testDbConnection();
    console.log(`Server running on http://localhost:${PORT}`);
});
