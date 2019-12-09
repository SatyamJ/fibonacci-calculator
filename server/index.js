const express = require('express');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');
const keys = require('./keys');


// create express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// pg setup
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    user: keys.pgUser
});

pgClient.on('error', () => {
    console.log('Lost postgres connection');
});


pgClient
    .query('CREATE TABLE IF NOT EXISTS indices (number INT)')
    .then(res => console.log(res))
    .catch(error => console.log('Error occurred while creating table indices', error));


// redis setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/indices', (req, res) => {
    pgClient.query('SELECT * from indices')
        .then(result => {
            console.log(result);
            res.send(result.rows);
        })
        .catch(error => console.log('Error occurred while fetching indices from PG', error))
});

app.post('/indices/:index', (req, res) => {
    const index = req.params.index;
    if (parseInt(index) > 40) {
        res.status(422)
            .send({
                httpStatus: 422,
                message: 'Index too high'
            })
    }

    redisClient.hset('values', index, 'Nothing yet');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO indices(number) VALUES($1)', [index])
        .then(result => console.log(result))
        .catch(error => console.log('Error occurred while creating indices values', error));

    res.status(200)
        .send({
            working: 'true'
        })
});

app.get('/values', (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    })
});

app.get('/', (req, res) => {
    res.send({
        message: 'Hi there',
        status: 'OK'
    });
});

app.listen(5000, error => {
    if (error) {
        console.log(error);
    } else {
        console.log('server listening @ port 5000 ...');
    }
});