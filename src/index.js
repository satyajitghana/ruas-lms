import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Container, Navbar, Col, Row } from 'react-bootstrap';

ReactDOM.render(
  <React.StrictMode>
    <link
      rel="stylesheet"
      href="https://bootswatch.com/4/superhero/bootstrap.min.css"
      crossorigin="anonymous"
    />
    <link
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"
      crossorigin="anonymous"
    />

    <div>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
