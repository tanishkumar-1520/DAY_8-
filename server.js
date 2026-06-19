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
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(jsonData || "[]");
}

// Helper: JSON Data Write Karne Ke Liye
function writeJsonData(data) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


/* ==================== ROUTERS ==================== */

// 1. GET /Book -> Fetch all patients from JSON
app.get('/Book', (req, res) => {
    res.json(readJsonData());
});

// 2. GET /Book/:id -> Fetch single patient by ID
app.get('/Book/:id', (req, res) => {
    const data = readJsonData();
    const record = data.find(item => item.id === parseInt(req.params.id));
    if (!record) return res.status(404).json({ message: "Patient not found" });
    res.json(record);
});

// 3. POST /books -> Add patient to BOTH JSON and TXT file
app.post('/books', (req, res) => {
    const data = readJsonData();
    
    if (!req.body.name || !req.body.disease) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    const patientId = Date.now();
    const patientName = req.body.name;
    const patientAge = req.body.age || "N/A";
    const patientDisease = req.body.disease;
    const currentDate = new Date().toLocaleDateString();

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

    // [STEP B]: Text file (.txt) mein simple format mein save karein
    const textData = `ID: ${patientId} | Name: ${patientName} | Age: ${patientAge} | Disease: ${patientDisease} | Date: ${currentDate}\n------------------------------------------------------------\n`;
    
    fs.appendFileSync(textFilePath, textData, 'utf-8');

    res.status(201).json(newBooking);
});

// 4. DELETE /books/:id -> Delete from JSON (Note: Text files are logs, so it logs entry)
app.delete('/books/:id', (req, res) => {
    let data = readJsonData();
    const initialLength = data.length;
    data = data.filter(item => item.id !== parseInt(req.params.id));
    
    if (data.length === initialLength) {
        return res.status(404).json({ message: "Record not found" });
    }
    
    writeJsonData(data);
    res.json({ message: "Deleted successfully from JSON database" });
});

// Root Route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
