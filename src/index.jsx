
import 'console-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Warp from './warp';

const rootEl = document.getElementById('root');

ReactDOM.render(
  (<AppContainer><Warp /></AppContainer>), rootEl
);

if (module.hot) {
  module.hot.accept('./warp', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./warp').default;

    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootEl
    );
  });
}
