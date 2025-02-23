const fs = require('fs');
const path = require('path');

// Dynamically load all tutorial files
const tutorials = new Map();

fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.endsWith('.js'))
    .forEach(file => {
        const tutorial = require(path.join(__dirname, file));
        tutorials.set(tutorial.id, tutorial);
    });

module.exports = tutorials;
