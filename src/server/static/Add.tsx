import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from './List';

function Add() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");

  function reset() {
    setName("");
    setIngredients("");
    setDirections("");
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    // Prevent refresh at button click
    e.preventDefault();
    
    // Recipe to be added
    const recipe: Recipe = {
      id: 0,
      name: name,
      ingredients: ingredients,
      directions: directions
    };

    try {
      const response = await fetch(`http://localhost:8081/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, ingredients: ingredients, directions: directions })
      });
  
      if (!response.ok) {
        throw new Error('Failed to POST')
      }

    } catch (error) {
      console.error('Error with POST')
    }
    
    window.location.href = '/';
  }

  return (
    <body className="bg-gradient-to-r from-slate-900 to-sky-900 flex items-center justify-center h-screen">
      <div className="bg-slate-800 w-2/5 rounded-lg outline outline-4 outline-blue-400" style={{height: "750px"}}>
        <div className="px-10 pt-10 pb-8 font-raleway text-6xl font-bold text-slate-200">Add recipe</div>
        <div className="flex flex-col justify-around">
          <form onSubmit={(e) => handleCreate(e)} id="form">
          <div className="px-10 text-sky-500 font-medium">
              <p className="py-2 text-2xl">Recipe name</p>
              <input value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500" 
              type="text" 
              placeholder="Enter name"></input>
          </div>
          <div className="px-10 text-sky-500 font-medium">
              <p className="py-2 text-2xl">Ingredients</p>
              <textarea value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              className="min-h-[150px] resize-none bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500" 
              placeholder="Enter ingredients"></textarea>
          </div>
          <div className="px-10 text-sky-500 font-medium">
              <p className="py-2 text-2xl">Directions</p>
              <textarea value={directions} 
              onChange={(e) => setDirections(e.target.value)}
              required
              className="min-h-[150px] resize-none bg-slate-700 appearance-none border-2 border-gray-600 rounded w-full py-2 px-4 text-slate-300 leading-tight focus:outline-none focus:text-slate-200 focus:border-sky-500" 
              placeholder="Enter directions"></textarea>
          </div>
          <div className="flex justify-center items-center p-8">
              <Link to="/" className="m-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 border-2 border-slate-700 hover:border-slate-700 rounded">Cancel</Link>
              <button type="reset" onClick={reset} className="m-2 bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-5 border-b-4 border-blue-900 hover:border-blue-800 rounded">Reset</button>
              <button type="submit" className="m-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 border-b-4 border-blue-700 hover:border-blue-500 rounded">Save</button>
          </div>
          </form>
        </div>
      </div>
    </body>
  )
}

export default Add