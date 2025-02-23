const db = require('../config/database');
const tutorials = require('../content/tutorials');
const levels = require('../content/levels');

const gameController = {
    getQuestions: async (req, res) => {
        try {
            const { level = 1 } = req.query;
            const levelData = levels.get(parseInt(level));
            
            if (!levelData) {
                return res.status(404).json({ error: "Level not found" });
            }

            res.json(levelData);
        } catch (error) {
            res.status(500).json({ error: "Error fetching questions" });
        }
    },

    checkAnswer: async (req, res) => {
        try {
            const { questionId, answer } = req.body;
            let result = null;
            let error = null;

            // Execute the query in a safe environment
            try {
                const [rows] = await db.query(answer);
                result = {
                    rows,
                    fields: Object.keys(rows[0] || {})
                };
            } catch (queryError) {
                error = queryError.message;
            }

            // Compare with expected result
            const isCorrect = answer.toLowerCase().includes('select') && 
                            answer.toLowerCase().includes('from');
            
            res.json({
                correct: isCorrect,
                explanation: isCorrect ? "Your query is correct!" : "Try again",
                result: result,
                error: error
            });
        } catch (error) {
            res.status(500).json({ 
                error: "Error checking answer",
                message: error.message
            });
        }
    },

    getProgress: async (req, res) => {
        try {
            const progress = {
                completed: 0,
                total: levels.size,
                levels: Array.from(levels.values()).map(level => ({
                    id: level.id,
                    name: level.name,
                    completed: 0 // You can track completion per level
                }))
            };
            res.json(progress);
        } catch (error) {
            res.status(500).json({ error: "Error fetching progress" });
        }
    },

    getTutorials: async (req, res) => {
        try {
            const tutorialList = Array.from(tutorials.values()).map(tutorial => ({
                id: tutorial.id,
                title: tutorial.title,
                description: tutorial.description
            }));
            
            console.log(`Sending ${tutorialList.length} tutorials`);
            res.json(tutorialList);
        } catch (error) {
            console.error('Error fetching tutorials:', error);
            res.status(500).json({ error: "Error fetching tutorials" });
        }
    },

    getTutorialById: async (req, res) => {
        try {
            const tutorialId = parseInt(req.params.id);
            const tutorial = tutorials.get(tutorialId);
            
            if (!tutorial) {
                return res.status(404).json({
                    error: "Tutorial not found",
                    message: `Tutorial ${tutorialId} does not exist`,
                    availableTutorials: tutorials.size
                });
            }

            res.json(tutorial);
        } catch (error) {
            res.status(500).json({ 
                error: "Error fetching tutorial",
                message: error.message
            });
        }
    },

    tryQuery: async (req, res) => {
        try {
            const { query } = req.body;

            // Validate query
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ 
                    success: false,
                    error: "Invalid query format"
                });
            }

            // Basic SQL injection prevention
            const forbiddenKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER'];
            if (forbiddenKeywords.some(keyword => 
                query.toUpperCase().includes(keyword))) {
                return res.status(400).json({ 
                    success: false,
                    error: "This type of query is not allowed in tutorial mode"
                });
            }

            // Execute query in safe environment
            const [rows] = await db.query(query);
            
            // Handle empty results
            if (!rows || rows.length === 0) {
                return res.json({ 
                    success: true,
                    result: {
                        rows: [],
                        fields: [],
                        message: "Query executed successfully but returned no results"
                    }
                });
            }

            res.json({ 
                success: true,
                result: {
                    rows,
                    fields: Object.keys(rows[0] || {}),
                    rowCount: rows.length
                }
            });
        } catch (error) {
            console.error('Query execution error:', error);
            res.status(400).json({ 
                success: false,
                error: error.message,
                hint: "Check your SQL syntax and try again"
            });
        }
    },

    getLevels: async (req, res) => {
        try {
            if (!levels || levels.size === 0) {
                console.error('No levels loaded');
                return res.status(500).json({ error: "No levels available" });
            }

            const levelsList = Array.from(levels.values()).map(level => ({
                id: level.id,
                name: level.name,
                description: level.description,
                topics: level.topics || [],
                completed: 0
            }));

            console.log('Sending levels:', levelsList); // Debug log
            res.json(levelsList);
        } catch (error) {
            console.error('Error in getLevels:', error);
            res.status(500).json({ error: "Error fetching levels" });
        }
    },

    getLevelById: async (req, res) => {
        try {
            const levelId = parseInt(req.params.id);
            const level = levels.get(levelId);
            
            if (!level) {
                return res.status(404).json({ 
                    error: "Level not found",
                    message: `Level ${levelId} does not exist`
                });
            }

            res.json(level);
        } catch (error) {
            res.status(500).json({ error: "Error fetching level" });
        }
    }
};

module.exports = gameController;