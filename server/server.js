require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const { port, database } = require('pg/lib/defaults.js');

const app = express();
const PORT = process.env.PORT || 5000;
// TO do: Make login/sign up and dashoard later
// Database connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'moodbite',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '12345678',
});


//Test database connection
pool.connect((err, client, release) => {
    if(err){
        console.error('Error connecting to the database:', err.stack);
    } else{
        console.log('Connected to the database successfully');
        release();
    }
});


// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow all origins by default
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204 // For legacy browser support
}));
app.use(express.json({ limit: '10mb' })); // Limit JSON body size to 10mb
app.use(express.urlencoded({ extended: true})); // Limit


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter)


// Basic routes
app.get(`/api/health`, (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

//Restaurants routes
app.get(`/api/restaurants`, async (req, res) => {
    // Fetch restaurants based on query parameters
    // like: /api/restaurants?cuisine=italian
    try {
        const { cuisine } = req.query;
        let query =  `SELECT * FROM restaurants WHERE is_Open = true`;
        const queryParams = [];

        if (cuisine) {
            query += ' AND LOWER(cuisine) = LOWER($1)';
            queryParams.push(cuisine);
        }

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.use((err, req, res, next) =>{
    console.error('Error:', err);
    res.status(500).json({ error: 'Something Went Wrong!' });
});

app.use((req,res) => {
    res.status(404).json({ error: 'Route Not Found' });
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
    console.log('Database connected successfully');
});


module.exports = app;