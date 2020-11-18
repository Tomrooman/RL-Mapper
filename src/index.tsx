/* eslint-disable no-use-before-define */
import React from 'react';
/* eslint-enable no-use-before-define */
import ReactDOM from 'react-dom';
import './assets/css/fonts.css';
import './assets/css/index.css';
import Master from './components/master';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Master />, document.getElementById('root'));
serviceWorker.unregister();
