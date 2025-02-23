module.exports = {
    id: 2,
    title: "Table Operations",
    description: "Learn how to create and modify tables",
    introduction: `
        In this tutorial, you'll learn how to:
        - Create new tables using CREATE TABLE
        - Modify existing tables using ALTER TABLE
        - Delete tables using DROP TABLE
    `,
    examples: [
        {
            description: "Create a new table",
            query: "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100))",
            explanation: "This creates a new table with id and name columns"
        },
        {
            description: "Alter existing table",
            query: "ALTER TABLE products ADD COLUMN price DECIMAL(10,2)",
            explanation: "This adds a new price column to the products table"
        }
    ]
};
