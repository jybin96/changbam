import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingPage from './Components/View/LandingPage/LandingPage';
import LandingPage2 from './Components/View/LandingPage/LandingPage2';
import Signup from './Components/View/Signup/Signup';
import Login from './Components/View/Login/Login';
import './App.css';
import After from "./Components/View/After/After";
import Message from './Components/message/message';
import Message2 from './Components/message/message2';
import Messagerow from './Components/message/messagerow';
import Messagerow2 from './Components/message/mesagerow2';
export default class App extends Component {
  render() {
    return (
      <Router>
        <div >
          <Switch>
          <Route exact path="/main">
              <LandingPage />
            </Route>
            <Route exact path="/main2">
              <LandingPage2 />
            </Route>
            <Route exact path="/">
              <Message />
            </Route>
            <Route exact path="/2">
              <Message2 />
            </Route>
            <Route exact path="/3">
              <Messagerow />
            </Route>
            <Route exact path="/4">
              <Messagerow2 />
            </Route>
            <Route path="/Login">
              <Login />
            </Route>
            <Route path="/Signup">
              <Signup />
            </Route>
            <Route path="/After">
              <After/>
            </Route>
          </Switch>
        </div>
        </Router>
    );
  }
}
