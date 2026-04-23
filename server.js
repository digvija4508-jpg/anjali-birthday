const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Persistent Cloud Storage (Backend only)
const DB_URL = 'https://api.jsonblob.com/019dbbad-38e3-78e3-9c7b-2a79a6c12e32';

app.use(bodyParser.json());
app.use(express.static('public'));

// API: Get Wishes
app.get('/api/wishes', async (req, res) => {
    try {
        const response = await fetch(DB_URL);
        const data = await response.json();
        res.json(data || []);
    } catch (error) {
        console.error('Fetch error:', error);
        res.json([]);
    }
});

// API: Add Wish
app.post('/api/wishes', async (req, res) => {
    try {
        // req.body is the full array of notes from the client
        const response = await fetch(DB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        if (response.ok) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to save' });
        }
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
