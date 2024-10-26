const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createAST, evaluateAST } = require('./astHelpers');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change this to your MySQL username
    password: 'dina11', // Change this to your MySQL password
    database: 'rule_engine', // Ensure this matches your created database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create Rule Endpoint
app.post('/create_rule', (req, res) => {
    const ruleString = req.body.rule_string;

    // Validate input
    if (!ruleString) {
        return res.status(400).json({ error: "Rule string is required" });
    }

    // Create AST
    try {
        const ast = createAST(ruleString); // Create AST
        const astJson = JSON.stringify(ast); // Convert AST to JSON

        // Insert into database
        const query = 'INSERT INTO rules (rule_string, ast) VALUES (?, ?)';
        db.query(query, [ruleString, astJson], (error, results) => {
            if (error) {
                console.error("Database insertion error:", error); // Log error details
                return res.status(500).json({ error: "Error saving rule to database." });
            }
            const ruleId = results.insertId; // Get the inserted ID
            res.status(200).json({ id: ruleId, message: "Rule created successfully" });
        });
    } catch (error) {
        console.error("Error creating AST:", error); // Log error details
        res.status(500).json({ error: "Error creating rule." });
    }
});

// Modify Rule Endpoint
app.put('/modify_rule/:id', (req, res) => {
    const ruleId = req.params.id;
    const newRuleString = req.body.rule_string;

    // Validate input
    if (!newRuleString) {
        return res.status(400).json({ error: "New rule string is required" });
    }

    try {
        const ast = createAST(newRuleString);
        const astJson = JSON.stringify(ast);

        const query = 'UPDATE rules SET rule_string = ?, ast = ? WHERE id = ?';
        db.query(query, [newRuleString, astJson, ruleId], (error, results) => {
            if (error) {
                console.error("Database update error:", error);
                return res.status(500).json({ error: "Error modifying rule." });
            }
            res.status(200).json({ message: "Rule modified successfully" });
        });
    } catch (error) {
        console.error("Error creating AST for modification:", error);
        res.status(500).json({ error: "Error modifying rule." });
    }
});

// Evaluate Rule Endpoint
app.post('/evaluate_rule', (req, res) => {
    const { ruleId, data } = req.body;

    // Validate input
    if (!ruleId || !data) {
        return res.status(400).json({ error: "Rule ID and data are required" });
    }

    const query = 'SELECT ast FROM rules WHERE id = ?';
    db.query(query, [ruleId], (error, results) => {
        if (error || results.length === 0) {
            console.error("Database retrieval error:", error);
            return res.status(404).json({ error: "Rule not found." });
        }

        try {
            const ast = JSON.parse(results[0].ast); // Parse AST from JSON
            const evaluationResult = evaluateAST(ast, data); // Evaluate AST with provided data
            res.status(200).json({ evaluationResult });
        } catch (error) {
            console.error("Error evaluating rule:", error);
            res.status(500).json({ error: "Error evaluating rule." });
        }
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
