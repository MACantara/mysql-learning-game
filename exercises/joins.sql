-- Joins Exercise 1: Inner Join
SELECT players.name, teams.team_name
FROM players
INNER JOIN teams ON players.team_id = teams.id;

-- Joins Exercise 2: Left Join
SELECT players.name, teams.team_name
FROM players
LEFT JOIN teams ON players.team_id = teams.id;

-- Joins Exercise 3: Right Join
SELECT players.name, teams.team_name
FROM players
RIGHT JOIN teams ON players.team_id = teams.id;

-- Joins Exercise 4: Full Outer Join
SELECT players.name, teams.team_name
FROM players
FULL OUTER JOIN teams ON players.team_id = teams.id;

-- Joins Exercise 5: Self Join
SELECT a.name AS player_name, b.name AS teammate_name
FROM players a
INNER JOIN players b ON a.team_id = b.team_id AND a.id <> b.id;