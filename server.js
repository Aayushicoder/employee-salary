// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Read data from JSON file
const getData = () => {
    const data = fs.readFileSync('employees.json');
    return JSON.parse(data);
};

// Write data to JSON file
const saveData = (data) => {
    fs.writeFileSync('employees.json', JSON.stringify(data, null, 2));
};

// Routes
app.get('/employees', (req, res) => {
    const data = getData();
    res.json(data);
});

app.post('/employees', (req, res) => {
    const data = getData();
    const newEmployee = req.body;
    data.push(newEmployee);
    saveData(data);
    res.status(201).json(newEmployee);
});

app.put('/employees/:id', (req, res) => {
    const data = getData();
    const { id } = req.params;
    const updatedEmployee = req.body;

    const index = data.findIndex(employee => employee.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedEmployee };
        saveData(data);
        res.json(data[index]);
    } else {
        res.status(404).send('Employee not found');
    }
});

app.delete('/employees/:id', (req, res) => {
    const data = getData();
    const { id } = req.params;
    const index = data.findIndex(employee => employee.id === id);

    if (index !== -1) {
        const deletedEmployee = data.splice(index, 1);
        saveData(data);
        res.json(deletedEmployee);
    } else {
        res.status(404).send('Employee not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
