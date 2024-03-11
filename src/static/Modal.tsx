import React, { useEffect, useState } from 'react'
import { Recipe } from './List';
import { Ingredient } from './Add';
import CreatableSelect from 'react-select/creatable';

// This class lets us pass in variables whenever the <Modal> component is used
interface Modal {
    argId: number;
    argName: string;
    argIngredients: Ingredient[];
    argDirections: string;
    argTime: string;
    isOpen: boolean;
    functionOnClose: () => void;
}

function Modal({ argId, argName, argIngredients, argDirections, argTime, isOpen, functionOnClose }: Modal) {
  // These hooks are for setting and changing the variables upon initialization
  const [name, setName] = useState(argName);
  const [directions, setDirections] = useState(argDirections);
  const [time, setTime] = useState(argTime);

  const [selected, setSelected] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectOptions, setSelectOptions] = useState<any[]>([]);

  // Upon loading the modal, set the selected ingredients
  useEffect(() => {
    // Add as Select form options
    var selectOptionsList: any[] = [];
    recipe.ingredients.forEach(ingredient => {
      selectOptionsList.push({ value: ingredient.iid, label: ingredient.iname });
    });
    // Set the ingredients by default, have them in list if removed
    setSelected(selectOptionsList);
    setSelectOptions(selectOptionsList);
  }, [])

  // Every time the "selected" variable (aka. the values of the input)
  // is changed, detect it and adjust list of selected ingredients
  useEffect(() => {
    if (selected) {
      const selectedIngredients: Ingredient[] = selected.map((selection: any) => ({
        iid: selection.value,
        iname: selection.label,
        rid: recipe.id
      }));
      // Set currently selected ingredients
      setIngredients(selectedIngredients);
    }
  }, [selected])

  // The values from a multi-change input returns an object-- use 
  // this function to handle the values 
  function handleMultiChange(values: any) {
    setSelected(values);
  }

  var recipe: Recipe = {
    id: argId,
    name: argName,
    ingredients: argIngredients,
    directions: argDirections,
    time: argTime
  }

  function restore() {
    setName(argName);
    setDirections(argDirections);
    setIngredients([]);
  }

  // Date formatting
  var displayDate = new Date(recipe.time).toLocaleDateString('en-us', {year:"numeric", month:"long", day:"numeric"}) + ", " +
                    new Date(recipe.time).toLocaleTimeString('en-us');

  async function handleUpdate() {
    // Check for changes first
    if (name != recipe.name || ingredients != argIngredients || directions != recipe.directions) {
      // First, update name, directions, and time
      try {
        const response = await fetch(`http://localhost:8081/about/${recipe.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: recipe.id, name: name, directions: directions, time: new Date().toString() })
        });

        if (!response.ok) {
          throw new Error('Failed to UPDATE');
        }

      } catch (error) {
        console.error('Error with UPDATE');
      }

      // Next, post the ingredients
      try {
        const response = await fetch(`http://localhost:8081/about/${recipe.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: ingredients, rid: recipe.id })
        });

        if (!response.ok) {
          throw new Error('Failed to POST');
        }

      } catch (error) {
        console.error('Error with POST');
      }
    }

    window.location.href = '/';
  }

  async function handleDelete() {
    try {
      const response = await fetch(`http://localhost:8081/about/${recipe.id}`, {
        method: 'DELETE'
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
      <p className="text-4xl mx-6 my-4">Edit recipe</p>
      <p className="text-sm mx-6 text-slate-500 italic">Last modified: {displayDate}</p>
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
            <div className="py-6 font-medium">
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
                  color: "rgb(148 163 184)",
                  borderColor: "rgb(14 165 233)",
                  ":hover": { 
                    color: "rgb(100 116 139)",
                    cursor: "pointer"
                  }
                }),
                dropdownIndicator: defaultStyles => ({
                  ...defaultStyles,
                  color: "rgb(148 163 184)",
                  borderColor: "rgb(14 165 233)",
                  ":hover": { 
                    color: "rgb(100 116 139)",
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
                  color: "rgb(71 85 105)",
                  paddingLeft: "7px",
                }),
                control: (defaultStyles, state) => ({
                  ...defaultStyles,
                  ":hover": { 
                    borderColor: state.isFocused ? "rgb(100 116 139)": "rgb(148 163 184)",
                    borderWidth: "2px",
                    cursor: "text" 
                  },
                  boxShadow: 'none', // Disable blue border
                  backgroundColor: "rgb(203 213 225)", 
                  borderColor: state.isFocused ? "rgb(100 116 139)": "rgb(148 163 184)",
                  borderWidth: "2px",
                  color: "rgb(148 163 184)"
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
            <div>
              <p className="py-2 text-2xl">Directions</p>
              <textarea value={directions}
              required
              placeholder="Enter directions"
              className="min-h-[120px] resize-none bg-slate-300 appearance-none border-2 border-slate-400 rounded w-full py-2 px-4 text-slate-500 leading-tight focus:outline-none focus:text-slate-600 focus:border-slate-500" 
              onChange={e => setDirections(e.target.value)}
              ></textarea> <br></br>
            </div>
            <div>
              <input value={time}
              type="hidden"></input>
            </div>
            <div className="p-8 flex justify-center items-center">
              <button onClick={() => {
                handleDelete()
              }} className="m-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-5 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</button>
              <button onClick={() => {
                handleUpdate()
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