import 'react-toolbox/lib/commons.scss';

import React from 'react';
import { Provider } from 'react-tunnel';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';

const history = hashHistory;


/**
 * <Provider> uses the React context to  ensure stuff is passed
 * all the way down the chain to child nodes. 
 */
import s3State from './store/s3State';
import aws from './aws/AWS';

render(
 <Router history={history} routes={routes} >
 </Router>, document.getElementById('root')
);
