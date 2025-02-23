const fs = require('fs');
const path = require('path');

// Dynamically load all level files
const levels = new Map();

fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.endsWith('.js'))
    .forEach(file => {
        const level = require(path.join(__dirname, file));
        levels.set(level.id, level);
    });

module.exports = levels;
