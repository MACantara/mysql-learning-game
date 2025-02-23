const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes should come before static files
app.use('/api', apiRoutes);

// Static file serving with proper MIME types
app.use(express.static(path.join(__dirname, '../frontend'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
    }
}));

// Route all other requests to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Tutorial routes
app.get('/tutorials', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/tutorials.html'));
});

app.get('/tutorials/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/tutorial.html'));
});

// Redirect base tutorial path to first tutorial
app.get('/tutorials', (req, res) => {
    res.redirect('/tutorials/1');
});

// Levels route
app.get('/levels', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/levels.html'));
}
);

// Enhanced error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 'INTERNAL_ERROR'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET /api/levels');
    console.log('- GET /api/tutorials');
    console.log('- GET /api/progress');
});