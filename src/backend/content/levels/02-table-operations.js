module.exports = {
    id: 2,
    name: 'Table Operations',
    description: 'Learn how to create and modify database tables',
    topics: ['CREATE TABLE', 'ALTER TABLE'],
    questions: [
        {
            id: 1,
            title: 'Create Table',
            question: "Create a table named 'products' with columns: id (INT PRIMARY KEY), name (VARCHAR), price (DECIMAL)",
            difficulty: "intermediate",
            answer: "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2))",
            hint: "Use CREATE TABLE with column definitions",
            explanation: "CREATE TABLE creates a new table with specified columns and data types"
        },
        {
            id: 2,
            title: 'Modify Table',
            question: "Add a 'category' column to the 'products' table",
            difficulty: "intermediate",
            answer: "ALTER TABLE products ADD COLUMN category VARCHAR(50)",
            hint: "Use ALTER TABLE with ADD COLUMN",
            explanation: "ALTER TABLE modifies an existing table's structure"
        }
    ]
};
