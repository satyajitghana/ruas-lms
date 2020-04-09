import connection from './db'
import jwtconfig from '../config/jwt.config';

import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {

    const { user_name, hashed_password } = req.body;

    connection.query('SELECT `hashed_password` FROM `STAFF_LOGIN` WHERE `user_name` = ? LIMIT 1', user_name, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: error });
            throw error;
        } else if (results.length == 0) {
            res.status(404).json({ message: 'user not found' });
            return;
        }

        const user = results[0];

        if (user.hashed_password === hashed_password) {
            const access_token = jwt.sign({ username: user.user_name, role: 'staff' }, jwtconfig.JWT_ACCESS_TOKEN);
            res.json({ access_token });
        } else {
            res.status(401).json({ message: 'incorrect password' });
        }

    });
});

// these are debug routes, dont use in production
router.get('/', (req, res, next) => {
    connection.query('SELECT * FROM STAFF_LOGIN', (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: error });
            throw error;
        }
        res.json(results);
    });
});

router.get('/:user_name', (req, res) => {
    connection.query('SELECT * FROM `STAFF_LOGIN` WHERE `user_name` = ? LIMIT 1', [req.params.user_name], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: error });
            throw error;
        } else if (results.length == 0) {
            res.status(404).json({ message: 'user not found' });
        }
        res.status(200).json(results[0]);
    });
});


module.exports = router;
