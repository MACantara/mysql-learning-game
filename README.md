# MySQL Learning Game

An interactive web-based game to help beginners learn MySQL through hands-on exercises and tutorials.

## Features

- 🎮 Interactive SQL query exercises
- 📚 Step-by-step tutorials
- 🎯 Progressive difficulty levels
- 🔄 Real-time query execution
- 💡 Helpful hints and explanations

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

## Project Structure

```
mysql-learning-game/
├── src/
│   ├── frontend/           # Frontend assets and components
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript modules
│   │   └── index.html     # Main HTML file
│   └── backend/           # Backend server and API
│       ├── content/       # Tutorial and level content
│       ├── config/        # Configuration files
│       ├── routes/        # API routes
│       └── controllers/   # Request handlers
├── exercises/             # SQL exercise files
├── node_modules/         # Dependencies (git-ignored)
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore patterns
├── package.json         # Project metadata and dependencies
└── README.md           # Project documentation
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mysql-learning-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize the database:**
   ```bash
   # Run the setup script
   mysql -u your_username -p < exercises/setup.sql
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. Open `http://localhost:3000` in your web browser

## Development

- Frontend files are in `src/frontend/`
- Backend API is in `src/backend/`
- Add new tutorials in `src/backend/content/tutorials/`
- Add new levels in `src/backend/content/levels/`

## Database Configuration

Create a `src/backend/config/database.js` file with your MySQL credentials:

```javascript
module.exports = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'mysql_learning_game'
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the UI components
- MySQL community for documentation and resources
- Contributors who help improve the game