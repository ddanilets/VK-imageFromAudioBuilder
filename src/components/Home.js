import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { postUrl } from '../redux/application/actions';

function decimalAdjust(type, value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

class Home extends React.Component {
  constructor() {
    super();
    this.postImgUrl = this.postImgUrl.bind(this);
  }

  postImgUrl() {
    this.props.dispatch(postUrl(this.refs.input.value));
  }

  render() {
    const genres = this.props.genres.map((el, key) => {
      return <li key={key}>{el.genre} - {decimalAdjust('round', el.value * 100, -2)}%</li>;
    });

    return (
      <div>
        <Button onClick={this.postImgUrl}>send</Button>
        <input type="text" ref="input" />
        <ul>{genres}</ul>
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: React.PropTypes.func,
  genres: React.PropTypes.array,
};

export default connect(state => {
  return {
    genres: state.application.genres,
  };
})(Home);
