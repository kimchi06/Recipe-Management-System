import React, { useState } from 'react'
import { Recipe } from './List';

// This class lets us pass in variables whenever the <Modal> component is used
interface Modal {
    argId: number;
    argName: string;
    argIngredients: string;
    argDirections: string;
    isOpen: boolean;
    functionOnClose: () => void;
}

function Modal({ argId, argName, argIngredients, argDirections, isOpen, functionOnClose }: Modal) {
  // These hooks are for setting and changing the variables upon initialization
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState(argName);
  const [ingredients, setIngredients] = useState(argIngredients);
  const [directions, setDirections] = useState(argDirections);

  var recipe: Recipe = {
    id: argId,
    name: argName,
    ingredients: argIngredients,
    directions: argDirections
  }

  function restore() {
    setName(argName);
    setIngredients(argIngredients);
    setDirections(argDirections);
  }

  async function handleDelete() {
    try {
      const response = await fetch(`http://localhost:8081/about/${recipe.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to DELETE');
      }

    } catch (error) {
      console.error('Error with DELETE');
    }
    
    window.location.href = '/';
  }

  // Only return if 'isOpen' is true-- otherwise keep hiding the modal
  if (!isOpen) { return null; }

  return (
    <div className="absolute top-0 left-0 bg-black/50 w-full flex flex-row min-h-screen justify-center items-center">
      <div className="w-1/3 bg-gradient-to-r from-slate-300 to-slate-400 m-4 p-6 outline outline-4 outline-slate-400 rounded-xl text-base text-slate-600 select-none" style={{height: "680px"}}>
      {/* Hide modal and restore defaults on close */}
      <button onClick={() => {
        functionOnClose()
        restore()
      }} 
      className="float-right text-2xl my-2 mr-6 px-3 pb-1 bg-red-500 hover:bg-red-400 text-white font-bold border-b-4 border-red-700 hover:border-red-500 rounded">x</button>
      <p className="text-4xl mx-6 mt-2">Edit recipe</p> <br></br>
        <div className="flex justify-center items-center">
          <div className="w-11/12 mx-3 no-scrollbar overflow-y-auto max-h-screen content-start justify-normal items-center" style={{height: "510px"}}>
            <div>
              <p className="py-2 text-2xl">Recipe name</p>
              <input value={name}
              required
              placeholder="Enter name"
              className="bg-slate-300 my-1 appearance-none border-2 border-slate-400 rounded w-full py-2 px-4 text-slate-500 leading-tight focus:outline-none focus:text-slate-600 focus:border-slate-500"
              onChange={e => setName(e.target.value)}
              ></input> <br></br>
            </div>
            <div>
              <p className="py-2 text-2xl">Ingredients</p>
              <textarea value={ingredients}
              required
              placeholder="Enter ingredients"
              className="min-h-[120px] resize-none bg-slate-300 appearance-none border-2 border-slate-400 rounded w-full py-2 px-4 text-slate-500 leading-tight focus:outline-none focus:text-slate-600 focus:border-slate-500"
              onChange={e => setIngredients(e.target.value)}
              ></textarea> <br></br>
            </div>
            <div>
              <p className="py-2 text-2xl">Directions</p>
              <textarea value={directions}
              required
              placeholder="Enter directions"
              className="min-h-[120px] resize-none bg-slate-300 appearance-none border-2 border-slate-400 rounded w-full py-2 px-4 text-slate-500 leading-tight focus:outline-none focus:text-slate-600 focus:border-slate-500" 
              onChange={e => setDirections(e.target.value)}
              ></textarea> <br></br>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={() => {
                handleDelete()
              }} className="m-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-5 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</button>
              <button onClick={() => {
                functionOnClose()
              }}
              type="submit" className="m-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 border-b-4 border-blue-700 hover:border-blue-500 rounded">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal