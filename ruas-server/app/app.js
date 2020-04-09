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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


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