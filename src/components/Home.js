import React from 'react';
import { connect } from 'react-redux';
import { Button, FormControl } from 'react-bootstrap';
import { postUrl } from '../redux/application/actions';

function decimalAdjust(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }
  let newValue = +value;
  const newExp = +exp;
  if (isNaN(newValue) || !(typeof newExp === 'number' && newExp % 1 === 0)) {
    return NaN;
  }
  newValue = newValue.toString().split('e');
  newValue = Math.round(+(`${newValue[0]}e${(newValue[1] ? (+newValue[1] - newExp) : -newExp)}`))
    .toString().split('e');
  return +(`${newValue[0]}e${(newValue[1] ? (+newValue[1] + newExp) : newExp)}`);
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
      return <li key={key}>{el.genre} - {decimalAdjust(el.value * 100, -2)}%</li>;
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
