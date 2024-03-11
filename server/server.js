// NPM modules
const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

// Data
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
    // First post into the Recipes table, then get the new rid
    const response = await pool.query('INSERT INTO Recipes(rname, directions, time) VALUES($1, $2, $3) RETURNING rid', [name, directions, time]);
    const recipeID = parseInt(response.rows[0].rid);
    // Pass the generated rid as a foreign key in the Ingredients table
    for (ingredient of ingredients) {
        console.log(ingredient)
        console.log(recipeID)
        await pool.query('INSERT INTO Ingredients(iname, rid) VALUES($1, $2)', [ingredient.iname, recipeID]);
    }
    res.send(name, ingredients, directions); 
});

app.post('/about/:id', async (req, res) => {
    const { ingredients, rid } = req.body;
    for (ingredient of ingredients) {
        await pool.query('INSERT INTO Ingredients(iname, rid) VALUES($1, $2)', [ingredient.iname, rid]);
    }
    res.send(ingredients); 
});

// READ
app.get('/', async (req, res) => {
    await pool.query('CREATE TABLE IF NOT EXISTS Recipes (rid SERIAL PRIMARY KEY, rname VARCHAR(255), directions VARCHAR(255), time VARCHAR(255))');
    await pool.query('CREATE TABLE IF NOT EXISTS Ingredients (iid SERIAL PRIMARY KEY, iname VARCHAR(255), rid INTEGER REFERENCES Recipes(rid))');
    // NOTE: Use response because we need a response that contains the data.
    //       Most of the time, we don't need it unless we want to check for errors or do more DB operations.
    const response1 = await pool.query('SELECT * FROM Recipes');
    const response1Rows = response1.rows;
    const response2 = await pool.query('SELECT * FROM Ingredients');
    const response2Rows = response2.rows;
    res.json({ recipes: response1Rows, ingredients: response2Rows })
});

app.get('/add', async (req, res) => {
    const response = await pool.query('SELECT * FROM Ingredients');
    res.send(response.rows);
})

// UPDATE
app.put('/about/:id', async (req, res) => {
    const { id, name, directions, time } = req.body;
    await pool.query('UPDATE Recipes SET rname = $2, directions = $3, time = $4 WHERE rid = $1', [id, name, directions, time]);
    res.send("Updated");
})

// DELETE
app.delete('/about/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM Ingredients WHERE rid = $1', [id]);
    await pool.query('DELETE FROM Recipes WHERE rid = $1', [id]);
    res.send("Deleted");
});

app.listen(port, '0.0.0.0')
console.log(`Running on http://0.0.0.0:${port}`)