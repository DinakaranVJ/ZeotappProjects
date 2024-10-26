import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [ruleString, setRuleString] = useState('');
    const [jsonData, setJsonData] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [evaluationResult, setEvaluationResult] = useState('');
    const [ruleId, setRuleId] = useState('');
    const [modifyRuleString, setModifyRuleString] = useState('');

    // Function to create a new rule
    const handleCreateRule = () => {
        fetch('http://localhost:3000/create_rule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rule_string: ruleString }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setResponseMessage(`Rule created successfully with ID: ${data.id}`);
                setRuleId(data.id); // Set rule ID for potential modifications
            })
            .catch(error => {
                console.error('Error:', error);
                setResponseMessage('Error creating rule.');
            });
    };

    // Function to modify an existing rule
    const handleModifyRule = () => {
        fetch(`http://localhost:3000/modify_rule/${ruleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rule_string: modifyRuleString }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setResponseMessage(`Rule with ID: ${ruleId} modified successfully.`);
            })
            .catch(error => {
                console.error('Error:', error);
                setResponseMessage('Error modifying rule.');
            });
    };

    // Function to evaluate a rule against provided JSON data
    const handleEvaluateRule = () => {
        fetch(`http://localhost:3000/evaluate_rule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ruleId, data: JSON.parse(jsonData) }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Evaluation Result:', data);
                setEvaluationResult(`Evaluation Result: ${data.result}`);
            })
            .catch(error => {
                console.error('Error:', error);
                setEvaluationResult('Error evaluating rule.');
            });
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Rule Engine</h1>
            <div className="form-container">
                <h2>Create Rule</h2>
                <input
                    type="text"
                    placeholder="Enter rule string here..."
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleCreateRule} className="action-button">Create Rule</button>
                <p>{responseMessage}</p>
            </div>

            <div className="form-container">
                <h2>Modify Rule</h2>
                <input
                    type="text"
                    placeholder="Enter new rule string..."
                    value={modifyRuleString}
                    onChange={(e) => setModifyRuleString(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleModifyRule} className="action-button">Modify Rule</button>
                <p>{responseMessage}</p>
            </div>

            <div className="form-container">
                <h2>Evaluate Rule</h2>
                <input
                    type="text"
                    placeholder='Enter JSON data here (e.g., {"age": 35, "department": "Sales"})'
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleEvaluateRule} className="action-button">Evaluate Rule</button>
                <p>{evaluationResult}</p>
            </div>
        </div>
    );
};

export default App;
