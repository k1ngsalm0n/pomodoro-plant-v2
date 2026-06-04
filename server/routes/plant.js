const express = require('express');
const router = express.Router();
const db = require('../database');
const authToken = require('../middleware/auth');

router.get('/', authToken, (req, res) => {
    const userId = req.user.id;
    db.get('SELECT flower_id, stage FROM plant WHERE user_id = ?', [userId], (err, plant) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }
        res.json(plant || { flower_id : null, stage: 0 })
    })
})

router.post('/complete', authToken, (req, res) => {
    const userId = req.user.id;
    function resetPlant() {
        const newFlowerId = Math.floor(Math.random() * 30) + 1
        db.run('UPDATE plant SET flower_id = ?, stage = 0 WHERE user_id = ?', [newFlowerId, userId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' })
            }
            res.json({ message: 'Plant completed' })
        })
    }
    db.get('SELECT flower_id, stage FROM plant WHERE user_id = ?', [userId], (err, plant) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }
        db.run('INSERT INTO sessions (user_id) VALUES (?)', [userId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' })
            }
        })
        if (!plant) {
            resetPlant()
        } else {
            const stage = plant.stage + 1
            db.run('UPDATE plant SET stage = ? WHERE user_id = ?', [stage, userId], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' })
                }
            })
            if (stage === 4) {
                db.get('SELECT id, count FROM collection WHERE user_id = ? AND flower_id = ?', [userId, plant.flower_id], function(err, existing) {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' })
                    }
                    if (existing) {
                        db.run('UPDATE collection SET count = count + 1 WHERE id = ?', [existing.id], function(err) {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' })
                            }
                        })
                    } else {
                        db.run('INSERT INTO collection (user_id, flower_id) VALUES (?, ?)', [userId,plant.flower_id], function(err) {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' })
                            }
                        })
                    }
                    resetPlant()
                })
            } else {
                db.run('UPDATE plant SET stage = ? WHERE user_id = ?', [stage, userId], function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' })
                    }
                })
                res.json({ message: 'Plant grew', stage })
            }
        }
    })
})

module.exports = router