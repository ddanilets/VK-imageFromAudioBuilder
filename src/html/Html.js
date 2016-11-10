import React from 'react';
import serialize from 'serialize-javascript';
import ReactDOM from 'react-dom/server';

const isLocal = process.env.NODE_ENV === 'development';

function renderJsFiles() {
  const res = [];
  if (isLocal) {
    res.push('../build/js/main.js');
  } else {
    res.push('../build/js/vendor.bundle.js');
    res.push('../build/js/main.min.js');
  }
  return res;
}

const Html = (props) => {
  const content = props.component ? ReactDOM.renderToString(props.component) : '';
  const state = props.store.getState();
  return (<html>
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
    </head>
    <body>
      <div dangerouslySetInnerHTML={{ __html: content }} id="app" />
      <script src="https://vk.com/js/api/openapi.js?136" type="text/javascript"></script>
      <script type="text/javascript"
        dangerouslySetInnerHTML={{ __html: 'VK.init({apiId: 5717440 });' }}
      />
      <script dangerouslySetInnerHTML={{ __html: `window.App=${serialize(state)};` }} />
      {renderJsFiles().map((file, key) => {
        return <script key={key} type="text/javascript" src={file} />;
      })}
    </body>
  </html>);
};

Html.propTypes = {
  component: React.PropTypes.object,
  store: React.PropTypes.object,
};

export default Html;
