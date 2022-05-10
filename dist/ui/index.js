'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

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

/**
 * Parses a JSON object that specifies the challenge fields and returns a well-formatted EIP-4361 string.
 * Note that there is no validity checks on the inputs. It is a precondition that it is well-formed.
 * @param challenge - Well-formatted JSON object specifying the EIP-4361 fields.
 * @returns - Well-formatted EIP-4361 challenge string to be signed.
 */
function constructChallengeStringFromChallengeObject(challenge) {
    var message = "";
    message += "".concat(challenge.domain, " wants you to sign in with your Algorand account:\n");
    message += "".concat(challenge.address, "\n\n");
    if (challenge.statement) {
        message += "".concat(challenge.statement, "\n");
    }
    message += "\n";
    message += "URI: ".concat(challenge.uri, "\n");
    message += "Version: ".concat(challenge.version, "\n");
    message += "Chain ID: ".concat(challenge.chainId, "\n");
    message += "Nonce: ".concat(challenge.nonce, "\n");
    message += "Issued At: ".concat(challenge.issuedAt);
    if (challenge.expirationDate) {
        message += "\nExpiration Time: ".concat(challenge.expirationDate);
    }
    if (challenge.notBefore) {
        message += "\nNot Before: ".concat(challenge.notBefore, "\n");
    }
    if (challenge.resources) {
        message += "\nResources:";
        for (var _i = 0, _a = challenge.resources; _i < _a.length; _i++) {
            var resource = _a[_i];
            message += "\n- ".concat(resource);
        }
    }
    return message;
}

// import { setChainDriver } from "../../blockin";
// import { AlgoDriver } from "../../ChainDrivers/AlgoDriver";
var TestComponent = function (_a) {
    var heading = _a.heading, content = _a.content;
    var _b = React.useState(''), testing = _b[0], setTesting = _b[1];
    var handleCreateChallenge = function () { return __awaiter(void 0, void 0, void 0, function () {
        var c;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, constructChallengeStringFromChallengeObject({ domain: 'https://blockin.edu', statement: 'asfad', address: 'A3KW6EZITJQTIHIVZUMN2BVG7DBKEBSGEJBIGEXQ4CPBQV6XAUQKZ5RRWA', uri: 'https://blockin.edu', nonce: '123', version: '1', chainId: 'ALL', issuedAt: new Date().toISOString() })];
                case 1:
                    c = _a.sent();
                    setTesting(c);
                    return [2 /*return*/];
            }
        });
    }); };
    return React__default["default"].createElement("div", { "data-testid": "test-component", className: "test-component" },
        React__default["default"].createElement("h1", { "data-testid": "test-component__heading", className: "heading" },
            heading,
            testing,
            React__default["default"].createElement("button", { onClick: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, handleCreateChallenge()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); } }, "Click 4 Challenge")),
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
