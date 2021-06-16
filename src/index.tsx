import './setupFirebase';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './components/App';
import { ProvideAuth } from './hooks/useAuth';
import { ProvideDrawer } from './hooks/useDrawer';
import { ProvideMedia } from './hooks/useMedia';
import reportWebVitals from './reportWebVitals';
import { initializeTheme, ProvideTheme } from './hooks/useTheme';

// apply the preferred theme immediately on boot to avoid FOUC
initializeTheme();

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <ProvideAuth>
        <ProvideMedia>
          <ProvideTheme>
            <ProvideDrawer>
              <Router>
                <App />
              </Router>
            </ProvideDrawer>
          </ProvideTheme>
        </ProvideMedia>
      </ProvideAuth>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
