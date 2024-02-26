// const helpers = {
//     init: async function() {
//         const q = 'CREATE TABLE IF NOT EXISTS recipes (id SERIAL PRIMARY KEY, name VARCHAR(255), ingredients VARCHAR(255), directions VARCHAR(255))';
//         const res = await pool.query(q);
//     },

//     getRecipes: async function() {
//         const res = await pool.query('SELECT * FROM recipes');
//         return res.rows;
//     },

//     addRecipe: async function(name, ing, dir) {
//         const q = 'INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)';
//         const res = await pool.query(q, [name, ing, dir]);
//     }
// }

// module.exports = { helpers }