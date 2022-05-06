"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAssetOptInTxn = createAssetOptInTxn;
exports.createAssetTransferTxn = createAssetTransferTxn;
exports.createAssetTxn = createAssetTxn;
exports.initializeAuth = initializeAuth;
exports.sendTxn = sendTxn;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// This file handles creating, opting in to, and transfering an auth asset from resource to owner
var chainDriver;

function initializeAuth(driver) {
  chainDriver = driver;
}
/**
 * Generates an unsigned asset creation transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset creation transaction
 */


function createAssetTxn(_x) {
  return _createAssetTxn.apply(this, arguments);
}
/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset opt-in transaction
 */


function _createAssetTxn() {
  _createAssetTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(createAssetParams) {
    var from, _createAssetParams$to, to, _createAssetParams$as, assetName, _createAssetParams$as2, assetURL, _createAssetParams$no, note, _createAssetParams$am, amount, _createAssetParams$un, unitName, _createAssetParams$de, decimals, _createAssetParams$to2, total, _createAssetParams$as3, assetMetadata, _createAssetParams$ex, extras;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = createAssetParams.from, _createAssetParams$to = createAssetParams.to, to = _createAssetParams$to === void 0 ? 'Blockin' : _createAssetParams$to, _createAssetParams$as = createAssetParams.assetName, assetName = _createAssetParams$as === void 0 ? 'Blockin Access Token' : _createAssetParams$as, _createAssetParams$as2 = createAssetParams.assetURL, assetURL = _createAssetParams$as2 === void 0 ? '' : _createAssetParams$as2, _createAssetParams$no = createAssetParams.note, note = _createAssetParams$no === void 0 ? 'This is an access token created with Blockin' : _createAssetParams$no, _createAssetParams$am = createAssetParams.amount, amount = _createAssetParams$am === void 0 ? 1 : _createAssetParams$am, _createAssetParams$un = createAssetParams.unitName, unitName = _createAssetParams$un === void 0 ? '' : _createAssetParams$un, _createAssetParams$de = createAssetParams.decimals, decimals = _createAssetParams$de === void 0 ? 0 : _createAssetParams$de, _createAssetParams$to2 = createAssetParams.total, total = _createAssetParams$to2 === void 0 ? 1 : _createAssetParams$to2, _createAssetParams$as3 = createAssetParams.assetMetadata, assetMetadata = _createAssetParams$as3 === void 0 ? '' : _createAssetParams$as3, _createAssetParams$ex = createAssetParams.extras, extras = _createAssetParams$ex === void 0 ? undefined : _createAssetParams$ex;
            _context.next = 3;
            return chainDriver.makeAssetTxn(_objectSpread({
              from: from,
              to: to,
              assetName: assetName,
              assetURL: assetURL,
              note: note,
              amount: amount,
              unitName: unitName,
              decimals: decimals,
              total: total,
              assetMetadata: assetMetadata
            }, extras));

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createAssetTxn.apply(this, arguments);
}

function createAssetOptInTxn(_x2) {
  return _createAssetOptInTxn.apply(this, arguments);
}
/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset transfer transaction
 */


function _createAssetOptInTxn() {
  _createAssetOptInTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(optInAssetParams) {
    var to, _optInAssetParams$fro, from, assetIndex, _optInAssetParams$ext, extras;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            to = optInAssetParams.to, _optInAssetParams$fro = optInAssetParams.from, from = _optInAssetParams$fro === void 0 ? to : _optInAssetParams$fro, assetIndex = optInAssetParams.assetIndex, _optInAssetParams$ext = optInAssetParams.extras, extras = _optInAssetParams$ext === void 0 ? undefined : _optInAssetParams$ext;
            _context2.next = 3;
            return chainDriver.makeAssetOptInTxn(_objectSpread({
              to: to,
              from: from,
              assetIndex: assetIndex
            }, extras));

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _createAssetOptInTxn.apply(this, arguments);
}

function createAssetTransferTxn(_x3) {
  return _createAssetTransferTxn.apply(this, arguments);
}

function _createAssetTransferTxn() {
  _createAssetTransferTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(transferAssetParams) {
    var to, from, assetIndex, _transferAssetParams$, extras;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            to = transferAssetParams.to, from = transferAssetParams.from, assetIndex = transferAssetParams.assetIndex, _transferAssetParams$ = transferAssetParams.extras, extras = _transferAssetParams$ === void 0 ? undefined : _transferAssetParams$;
            _context3.next = 3;
            return chainDriver.makeAssetTransferTxn(_objectSpread({
              to: to,
              from: from,
              assetIndex: assetIndex
            }, extras));

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _createAssetTransferTxn.apply(this, arguments);
}

function sendTxn(_x4, _x5) {
  return _sendTxn.apply(this, arguments);
}

function _sendTxn() {
  _sendTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(stx, txnId) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return chainDriver.sendTxn(stx, txnId);

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _sendTxn.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjaGFpbkRyaXZlciIsImluaXRpYWxpemVBdXRoIiwiZHJpdmVyIiwiY3JlYXRlQXNzZXRUeG4iLCJjcmVhdGVBc3NldFBhcmFtcyIsImZyb20iLCJ0byIsImFzc2V0TmFtZSIsImFzc2V0VVJMIiwibm90ZSIsImFtb3VudCIsInVuaXROYW1lIiwiZGVjaW1hbHMiLCJ0b3RhbCIsImFzc2V0TWV0YWRhdGEiLCJleHRyYXMiLCJ1bmRlZmluZWQiLCJtYWtlQXNzZXRUeG4iLCJjcmVhdGVBc3NldE9wdEluVHhuIiwib3B0SW5Bc3NldFBhcmFtcyIsImFzc2V0SW5kZXgiLCJtYWtlQXNzZXRPcHRJblR4biIsImNyZWF0ZUFzc2V0VHJhbnNmZXJUeG4iLCJ0cmFuc2ZlckFzc2V0UGFyYW1zIiwibWFrZUFzc2V0VHJhbnNmZXJUeG4iLCJzZW5kVHhuIiwic3R4IiwidHhuSWQiXSwic291cmNlcyI6WyIuLi9zcmMvYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaGFuZGxlcyBjcmVhdGluZywgb3B0aW5nIGluIHRvLCBhbmQgdHJhbnNmZXJpbmcgYW4gYXV0aCBhc3NldCBmcm9tIHJlc291cmNlIHRvIG93bmVyXHJcbmltcG9ydCB7IElDaGFpbkRyaXZlciwgVW5pdmVyc2FsVHhuIH0gZnJvbSAnLi9AdHlwZXMvQ2hhaW5Ecml2ZXInXHJcbmltcG9ydCB7IENyZWF0ZUFzc2V0UGFyYW1zLCBDcmVhdGVPcHRJbkFzc2V0UGFyYW1zLCBDcmVhdGVUcmFuc2ZlckFzc2V0UGFyYW1zIH0gZnJvbSBcIi4vQHR5cGVzL2F1dGhcIjtcclxuXHJcbnZhciBjaGFpbkRyaXZlcjogSUNoYWluRHJpdmVyXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUF1dGgoZHJpdmVyOiBJQ2hhaW5Ecml2ZXIpIHtcclxuICAgIGNoYWluRHJpdmVyID0gZHJpdmVyXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYW4gdW5zaWduZWQgYXNzZXQgY3JlYXRpb24gdHJhbnNhY3Rpb24sIHRvIGJlIHNpZ25lZCBhbmQgc2VudCB0byB0aGUgYWxnb3JhbmQgbmV0d29ya1xyXG4gKiBAcmV0dXJucyBhbiB1bnNpZ25lZCBhc3NldCBjcmVhdGlvbiB0cmFuc2FjdGlvblxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFzc2V0VHhuKGNyZWF0ZUFzc2V0UGFyYW1zOiBDcmVhdGVBc3NldFBhcmFtcyk6IFByb21pc2U8VW5pdmVyc2FsVHhuPiB7XHJcbiAgICBjb25zdCB7IFxyXG4gICAgICAgIGZyb20sXHJcbiAgICAgICAgdG8gPSAnQmxvY2tpbicsXHJcbiAgICAgICAgYXNzZXROYW1lID0gJ0Jsb2NraW4gQWNjZXNzIFRva2VuJyxcclxuICAgICAgICBhc3NldFVSTCA9ICcnLFxyXG4gICAgICAgIG5vdGUgPSAnVGhpcyBpcyBhbiBhY2Nlc3MgdG9rZW4gY3JlYXRlZCB3aXRoIEJsb2NraW4nLFxyXG4gICAgICAgIGFtb3VudCA9IDEsXHJcbiAgICAgICAgdW5pdE5hbWUgPSAnJyxcclxuICAgICAgICBkZWNpbWFscyA9IDAsXHJcbiAgICAgICAgdG90YWwgPSAxLFxyXG4gICAgICAgIGFzc2V0TWV0YWRhdGEgPSAnJyxcclxuICAgICAgICBleHRyYXMgPSB1bmRlZmluZWRcclxuICAgIH0gPSBjcmVhdGVBc3NldFBhcmFtc1xyXG5cclxuICAgIHJldHVybiBhd2FpdCBjaGFpbkRyaXZlci5tYWtlQXNzZXRUeG4oe1xyXG4gICAgICAgIGZyb20sXHJcbiAgICAgICAgdG8sIFxyXG4gICAgICAgIGFzc2V0TmFtZSxcclxuICAgICAgICBhc3NldFVSTCxcclxuICAgICAgICBub3RlLFxyXG4gICAgICAgIGFtb3VudCxcclxuICAgICAgICB1bml0TmFtZSwgXHJcbiAgICAgICAgZGVjaW1hbHMsXHJcbiAgICAgICAgdG90YWwsIFxyXG4gICAgICAgIGFzc2V0TWV0YWRhdGEsXHJcbiAgICAgICAgLi4uZXh0cmFzXHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhbiB1bnNpZ25lZCBhc3NldCBvcHQtaW4gdHJhbnNhY3Rpb24sIHRvIGJlIHNpZ25lZCBhbmQgc2VudCB0byB0aGUgYWxnb3JhbmQgbmV0d29ya1xyXG4gKiBAcmV0dXJucyBhbiB1bnNpZ25lZCBhc3NldCBvcHQtaW4gdHJhbnNhY3Rpb25cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVBc3NldE9wdEluVHhuKG9wdEluQXNzZXRQYXJhbXM6IENyZWF0ZU9wdEluQXNzZXRQYXJhbXMpOiBQcm9taXNlPFVuaXZlcnNhbFR4bj4ge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICAgIHRvLFxyXG4gICAgICAgIGZyb20gPSB0byxcclxuICAgICAgICBhc3NldEluZGV4LFxyXG4gICAgICAgIGV4dHJhcyA9IHVuZGVmaW5lZFxyXG4gICAgfSA9IG9wdEluQXNzZXRQYXJhbXNcclxuXHJcbiAgICByZXR1cm4gYXdhaXQgY2hhaW5Ecml2ZXIubWFrZUFzc2V0T3B0SW5UeG4oe1xyXG4gICAgICAgIHRvLFxyXG4gICAgICAgIGZyb20sXHJcbiAgICAgICAgYXNzZXRJbmRleCxcclxuICAgICAgICAuLi5leHRyYXNcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGFuIHVuc2lnbmVkIGFzc2V0IHRyYW5zZmVyIHRyYW5zYWN0aW9uLCB0byBiZSBzaWduZWQgYW5kIHNlbnQgdG8gdGhlIGFsZ29yYW5kIG5ldHdvcmtcclxuICogQHJldHVybnMgYW4gdW5zaWduZWQgYXNzZXQgdHJhbnNmZXIgdHJhbnNhY3Rpb25cclxuICovXHJcbiBleHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXNzZXRUcmFuc2ZlclR4bih0cmFuc2ZlckFzc2V0UGFyYW1zOiBDcmVhdGVUcmFuc2ZlckFzc2V0UGFyYW1zKTogUHJvbWlzZTxVbml2ZXJzYWxUeG4+IHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgICB0byxcclxuICAgICAgICBmcm9tLFxyXG4gICAgICAgIGFzc2V0SW5kZXgsXHJcbiAgICAgICAgZXh0cmFzID0gdW5kZWZpbmVkXHJcbiAgICB9ID0gdHJhbnNmZXJBc3NldFBhcmFtc1xyXG4gICAgXHJcbiAgICByZXR1cm4gYXdhaXQgY2hhaW5Ecml2ZXIubWFrZUFzc2V0VHJhbnNmZXJUeG4oe1xyXG4gICAgICAgIHRvLFxyXG4gICAgICAgIGZyb20sXHJcbiAgICAgICAgYXNzZXRJbmRleCxcclxuICAgICAgICAuLi5leHRyYXNcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFR4bihzdHg6IFVpbnQ4QXJyYXkgfCBVaW50OEFycmF5W10sIHR4bklkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBhd2FpdCBjaGFpbkRyaXZlci5zZW5kVHhuKHN0eCwgdHhuSWQpXHJcbn1cclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUlBLElBQUlBLFdBQUo7O0FBRU8sU0FBU0MsY0FBVCxDQUF3QkMsTUFBeEIsRUFBOEM7RUFDakRGLFdBQVcsR0FBR0UsTUFBZDtBQUNIO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7OztTQUNzQkMsYzs7O0FBOEJ0QjtBQUNBO0FBQ0E7QUFDQTs7Ozs0RUFqQ08saUJBQThCQyxpQkFBOUI7SUFBQTs7SUFBQTtNQUFBO1FBQUE7VUFBQTtZQUVDQyxJQUZELEdBYUNELGlCQWJELENBRUNDLElBRkQsMEJBYUNELGlCQWJELENBR0NFLEVBSEQsRUFHQ0EsRUFIRCxzQ0FHTSxTQUhOLGtEQWFDRixpQkFiRCxDQUlDRyxTQUpELEVBSUNBLFNBSkQsc0NBSWEsc0JBSmIsbURBYUNILGlCQWJELENBS0NJLFFBTEQsRUFLQ0EsUUFMRCx1Q0FLWSxFQUxaLG1EQWFDSixpQkFiRCxDQU1DSyxJQU5ELEVBTUNBLElBTkQsc0NBTVEsOENBTlIsa0RBYUNMLGlCQWJELENBT0NNLE1BUEQsRUFPQ0EsTUFQRCxzQ0FPVSxDQVBWLGtEQWFDTixpQkFi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