import connection from './db'
import express from 'express';
const router = express.Router();

// gets the room allocation details for a given project_id
router.get('/:project_id', (req, res) => {

    connection.query('SELECT a.room_id, b.room_name, a.table_no FROM PROJECT_EXHIBITION a join EXHIBITION b ON a.room_id = b.room_id WHERE a.project_id = ? LIMIT 1', req.params.project_id, (error, results, fields) => {

        if (error) {
            console.error(error);
            res.status(500).json({ message: error });
            return;
        }

        if (results.length === 0) {
            res.status(500).json({ message: 'table has not been booked for this project' });
        }

        res.json(results[0]);

    });
});

/**
 * registers for a project, given its project id
 * @author shadowleaf
 */
router.post('/register/:project_id', (req, res) => {

    // find a room that has space
    connection.query('SELECT t1.room_id, t1.room_name, t1.capacity, IFNULL(t2.count, 0) AS count FROM EXHIBITION t1 LEFT JOIN (select room_id, count(table_no) as count from PROJECT_EXHIBITION group by room_id) as t2 on t1.room_id = t2.room_id AND t2.count <= t1.capacity LIMIT 1', (error, results, field) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: error });
            return;
        }

        if (results[0].capacity === results[0].count || results.length === 0) {
            res.status(500).json({ message: 'no empty rooms found' });
            return;
        }

        // check if the room is completely empty
        if (results[0].count === 0) {
            // fill in table 1
            connection.query(`INSERT INTO PROJECT_EXHIBITION VALUES (${results[0].room_id}, ${req.params.project_id}, 1)`, (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: error });
                    return;
                }


                res.json({ message: 'project registered successfully', id: results.insertId });
            });
        } else {
            // find the next empty table
            connection.query(`SELECT a.room_id, a.table_no AS beforegap, a.table_no + 1 AS avail FROM PROJECT_EXHIBITION a WHERE (SELECT b.table_no FROM PROJECT_EXHIBITION b WHERE b.table_no = a.table_no + 1) IS NULL AND a.table_no + 1 <= (SELECT capacity FROM EXHIBITION where room_id = a.room_id) AND a.room_id = ${results[0].room_id} LIMIT 1`, (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: error });
                    return;
                }

                if (results.length === 0) {
                    res.status(500).json({ message: 'no available tables found in rooms' });
                    return;
                }

                const next_available_table = results[0].avail;

                // fill in the next available table
                connection.query(`INSERT INTO PROJECT_EXHIBITION VALUES (${results[0].room_id}, ${req.params.project_id}, ${next_available_table})`, (error, results, fields) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json({ message: error });
                        return;
                    }

                    res.json({ message: 'project registered successfully', id: results.insertId });
                });
            });
        }
    });

});


// de-register a project given its proj_id
router.delete('/deregister/:proj_id', (req, res) => {

    const proj_id = req.params.proj_id;

    connection.query('DELETE FROM PROJECT_EXHIBITION WHERE project_id = ?', proj_id, (error, result, fields) => {

        if (error) {
            console.error(error);
            res.status(500).json({ message: error });
            return;
        }

        res.json({ message: 'project deregistered successfully' });
    });

});

module.exports = router;

// find the rooms which have space in them (not full)
// select t1.room_id, t1.room_name, t1.capacity, IFNULL(t2.count, 0) as count FROM exhibition t1 LEFT JOIN (select room_id, count(table_no) as count from project_exhibition group by room_id) as t2 on t1.room_id = t2.room_id AND t2.count <= t1.capacity;

// use the first result and search for one table which is not selected and table no < capacity
// select a.room_id, a.table_no as beforegap, a.table_no + 1 as avail from project_exhibition a where (select b.table_no from project_exhibition b where b.table_no = a.table_no + 1) is null and a.table_no + 1 <= (select capacity from exhibition where room_id = a.room_id) and a.room_id = 1 limit 1;