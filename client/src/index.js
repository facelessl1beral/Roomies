import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

window.process = { env: { NODE_ENV: 'development' } };

ReactDOM.render(<App />, document.getElementById('root'));
