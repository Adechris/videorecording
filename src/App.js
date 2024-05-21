import "./App.css";
import Record from "./component/Record";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<div className="container">Welcome To The Home Page</div>}
        />
        <Route path="/record" element={<Record />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
