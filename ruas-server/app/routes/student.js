import connection from './db'
import jwtconfig from '../config/jwt.config';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router();

// user login using user_name and password
// returns user details and token
// test POST request ✅ PASS
// {
// 	"user_name": "17ETCS002159",
// 	"password": "satyajit123"
// }
router.post('/login', (req, res) => {
    console.log(req.body);

    const { user_name, password } = req.body;

    // fetch the hashed password from the db
    connection.query('SELECT id, hashed_password FROM `STUDENT_LOGIN` WHERE `user_name` = ? LIMIT 1', user_name, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: error });
            return;
        } else if (results.length == 0) {
            res.status(404).json({ message: 'user not found' });
            return;
        }

        const user = results[0];

        // check if the password is correct
        bcrypt.compare(password, user.hashed_password, (err, result) => {
            if (result == true) {
                console.info('user ' + user_name + ' is logging in');

                // create an access token for this user
                const access_token = jwt.sign({ username: user.user_name, role: 'student' }, jwtconfig.JWT_ACCESS_TOKEN);

                // fetch the user details from the db
                connection.query('SELECT * FROM STUDENT WHERE id = ? LIMIT 1', user.id, (error, results, fields) => {

                    if (error) {
                        console.error(error);
                        res.status(500).json({ message: error });
                        return;
                    } else if (results.length == 0) {
                        res.status(404).json({ message: 'user not found' });
                        return;
                    }

                    // return the user and the access token
                    res.json({ user: results[0], token: access_token });

                });
            } else {
                res.status(401).json({ message: 'incorrect password' });
                return;
            }
        });
    });
});

// register student account with user_name and password
// test POST request ✅ PASS
// {
// 	"user_name": "17ETCS002159",
// 	"password": "satyajit123",
// 	"reg_no": "17ETCS002159",
// 	"name": "Satyajit Ghana",
// 	"department": "CSE",
// 	"course": "B.Tech",
// 	"contact_no": "9898989898"
// }
router.post('/register', (req, res) => {

    const { user_name, password } = req.body;
    const { reg_no, name, department, course, contact_no } = req.body;

    const saltRounds = 10;

    // create a hashed password with salt
    bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) {
            console.error(err);
            res.status(500).json({ message: err });
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: err });
                return;
            }

            // create the login credentials row
            connection.query('INSERT INTO STUDENT_LOGIN( user_name, hashed_password ) VALUE (?)', [[user_name, hash]], (errors, results, fields) => {
                if (errors) {
                    console.error(errors);
                    connection.rollback(() => {
                        res.status(500).json({ message: errors });
                    });
                    return;
                }

                const id = results.insertId;

                // add the students details to the table
                connection.query('INSERT INTO STUDENT( id, reg_no, name, department, course, contact_no ) VALUES (?)', [[id, reg_no, name, department, course, contact_no]], (errors, results, fields) => {
                    if (errors) {
                        console.error(errors);
                        connection.rollback(() => {
                            res.status(500).json({ message: errors });
                        });
                        return;
                    }

                    // commit the transaction
                    connection.commit((err) => {
                        if (err) {
                            console.error(err);
                            connection.rollback(() => {
                                res.status(500).json({ message: err });
                            });
                            return;
                        }

                        res.json({ message: 'user added successfully' });
                    });
                });
            });
        });
    });
});

module.exports = router;
