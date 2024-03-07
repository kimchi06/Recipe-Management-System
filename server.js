// NPM modules
const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Data
var recipes = [];
const port = 8080;

// Database
var pool;
pool = new Pool({
    user: 'postgres',
    host: 'db',
    password: 'root'
});

// CREATE
app.post('/add', async (req, res) => {
    const { name, ingredients, directions, time } = req.body;
    console.log(name, ingredients, directions);
    const response = await pool.query('INSERT INTO recipes(name, ingredients, directions, time) VALUES($1, $2, $3, $4)', [name, ingredients, directions, time]);
    res.send(name, ingredients, directions); 
});

// READ
app.get('/', async (req, res) => {
    await pool.query('CREATE TABLE IF NOT EXISTS recipes (id SERIAL PRIMARY KEY, name VARCHAR(255), ingredients VARCHAR(255), directions VARCHAR(255), time VARCHAR(255))');
    const response = await pool.query('SELECT * FROM recipes');
    res.send(response.rows);
});

// UPDATE
app.put('/about/:id', async (req, res) => {
    const { id, name, ingredients, directions, time } = req.body;
    const response = await pool.query('UPDATE recipes SET name = $2, ingredients = $3, directions = $4, time = $5 WHERE id = $1', [id, name, ingredients, directions, time]);
    res.send("Updated");
})

// DELETE
app.delete('/about/:id', async (req, res) => {
    const { id } = req.params;
    const response = await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
    res.send("Deleted");
});

app.listen(port, '0.0.0.0')
console.log(`Running on http://0.0.0.0:${port}`)