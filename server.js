const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Files ke paths
const jsonFilePath = path.join(__dirname, 'patients.json');
const textFilePath = path.join(__dirname, 'patients.txt');

// Helper: JSON Data Read Karne Ke Liye
function readJsonData() {
    if (!fs.existsSync(jsonFilePath)) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
        return JSON.parse(jsonData || "[]");
    } catch (e) {
        // Handle corrupted JSON files
        console.error("Error reading JSON file, resetting database.");
        return [];
    }
}

// Helper: JSON Data Write Karne Ke Liye
function writeJsonData(data) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


/* ==================== PROFESSIONAL API ROUTERS ==================== */

// Standardized Path to /patients

// 1. GET /patients -> Fetch all patients
app.get('/patients', (req, res) => {
    res.json(readJsonData());
});

// 2. GET /patients/:id -> Fetch single patient by ID
app.get('/patients/:id', (req, res) => {
    const data = readJsonData();
    const record = data.find(item => item.id === parseInt(req.params.id));
    if (!record) return res.status(404).json({ message: "Patient not found" });
    res.json(record);
});

// 3. POST /patients -> Add patient
app.post('/patients', (req, res) => {
    const data = readJsonData();
    
    // Enhanced Validation
    if (!req.body.name || !req.body.disease || !req.body.age) {
        return res.status(400).json({ message: "Name, Age, and Disease are required fields." });
    }

    const patientId = Date.now(); // unique ID based on timestamp
    const patientName = req.body.name;
    const patientAge = req.body.age;
    const patientDisease = req.body.disease;
    
    // Better date format: YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

    // Object for JSON File
    const newBooking = {
        id: patientId,
        name: patientName,
        age: patientAge,
        disease: patientDisease,
        date: currentDate
    };

    // [STEP A]: JSON file mein save karein
    data.push(newBooking);
    writeJsonData(data);

    // [STEP B]: Text file (Log) in professional format
    const timestamp = new Date().toLocaleString();
    const textData = `[${timestamp}] | ADDED | ID: ${patientId} | Patient: ${patientName} | Age: ${patientAge} | Diagnosis: ${patientDisease} | AdmDate: ${currentDate}\n`;
    
    fs.appendFileSync(textFilePath, textData, 'utf-8');

    res.status(201).json(newBooking);
});

// 4. DELETE /patients/:id -> Delete record
app.delete('/patients/:id', (req, res) => {
    let data = readJsonData();
    const initialLength = data.length;
    
    const patientToDelete = data.find(item => item.id === parseInt(req.params.id));
    data = data.filter(item => item.id !== parseInt(req.params.id));
    
    if (data.length === initialLength) {
        return res.status(404).json({ message: "Record not found" });
    }
    
    writeJsonData(data);

    // [STEP B]: Text file (Log) deletion
    const timestamp = new Date().toLocaleString();
    const textLog = `[${timestamp}] | DELETED | ID: ${req.params.id} | Patient: ${patientToDelete ? patientToDelete.name : 'Unknown'}\n`;
    fs.appendFileSync(textFilePath, textLog, 'utf-8');

    res.json({ message: "Deleted successfully from JSON database" });
});

// Root Route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`Hospital Dashboard running at http://localhost:${PORT}`);
    console.log(`=================================================\n`);
});