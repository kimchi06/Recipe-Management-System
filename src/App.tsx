import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import List from './static/List';
import Add from './static/Add';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/about/:id" element={<List />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
