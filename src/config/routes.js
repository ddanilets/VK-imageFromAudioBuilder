import React from 'react';
import { Route } from 'react-router';
import App from '../App.js';
import Home from '../components/Home.js';
import _404 from '../components/_404.js';
import { availableLocales } from './config';
import { changeLanguage } from '../redux/application/actions';

const checkLanguage = (dispatch, nextState, replace) => {
  const testResult = availableLocales(nextState.params.language);
  if (testResult.contains) {
    if (testResult.locale === nextState.params.language) {
      dispatch(changeLanguage(testResult.locale));
      return null;
    }
    dispatch(changeLanguage(testResult.locale));
    replace(`/${testResult.locale}`);
  } else {
    dispatch(changeLanguage('en'));
    replace('/en');
  }
  return null;
};

const routes = (store) => {
  return (
    <Route path="/" component={App}>
      <Route name="home" path=":language" component={Home} onEnter={(nextState, replace) => {
        checkLanguage(store.dispatch, nextState, replace);
      }}
      />
      <Route name="app" path=":language/app" component={Home} onEnter={(nextState, replace) => {
        checkLanguage(store.dispatch, nextState, replace);
      }}
      />
      <Route path="*" component={_404} />
    </Route>);
};
export default routes;
