import React from 'react';
import Header from './components/Header';
import { getHeaders } from './config/config';
import { connect } from 'react-redux';

const App = (props) => {
  const headerContent = [];
  const headers = getHeaders(props.language, props.children.props.route.name);
  for (const el in headers) {
    if (headers.hasOwnProperty(el)) {
      headerContent.push(headers[el]);
    }
  }
  return (
    <div>
      <Header pageName={props.children.props.route.name} content={headerContent} />
    {props.children}
    </div>);
};

App.propTypes = {
  children: React.PropTypes.object,
  route: React.PropTypes.object,
  language: React.PropTypes.string,
};

export default connect(state => {
  return {
    language: state.application.language,
  };
})(App);
