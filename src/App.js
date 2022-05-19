import React from "react";
import { Routes, Route } from "react-router-dom";

import Heading from "./Component/Heading";
import Home from "./Component/Home";
import Profile from "./Component/Profile";
import Mint from "./Component/mintKlaytn";
import Login from "./Component/Login";

function App() {
  return (
    <>
      <Heading />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mint" element={<Mint />} />
      </Routes>
    </>
  );
}

export default App;
