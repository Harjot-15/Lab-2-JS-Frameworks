import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

// Function 1: Welcome Message
// This function accepts a first name and a last name as parameters
// and returns a welcome message string.
function welcomeMessage(firstName, lastName) {
    return `Welcome ${firstName} ${lastName} to Georgian@ILAC College`;
}

// Function 2: Convert Unit (Celsius to Fahrenheit)
// This function accepts a temperature in Celsius as a parameter
// and returns the temperature converted to Fahrenheit.
function convertUnit(celsius) {
    return celsius * 9 / 5 + 32;
}

// Function 3: Math Operation (Factorial)
// This function accepts a number as a parameter and returns the factorial of that number.
function mathOperation(number) {
    let result = 1;
    for (let i = 1; i <= number; i++) {
        result *= i;
    }
    return result;
}

// Function 4: Process File (Read and Convert Based on File Type)
// This asynchronous function accepts a file path as a parameter,
// reads the content of the file, and processes it based on the file extension.
// It supports Markdown (.md) and text (.txt) files.
async function processFile(filePath) {
    try {
        const ext = path.extname(filePath).toLowerCase(); // Get the file extension
        const fileContent = await fs.readFile(filePath, 'utf-8'); // Read the file content
        let processedContent;

        // Process the content based on the file extension
        if (ext === '.md') {
            processedContent = marked(fileContent); // Convert Markdown to HTML
        } else if (ext === '.txt') {
            processedContent = `<pre>${fileContent}</pre>`; // Wrap text content in <pre> tags
        } else {
            processedContent = 'Unsupported file type'; // Handle unsupported file types
        }

        return processedContent;
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return 'Error reading file';
    }
}

export { welcomeMessage, convertUnit, mathOperation, processFile };
