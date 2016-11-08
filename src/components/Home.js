import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { login } from '../redux/application/actions';
import { getUsersAndAudios } from '../redux/application/actions';

const loginUser = (dispatch, method) => {
  dispatch(method());
};

const Home = (props) => {
  return (
    <div><Button bsStyle="primary" onClick={() => {
      loginUser(props.dispatch, login);
    }}
    >Login</Button><Button onClick={() => {
      loginUser(props.dispatch, getUsersAndAudios);
    }}
    >search</Button></div>
  );
};

Home.propTypes = {
  dispatch: React.PropTypes.func,
};

export default connect()(Home);
