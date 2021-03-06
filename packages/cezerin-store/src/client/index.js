import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { initOnClient } from '@aowlsprit/cezerin-theme';
import clientSettings from './settings';
import reducers from '../shared/reducers';
import * as analytics from '../shared/analytics';
import App from '../shared/app';
import api from './api';

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__APP_STATE__;
// eslint-disable-next-line no-underscore-dangle
const themeText = window.__APP_TEXT__;

initOnClient({
  themeSettings: initialState.app.themeSettings,
  text: themeText,
  language: clientSettings.language,
  api
});

const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);

analytics.onPageLoad({ state: initialState });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('SW registered.');
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
