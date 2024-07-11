import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { welcomeMessage, convertUnit, mathOperation, processFile } from './secondFile.js';

const app = express(); // Create an instance of Express
const port = 3000; // Define the port number

// Enable files upload
app.use(fileUpload());

// Define __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve static files from the "public" directory (if you have one)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle welcome messages
app.get('/api/welcome', (req, res) => {
    const { firstName, lastName } = req.query;
    const message = welcomeMessage(firstName, lastName); // Use imported function
    res.send(message);
});

// Route to handle temperature conversion
app.get('/api/convert', (req, res) => {
    const { value } = req.query;
    const convertedValue = (parseFloat(value) * 9 / 5 + 32).toFixed(2);
    res.send(`Converted value: ${convertedValue}`);
});

// Route to handle factorial calculation
app.get('/api/math', (req, res) => {
    const { number } = req.query;
    const num = parseInt(number, 10);
    let result = 1;
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    res.send(`Math operation result: ${result}`);
});

// Route to handle file uploads
app.post('/api/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.markdownFile; // Get the uploaded file
    const uploadDir = path.join(__dirname, 'uploads'); // Define the upload directory
    const uploadPath = path.join(uploadDir, file.name); // Define the full path to the uploaded file

    try {
        await fs.mkdir(uploadDir, { recursive: true }); // Create the upload directory if it doesn't exist
        await file.mv(uploadPath); // Move the uploaded file to the upload directory
        const content = await processFile(uploadPath); // Process the uploaded file
        res.send(content); // Send the processed content as the response
    } catch (err) {
        res.status(500).send(err.message); // Handle errors
    }
});

// Route to handle loading the default README.md file
app.get('/api/default', async (req, res) => {
    const defaultFilePath = path.join(__dirname, 'Harjot-15.md'); // Define the path to the default file

    try {
        const content = await processFile(defaultFilePath); // Process the default file
        res.send(content); // Send the processed content as the response
    } catch (err) {
        res.status(500).send(err.message); // Handle errors
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
