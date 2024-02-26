import React, { useEffect, useState } from 'react'
import { Recipe } from './List';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

function Tile({ id, name, ingredients, directions }: Recipe) {
  const [checkIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Create recipe object so we can send it to modal component
  var recipe: Recipe = {
    id: id,
    name: name,
    ingredients: ingredients,
    directions: directions
  }

  function openModal(id: number) {
    if (!checkIsOpen) {
      setIsOpen(!checkIsOpen);
      navigate(`/about/${id}`);
    }
  }

  // This function is passed into the Modal component
  function closeModal() {
    if (checkIsOpen) {
      setIsOpen(!checkIsOpen);
      navigate('/');
    }
  }

  return (
    <div onClick={() => openModal(recipe.id)}>
      <div className="m-4 px-6 pt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl outline outline-2 outline-blue-400 text-slate-200 text-xl select-none" style={{height: "80px"}}>{ name }</div>
      <Modal argId={recipe.id} argName={recipe.name} argIngredients={recipe.ingredients} argDirections={recipe.directions} isOpen={checkIsOpen} functionOnClose={closeModal}></Modal>
    </div>
  );
}

export default Tile