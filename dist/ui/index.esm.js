import React from 'react';

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

var css_248z = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\n.test-component {\n  background-color: var(--background);\n  color: var(--font-color);\n  border: 1px solid #131111;\n  padding: 16px;\n  width: 360px;\n  text-align: center; }\n  .test-component .heading {\n    font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n    font-size: 40px;\n    font-weight: bold; }\n";
styleInject(css_248z);

var TestComponent = function (_a) {
    var heading = _a.heading, content = _a.content;
    return (React.createElement("div", { "data-testid": "test-component", className: "test-component" },
        React.createElement("h1", { "data-testid": "test-component__heading", className: "heading" }, heading),
        React.createElement("div", { "data-testid": "test-component__content" }, content)));
};

export { TestComponent };
//# sourceMappingURL=index.esm.js.map
