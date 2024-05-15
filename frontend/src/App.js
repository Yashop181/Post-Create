import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import CreatePost from "./CreatePost";
import Home from "./Home";
import "./Navbar.css"; // Import the CSS file for styling

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar"> {/* Added the "navbar" class */}
          <ul>
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/create" className="nav-link">Create Post</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
