'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$2 = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\n.test-component {\n  background-color: var(--background);\n  color: var(--font-color);\n  border: 1px solid #131111;\n  padding: 16px;\n  width: 360px;\n  text-align: center; }\n  .test-component .heading {\n    font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n    font-size: 40px;\n    font-weight: bold; }\n";
styleInject(css_248z$2);

// import { setChainDriver } from "../../blockin";
// import { AlgoDriver } from "../../ChainDrivers/AlgoDriver";
var TestComponent = function (_a) {
    var heading = _a.heading, content = _a.content;
    var _b = React.useState(''), testing = _b[0]; _b[1];
    return React__default["default"].createElement("div", { "data-testid": "test-component", className: "test-component" },
        React__default["default"].createElement("h1", { "data-testid": "test-component__heading", className: "heading" },
            heading,
            testing),
        React__default["default"].createElement("div", { "data-testid": "test-component__content" }, content));
};

var css_248z$1 = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\n.foo-bar {\n  font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n  color: #005f20; }\n";
styleInject(css_248z$1);

// Generated with util/create-component.js
var SignInWithBlockinButton = function (_a) {
    var foo = _a.foo;
    return (React__default["default"].createElement("div", { "data-testid": "SignInWithBlockinButton", className: "foo-bar" }, foo));
};

var css_248z = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\n.foo-bar {\n  font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n  color: #005f20; }\n";
styleInject(css_248z);

// Generated with util/create-component.js
var ChainSelect = function (_a) {
    var foo = _a.foo;
    return (React__default["default"].createElement("div", { "data-testid": "ChainSelect", className: "foo-bar" }, foo));
};

exports.ChainSelect = ChainSelect;
exports.SignInWithBlockinButton = SignInWithBlockinButton;
exports.TestComponent = TestComponent;
//# sourceMappingURL=index.js.map
