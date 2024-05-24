import "./App.css";
import Record from "./component/Record";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Record />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
