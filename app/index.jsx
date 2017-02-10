require("babel-register");
import 'react-toolbox/lib/commons.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';

const history = hashHistory;

import s3State from './store/s3State';

window.onload = function () {
  ReactDOM.render(
    <Router history={history} routes={routes} >
    </Router>, document.getElementById('root')
  );
}
