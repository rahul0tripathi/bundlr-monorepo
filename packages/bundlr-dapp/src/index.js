import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {MoralisProvider} from "react-moralis";
import * as config from './config/index'

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={config.default.MORALIS.API_KEY} serverUrl={config.default.MORALIS.SERVER_URL}>
      <App/>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
