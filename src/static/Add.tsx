import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

export interface Ingredient {
  iid: number,
  iname: string,
  rid: number
}

function Add() {
  const [name, setName] = useState("");
  const [directions, setDirections] = useState("");

  const [selected, setSelected] = useState<any[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectOptions, setSelectOptions] = useState<any[]>([]);

  // Every time the "selected" variable (aka. the values of the input)
  // is changed, detect it and adjust list of selected ingredients
  useEffect(() => {
    if (selected) {
      const selectedIngredients: Ingredient[] = selected.map((selection: any) => ({
        iid: 0, // Unknown until created
        iname: selection.label,
        rid: 0  // Unknown until created
      }));
      setIngredients(selectedIngredients);      
    }
  }, [selected])

  // The values from a multi-change input returns an object-- use 
  // this function to handle the values 
  function handleMultiChange(values: any) {
    setSelected(values);
  }

  // Fetch ingredients on page load
  useEffect(() => {
    const handleReadIngredients = async () => {
      try {
        const response = await fetch(`http://localhost:8081/add`)
    
        if (!response.ok) {
          throw new Error('Failed to GET')
        }
    
        const fetched = await response.json();
        const items: Ingredient[] = fetched.map((item: any) => ({
          iid: item.iid,
          iname: item.iname,
          rid: item.rid
        }))
        setIngredients(items)

        // Add as Select form options
        var selectOptionsList: any[] = [];
        items.forEach(ingredient => {
          selectOptionsList.push({ value: ingredient.iname, label: ingredient.iname });
        });
        setSelectOptions(selectOptionsList);

      } catch (error) {
        console.error('Error with GET')
      }
    };

    handleReadIngredients();
  }, []);

  function reset() {
    setName("");
    setDirections("");
    setSelected([]);
    setIngredients([]);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    // Prevent refresh at button click
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8081/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, ingredients: ingredients, directions: directions, time: new Date().toString() })
      });
  
      if (!response.ok) {
        throw new Error('Failed to POST')
      }

    } catch (error) {
      console.error('Error with POST', error)
    }
    
    window.location.href = '/';
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 to-sky-900 flex items-center justify-center h-screen">
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
          <div className="px-10 py-6 text-sky-500 font-medium">
              <p className="py-2 text-2xl">Ingredients</p>
              <CreatableSelect 
              value={selected}
              onChange={handleMultiChange}
              options={selectOptions}
              required
              isMulti
              isClearable
              styles={{
                option: defaultStyles => ({
                  ...defaultStyles,
                  color: "black"
                }),
                clearIndicator: defaultStyles => ({
                  ...defaultStyles,
                  color: "white",
                  borderColor: "rgb(14 165 233)",
                  ":hover": { 
                    color: "rgb(203 213 225)",
                    cursor: "pointer"
                  }
                }),
                dropdownIndicator: defaultStyles => ({
                  ...defaultStyles,
                  color: "white",
                  borderColor: "rgb(14 165 233)",
                  ":hover": { 
                    color: "rgb(203 213 225)",
                    cursor: "default" 
                  }
                }),
                placeholder: defaultStyles => ({
                  ...defaultStyles,
                  color: "rgb(156 163 174)",
                  paddingLeft: "7px"
                }),
                input: defaultStyles => ({
                  ...defaultStyles,
                  color: "rgb(203 213 225)",
                  paddingLeft: "7px",
                }),
                control: (defaultStyles, state) => ({
                  ...defaultStyles,
                  ":hover": { 
                    borderColor: state.isFocused ? "rgb(14 165 233)": "rgb(75 85 99)",
                    borderWidth: "1px",
                    cursor: "text" 
                  },
                  boxShadow: 'none', // Disable blue border
                  backgroundColor: "rgb(51 65 85)", 
                  borderColor: state.isFocused ? "rgb(14 165 233)": "rgb(75 85 99)",
                  borderWidth: "1px",
                  color: "black"
                }),
                multiValue: defaultStyles => ({
                  ...defaultStyles,
                  backgroundColor: "rgb(224 242 254)",
                  marginLeft: "8px"
                }),
                multiValueLabel: defaultStyles => ({
                  ...defaultStyles,
                  color: "rgb(3 105 161)"
                }),
                multiValueRemove: defaultStyles => ({
                  ...defaultStyles,
                  color: "rgb(3 105 161)",
                  backgroundColor: "rgb(224 242 254)",
                  ":hover": { 
                    color: "rgb(224 242 254)",
                    backgroundColor: "rgb(3 105 161)"
                  }
                })
              }}
              />
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
    </div>
  )
}

export default Add