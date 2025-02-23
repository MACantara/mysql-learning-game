module.exports = {
    id: 1,
    name: 'Basic SQL Queries',
    description: 'Learn the fundamentals of SQL querying',
    topics: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
    questions: [
        {
            id: 1,
            title: 'SELECT Basics',
            question: "Write a query to select all columns (*) from the 'users' table",
            difficulty: "beginner",
            answer: "SELECT * FROM users",
            hint: "Use SELECT * FROM table_name",
            explanation: "The SELECT * statement retrieves all columns from a table"
        },
        {
            id: 2,
            title: 'INSERT Data',
            question: "Insert a new user with username 'john' and email 'john@example.com'",
            difficulty: "beginner",
            answer: "INSERT INTO users (username, email) VALUES ('john', 'john@example.com')",
            hint: "Use INSERT INTO with column names and VALUES",
            explanation: "INSERT INTO adds new rows to a table"
        }
    ]
};
