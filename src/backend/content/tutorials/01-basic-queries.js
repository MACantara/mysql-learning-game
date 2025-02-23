module.exports = {
    id: 1,
    title: "Basic SQL Queries",
    description: "Learn the fundamentals of SQL queries starting with SELECT statements",
    introduction: `
        In this tutorial, you'll learn how to:
        - Retrieve data using SELECT statements
        - Filter data using WHERE clause
        - Sort data using ORDER BY
    `,
    examples: [
        {
            description: "Select all users",
            query: "SELECT * FROM users",
            explanation: "This returns all columns and all rows from the users table"
        },
        {
            description: "Select specific columns",
            query: "SELECT username, email FROM users",
            explanation: "This returns only the username and email columns"
        },
        {
            description: "Filter results",
            query: "SELECT * FROM users WHERE username = 'john'",
            explanation: "This returns all columns but only for users named 'john'"
        }
    ]
};
