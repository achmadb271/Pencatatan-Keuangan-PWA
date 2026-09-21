require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Base Route
app.get('/', (req, res) => {
    res.json({
        name: 'Expense Tracker PWA API',
        version: '1.0.0',
        status: 'online',
    });
});

// API Routes
app.use('/api', router);

app.listen(port, () => {
    console.log(`Backend Server running on http://localhost:${port}`);
});
