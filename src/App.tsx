import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import List from './server/static/List';
import Add from './server/static/Add';

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
