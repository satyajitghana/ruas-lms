import connection from './db'
import express from 'express';
const router = express.Router();

/**
 * registers the group project into the database
 * 
 * @param req.body = {
 * project_leader_regno, project_name, mentor_name, department, category
 * }
 *
 * POST request tested works ✅
 {
	"project_leader_regno": "17ETCS002159",
	"project_name": "KrishiAI",
	"mentor_name": "Chaitra S",
	"department": "CSE",
	"category": "DL",
	"students": ["17ETCS002159"]
}
 * 
 *  
 * @author shadowleaf
 */
router.post('/register', (req, res) => {
    const { project_leader_regno, project_name, mentor_name, department, category } = req.body;

    // begin a transaction
    connection.beginTransaction((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: err });
            return;
        }

        // insert the project details into PROJEKT table
        connection.query('INSERT INTO PROJEKT(project_leader_regno, project_name, mentor_name, department, category) VALUE (?)', [[project_leader_regno, project_name, mentor_name, department, category]], (errors, results, fields) => {

            if (errors) {
                console.error(errors);
                connection.rollback(() => {
                    res.status(500).json({ message: errors });
                });
                return;
            }

            const project_id = results.insertId;

            // students to be registered for this project
            const { students } = req.body;
            const student_insert = students.map(obj => [project_id, obj]);

            // insert the student details
            connection.query("INSERT INTO PROJECT_STUDENT_REGISTER(project_id, student_reg_no) VALUES ?", [student_insert], (errors, results, fields) => {

                if (errors) {
                    console.error(errors);
                    connection.rollback(() => {
                        res.status(500).json({ message: errors });
                    });
                    return;
                }

                connection.commit((err) => {
                    if (err) {
                        console.error(err);
                        connection.rollback(() => {
                            res.status(500).json({ message: errors });
                        });
                        return;
                    }

                    res.json({ message: 'students registered for project successfully' });
                });
            });
        });
    });
});


// deletes a project from the table given its id
router.delete('/:id', (req, res) => {
    const proj_id = req.params.id;

    connection.beginTransaction((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: err });
            return;
        }

        connection.query('DELETE FROM PROJECT_STUDENT_REGISTER WHERE project_id = ?', proj_id, (error, result, fields) => {
            if (error) {
                console.error(error);
                connection.rollback(() => {
                    res.status(500).json({ message: error });
                });
                return;
            }

            connection.query('DELETE FROM PROJEKT WHERE id = ?', proj_id, (error, results, fields) => {
                if (error) {
                    console.error(error);
                    connection.rollback(() => {
                        res.status(500).json({ message: error });
                    });
                    return;
                }

                connection.commit((err) => {
                    if (err) {
                        console.error(err);
                        connection.rollback(() => {
                            res.status(500).json({ message: errors });
                        });
                        return;
                    }

                    res.json({ message: 'project registration deleted successfully' });
                });
            });
        });
    });
});

// fetched a project given a group member reg_no
router.get('/from-reg-no/:student_reg_no', (req, res) => {
    const std_reg_no = req.params.student_reg_no;

    connection.query('SELECT project_id FROM PROJECT_STUDENT_REGISTER where student_reg_no = ?', std_reg_no, (error, result, fields) => {
        if (error) {
            console.error(error);
            res.status(404).json({ message: error });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: 'project not found' });
            return;
        }

        const proj_id = result[0].project_id;

        connection.query('SELECT * FROM PROJEKT WHERE id = ?', proj_id, (error, result, fields) => {

            if (error) {
                console.error(error);
                res.status(404).json({ message: error });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ message: 'project not found' });
                return;
            }

            const project = result[0];

            connection.query('select p.student_reg_no as reg_no, c.name from PROJECT_STUDENT_REGISTER p JOIN STUDENT c ON c.reg_no = p.student_reg_no WHERE p.project_id = ?', project.id, (error, result, fields) => {

                if (error) {
                    console.error(error);
                    res.status(404).json({ message: error });
                    return;
                }

                if (result.length === 0) {
                    res.status(404).json({ message: 'students registered not found' });
                    return;
                }

                project.members = result;

                res.json(project);
            });

        });
    });
});

module.exports = router;
