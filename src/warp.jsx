/**
 * Created by dz on 16/9/27.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './model/reducer';
import App from './app';

const store = createStore(rootReducer, compose(applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f)
);

const Warp = () => <Provider store={store}><App /></Provider>;
export default Warp;
