import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { HomePage } from "./Pages/HomePage";
import { History } from "./Pages/History";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { ListTasks } from "./Pages/ListTasks";

import "./App.css";
import Header from "./Components/header/header";
import { Footer } from "./Components/footer/footer";

function App() {
    // const [isAuth, setIsAuth] = useState(false);

    // useEffect(() => {
    //   if (sessionStorage.getItem("token")) {
    //     setIsAuth(true);
    //     console.log("isAuth", isAuth);
    //     console.log("token", sessionStorage.getItem("token"));
    //   }
    // });

    return (
      <Router>
        <div className="App">
          <Header></Header>
          <div className="containerBloc">
            <Routes>
              <Route exact path="/" element={<HomePage />}></Route>
              <Route exact path="/history" element={<History />}></Route>
              <Route exact path="/listTasks" element={<ListTasks />}></Route>
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/register" element={<Register />}></Route>
            </Routes>
          </div>
          <Footer></Footer>
        </div>
      </Router>
    );
}
export default App;