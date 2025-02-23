-- Basic Queries Exercise

-- 1. Select all columns from the 'users' table
SELECT * FROM users;

-- 2. Select the 'username' and 'email' columns from the 'users' table
SELECT username, email FROM users;

-- 3. Count the number of records in the 'games' table
SELECT COUNT(*) FROM games;

-- 4. Find all games with a rating greater than 4
SELECT * FROM games WHERE rating > 4;

-- 5. Retrieve all users who have played a specific game
SELECT users.username 
FROM users 
JOIN game_played ON users.id = game_played.user_id 
WHERE game_played.game_id = ?;  -- Replace ? with the specific game ID

-- 6. Get the average score of all games
SELECT AVG(score) FROM game_scores;

-- 7. List all distinct game genres
SELECT DISTINCT genre FROM games;