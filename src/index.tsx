/* eslint-disable no-use-before-define */
import React from 'react';
/* eslint-enable no-use-before-define */
import ReactDOM from 'react-dom';
import './assets/css/fonts.css';
import './assets/css/index.css';
import Main from './main';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Main />, document.getElementById('root'));
serviceWorker.unregister();
