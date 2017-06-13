import React from 'react';
import {
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Row,
  Col,
  Grid,
  Jumbotron,
} from 'react-bootstrap';
import { getLocale, getAvailableLocales } from '../config/config';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class Header extends React.Component {
  constructor() {
    super();
    this.navigate = this.navigate.bind(this);
    this.renderLocaleDropdown = this.renderLocaleDropdown.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderNavMenu = this.renderNavMenu.bind(this);
  }

  navigate(e, links) {
    if (typeof e === 'string') {
      let key = 0;
      links.forEach((link, index) => {
        if (link.name === this.props.pageName) {
          key = index;
        }
      });
      this.props.dispatch(push(`/${e}/${links[key].routeWithoutLang}`));
    } else {
      this.props.dispatch(push(links[e].route));
    }
  }

  renderNavMenu() {
    const links = [{
      name: 'home',
      localized: getLocale(this.props.language, 'navigation.home'),
      route: `/${this.props.language}`,
      routeWithoutLang: '',
    }, {
      name: 'app',
      localized: getLocale(this.props.language, 'navigation.app'),
      route: `/${this.props.language}/app`,
      routeWithoutLang: 'app',
    }];

    const revealActivePage = () => {
      let key = 0;
      links.forEach((link, index) => {
        if (link.name === this.props.pageName) {
          key = index;
        }
      });
      return key;
    };
    const menuItems = links.map((link, key) => {
      return <NavItem eventKey={key} key={key} title={link.localized}>{link.localized}</NavItem>;
    });
    return (
      <Row>
        <Col lg={6} lgPush={6} md={6} mdPush={6} sm={6} smPush={6} xs={10} xsPush={2}>
          <Nav justified pullRight bsStyle="pills" activeKey={revealActivePage()}
               onSelect={(e) => {
                 this.navigate(e, links);
               }}
          >
            {menuItems}
            {this.renderLocaleDropdown()}
          </Nav>
        </Col>
      </Row>
    );
  }

  renderLocaleDropdown() {
    const locales = getAvailableLocales().map((locale, key) => {
      return (
        <MenuItem eventKey={locale} key={key}>
          {getLocale(this.props.language, locale)}
        </MenuItem>);
    });
    return (
      <NavDropdown id="menu" title={getLocale(this.props.language, 'language')}>
        {locales}
      </NavDropdown>
    );
  }

  renderHeader() {
    return (
      <Row>
        <Col lg={6} lgPush={3} lgPull={3} md={8} mdPush={2}
          mdPull={2} sm={10} smPush={2} smPull={2} xs={12}
        >
          <h1>
            {getLocale(this.props.language, `${this.props.pageName}.header.title`)}
          </h1>
        </Col>
      </Row>
    );
  }

  renderContent() {
    if (!this.props.content) {
      return null;
    }
    return this.props.content.map((el, key) => {
      return (
          <p key={key}>
            {el}
          </p>);
    });
  }

  render() {
    return (
      <Grid>
        {this.renderNavMenu()}
        <Row>
          {this.renderHeader()}
          {this.renderContent()}
        </Row>
      </Grid>
    );
  }
}

Header.propTypes = {
  language: React.PropTypes.string,
  pageName: React.PropTypes.string,
  content: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

export default connect(state => {
  return {
    language: state.application.language,
  };
})(Header);
