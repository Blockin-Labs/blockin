"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setChainDriver = setChainDriver;
exports.sha256 = sha256;

var _auth = require("./auth");

var _verify = require("./verify");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function setChainDriver(driver) {
  (0, _verify.initializeVerify)(driver);
  (0, _auth.initializeAuth)(driver);
}

function sha256(_x) {
  return _sha.apply(this, arguments);
}

function _sha() {
  _sha = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {
    var msgBuffer, hashBuffer, hashArray;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // encode as UTF-8
            msgBuffer = new TextEncoder().encode(message); // hash the message

            _context.next = 3;
            return crypto.subtle.digest('SHA-256', msgBuffer);

          case 3:
            hashBuffer = _context.sent;
            // convert ArrayBuffer to Array
            hashArray = new Uint8Array(hashBuffer);
            return _context.abrupt("return", hashArray);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sha.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzZXRDaGFpbkRyaXZlciIsImRyaXZlciIsInNoYTI1NiIsIm1lc3NhZ2UiLCJtc2dCdWZmZXIiLCJUZXh0RW5jb2RlciIsImVuY29kZSIsImNyeXB0byIsInN1YnRsZSIsImRpZ2VzdCIsImhhc2hCdWZmZXIiLCJoYXNoQXJyYXkiLCJVaW50OEFycmF5Il0sInNvdXJjZXMiOlsiLi4vc3JjL2Jsb2NraW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNoYWluRHJpdmVyIH0gZnJvbSBcIi4vQHR5cGVzL0NoYWluRHJpdmVyXCI7XHJcbmltcG9ydCB7IGluaXRpYWxpemVBdXRoIH0gZnJvbSBcIi4vYXV0aFwiO1xyXG5pbXBvcnQgeyBpbml0aWFsaXplVmVyaWZ5IH0gZnJvbSBcIi4vdmVyaWZ5XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2hhaW5Ecml2ZXIoZHJpdmVyOiBJQ2hhaW5Ecml2ZXIpIHtcclxuICAgIGluaXRpYWxpemVWZXJpZnkoZHJpdmVyKVxyXG4gICAgaW5pdGlhbGl6ZUF1dGgoZHJpdmVyKVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hhMjU2KG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8VWludDhBcnJheT4ge1xyXG4gICAgLy8gZW5jb2RlIGFzIFVURi04XHJcbiAgICBjb25zdCBtc2dCdWZmZXIgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUobWVzc2FnZSk7ICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAvLyBoYXNoIHRoZSBtZXNzYWdlXHJcbiAgICBjb25zdCBoYXNoQnVmZmVyID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBtc2dCdWZmZXIpO1xyXG5cclxuICAgIC8vIGNvbnZlcnQgQXJyYXlCdWZmZXIgdG8gQXJyYXlcclxuICAgIGNvbnN0IGhhc2hBcnJheSA9IG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpO1xyXG5cclxuICAgIHJldHVybiBoYXNoQXJyYXlcclxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sU0FBU0EsY0FBVCxDQUF3QkMsTUFBeEIsRUFBOEM7RUFDakQsOEJBQWlCQSxNQUFqQjtFQUNBLDBCQUFlQSxNQUFmO0FBQ0g7O1NBRXFCQyxNOzs7OztpRUFBZixpQkFBc0JDLE9BQXRCO0lBQUE7SUFBQTtNQUFBO1FBQUE7VUFBQTtZQUNIO1lBQ01DLFNBRkgsR0FFZSxJQUFJQyxXQUFKLEdBQWtCQyxNQUFsQixDQUF5QkgsT0FBekIsQ0FGZixFQUlIOztZQUpHO1lBQUEsT0FLc0JJLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjQyxNQUFkLENBQXFCLFNBQXJCLEVBQWdDTCxTQUFoQyxDQUx0Qjs7VUFBQTtZQUtHTSxVQUxIO1lBT0g7WUFDTUMsU0FSSCxHQVFlLElBQUlDLFVBQUosQ0FBZUYsVUFBZixDQVJmO1lBQUEsaUNBVUlDLFNBVko7O1VBQUE7VUFBQTtZQUFBO1FBQUE7TUFBQTtJQUFBO0VBQUEsQyJ9