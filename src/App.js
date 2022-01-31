import React from "react";
import "./App.css";
import Header from "./components/Header";
import Aside from "./components/Aside";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Router } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { createBrowserHistory } from "history";

const App = () => {
  const newHistory = createBrowserHistory();

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <Aside />
        <Router history={newHistory}>
          <Route exact path="/" component={HomePage} />
          <Route path="/dashboard" component={DashboardPage} />
        </Router>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
