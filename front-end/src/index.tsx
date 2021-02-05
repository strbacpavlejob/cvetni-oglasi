import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './components/HomePage/HomePage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap.min.js';
import {HashRouter, Route} from 'react-router-dom'
import Switch from 'react-bootstrap/esm/Switch';
import LoginPage from './components/LoginPage/LoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import FlowerPage from './components/FlowerPage/FlowerPage';
import UserFlowerPage from './components/UserFlowerPage/UserFlowerPage';
import { LogoutPage } from './components/LogoutPage/LogoutPage';
import UserDashboardFlower from './components/UserDashboardFlower/UserDashboardFlower';
import DashboardPicture from './components/DashboardPicture/DashboardPicture';


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/category/:cId" component={ CategoryPage } />
        <Route exact path="/login/" component={LoginPage}/>
        <Route exact path="/logout/" component={LogoutPage}/>
        <Route path="/register" component={ RegistrationPage } /> 
        <Route path="/floweruser/:uId" component={ UserFlowerPage } />        
        <Route path="/flower/:fId" component={ FlowerPage } />  
        <Route path="/dashboard/" component={ UserDashboardFlower } />
        <Route path="/dashboard/picture/:fId" component={ DashboardPicture } />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
