import React from 'react';
import Home from './pages/home'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard';
import Logout from './pages/logout';
import Signin from './pages/login';
import SearchShop from './pages/searchShop';
import ShopDetails from './pages/shopDetails';

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {

 
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>

        <Route path="/sign_up/:type/:package" children={<Signup/>} />
        <Route exact path='/account/:type'>
          <Dashboard/>
        </Route>
        <Route exact path='/account/:type/:id'>
          <Dashboard/>
        </Route>

        <Route path="/logout">
          <Logout/>
        </Route>
        <Route path="/search/:query/:lat/:lng/:address" children={<SearchShop/>}/>
        <Route exact path='/sign_in'>
          <Signin/>
        </Route>
        <Route exact path="/sign_in/:link" children={<Signin/>} />

        <Route path="/shopDetails/:id" children={<ShopDetails/>}/>
        
      </Switch>
    </Router>
  );
  }
 

export default App;

