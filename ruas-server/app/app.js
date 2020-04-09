import express from 'express';
import bodyparser from 'body-parser';
import stafflogin from './routes/staff';
import student from './routes/student';
import projekt from './routes/projekt';
import project_exhibitions from './routes/project-exhibitions';
import cors from 'cors';

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to RUAS Server' })
});

app.use('/staff', stafflogin);
app.use('/student', student);
app.use('/projekt', projekt);
app.use('/exhibition', project_exhibitions);

app.use((err, req, res, next) => {
    res.status(err.status || 501);
    res.json({
        message: err.message
    });
});

module.exports = app;