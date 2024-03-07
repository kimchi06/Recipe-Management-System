import { Link, useNavigate } from "react-router-dom";
import Tile from "./Tile";
import { useEffect, useState } from "react";

export interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  directions: string;
  time: string;
}

function List() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  // Initialize database and fetch recipes
  useEffect(() => {
    const handleRead = async () => {
      try {
        const response = await fetch(`http://localhost:8081/`)
    
        if (!response.ok) {
          throw new Error('Failed to GET')
        }
    
        const fetched = await response.json();
        const items: Recipe[] = fetched.map((item: any) => ({
          id: item.id,
          name: item.name,
          ingredients: item.ingredients,
          directions: item.directions,
          time: item.time
        }))
        setRecipes(items)

      } catch (error) {
        console.error('Error with GET')
      }
    };

    handleRead();
  }, []);
  console.log("Fetched: ", recipes);

  return (
    <body className="bg-gradient-to-r from-slate-900 to-sky-900 flex items-center justify-center h-screen">
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 w-2/5 rounded-lg outline outline-4 outline-blue-400" style={{height: "750px"}}>
        <div className="p-10 font-raleway text-6xl font-bold text-slate-200">Recipe app</div>
        <div className="px-10 text-slate-200 font-medium text-2xl">Saved recipes
          <div className="mt-2 p-2 no-scrollbar overflow-y-auto max-h-screen bg-blue-200 rounded-xl outline outline-4 outline-blue-400 content-start justify-normal items-center" style={{height: "440px"}}>
            {/* Put tiles in here-- take 'recipe' from 'recipes' and pass in parameters */}
            {/* Render message if no recipes */}
            { recipes.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div>
                  <p className="text-2xl text-blue-300 italic">Create your first recipe!</p>
                  <p className="text-lg text-blue-300 italic">&nbsp;Saved recipes will appear here.</p>
                </div>
              </div>
            ) : (
              <div>
                {/* Otherwise, display tiles */}
                { recipes.map((recipe, index) => (
                  <Tile key={index} id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} directions={recipe.directions} time={recipe.time} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center p-10">
        <Link to="/add" className="m-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 border-b-4 border-blue-700 hover:border-blue-500 rounded">Add recipe</Link>
        </div>
      </div>
    </body>
  )
}

export default List