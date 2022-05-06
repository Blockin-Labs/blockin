"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlgoDriver = void 0;

var _algosdk = _interopRequireWildcard(require("algosdk"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AlgoDriver = /*#__PURE__*/function () {
  function AlgoDriver(API_KEY) {
    _classCallCheck(this, AlgoDriver);

    _defineProperty(this, "server", "https://testnet-algorand.api.purestake.io/ps2");

    _defineProperty(this, "indexerServer", "https://testnet-algorand.api.purestake.io/idx2");

    _defineProperty(this, "port", "");

    _defineProperty(this, "token", {});

    _defineProperty(this, "client", void 0);

    _defineProperty(this, "indexer", void 0);

    this.token = {
      "x-api-key": API_KEY ? API_KEY : ''
    };
    this.client = new _algosdk.default.Algodv2(this.token, this.server, this.port);
    this.indexer = new _algosdk.default.Indexer(this.token, this.indexerServer, this.port);
  }

  _createClass(AlgoDriver, [{
    key: "makeAssetTxn",
    value: function () {
      var _makeAssetTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assetParams) {
        var from, to, assetName, assetURL, note, amount, unitName, decimals, total, assetMetadata, _assetParams$extras, extras, suggestedParams, algoTxn;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                from = assetParams.from, to = assetParams.to, assetName = assetParams.assetName, assetURL = assetParams.assetURL, note = assetParams.note, amount = assetParams.amount, unitName = assetParams.unitName, decimals = assetParams.decimals, total = assetParams.total, assetMetadata = assetParams.assetMetadata, _assetParams$extras = assetParams.extras, extras = _assetParams$extras === void 0 ? {
                  defaultFrozen: false,
                  clawback: from,
                  freeze: from,
                  manager: from,
                  reserve: from
                } : _assetParams$extras; // Hash the metadata
                // const metaDataBuffer = new TextEncoder().encode(assetMetadata);    // encode as UTF-8  
                // const metaDataHashBuffer = await subtle.digest('SHA-256', metaDataBuffer);    // hash the message
                // const hashedMetaData = new Uint8Array(metaDataHashBuffer);   // Convert ArrayBuffer to Array

                _context.next = 3;
                return this.getTransactionParams();

              case 3:
                suggestedParams = _context.sent;
                algoTxn = _algosdk.default.makeAssetCreateTxnWithSuggestedParamsFromObject(_objectSpread({
                  from: from,
                  to: to,
                  assetName: assetName,
                  assetURL: assetURL,
                  note: new TextEncoder().encode(note),
                  amount: amount,
                  unitName: unitName,
                  decimals: decimals,
                  total: total,
                  // assetMetadataHash: hashedMetaData,
                  assetMetadataHash: assetMetadata,
                  suggestedParams: suggestedParams
                }, extras));
                return _context.abrupt("return", this.createUniversalTxn(algoTxn, "Sign this txn to create asset ".concat(assetName)));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function makeAssetTxn(_x) {
        return _makeAssetTxn.apply(this, arguments);
      }

      return makeAssetTxn;
    }()
  }, {
    key: "makePaymentTxn",
    value: function () {
      var _makePaymentTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assetParams) {
        var to, from, amount, note, extras, suggestedParams, algoTxn;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                to = assetParams.to, from = assetParams.from, amount = assetParams.amount, note = assetParams.note, extras = assetParams.extras;
                _context2.next = 3;
                return this.getTransactionParams();

              case 3:
                suggestedParams = _context2.sent;
                algoTxn = _algosdk.default.makePaymentTxnWithSuggestedParamsFromObject(_objectSpread({
                  from: from,
                  to: to,
                  amount: amount,
                  note: new Uint8Array(Buffer.from(note)),
                  suggestedParams: suggestedParams
                }, extras));
                return _context2.abrupt("return", this.createUniversalTxn(algoTxn, "Sign this txn to make a payment of ".concat(amount, " algos to ").concat(to)));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function makePaymentTxn(_x2) {
        return _makePaymentTxn.apply(this, arguments);
      }

      return makePaymentTxn;
    }()
  }, {
    key: "makeAssetOptInTxn",
    value: function () {
      var _makeAssetOptInTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assetParams) {
        var to, from, assetIndex, _assetParams$extras2, extras, suggestedParams, algoTxn;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                to = assetParams.to, from = assetParams.from, assetIndex = assetParams.assetIndex, _assetParams$extras2 = assetParams.extras, extras = _assetParams$extras2 === void 0 ? {
                  amount: 0,
                  note: undefined,
                  closeRemainderTo: undefined,
                  revocationTarget: undefined
                } : _assetParams$extras2;
                _context3.next = 3;
                return this.getTransactionParams();

              case 3:
                suggestedParams = _context3.sent;
                algoTxn = _algosdk.default.makeAssetTransferTxnWithSuggestedParamsFromObject(_objectSpread({
                  from: from,
                  to: to,
                  assetIndex: assetIndex,
                  suggestedParams: suggestedParams
                }, extras));
                return _context3.abrupt("return", this.createUniversalTxn(algoTxn, "Sign this txn to opt-in to receive asset ".concat(assetIndex, " from ").concat(from)));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function makeAssetOptInTxn(_x3) {
        return _makeAssetOptInTxn.apply(this, arguments);
      }

      return makeAssetOptInTxn;
    }()
  }, {
    key: "makeAssetTransferTxn",
    value: function () {
      var _makeAssetTransferTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assetParams) {
        var to, from, assetIndex, _assetParams$extras3, extras, suggestedParams, algoTxn;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                to = assetParams.to, from = assetParams.from, assetIndex = assetParams.assetIndex, _assetParams$extras3 = assetParams.extras, extras = _assetParams$extras3 === void 0 ? {
                  amount: 1,
                  note: new TextEncoder().encode('Transfer this asset'),
                  closeRemainderTo: undefined,
                  revocationTarget: undefined
                } : _assetParams$extras3;
                _context4.next = 3;
                return this.getTransactionParams();

              case 3:
                suggestedParams = _context4.sent;
                algoTxn = _algosdk.default.makeAssetTransferTxnWithSuggestedParamsFromObject(_objectSpread({
                  from: from,
                  to: to,
                  assetIndex: assetIndex,
                  suggestedParams: suggestedParams
                }, extras));
                return _context4.abrupt("return", this.createUniversalTxn(algoTxn, "Sign this txn to transfer asset ".concat(assetIndex, " to ").concat(to)));

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function makeAssetTransferTxn(_x4) {
        return _makeAssetTransferTxn.apply(this, arguments);
      }

      return makeAssetTransferTxn;
    }()
  }, {
    key: "sendTxn",
    value: function () {
      var _sendTxn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(signedTxnResult, txnId) {
        var sentTxn;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.client.sendRawTransaction(signedTxnResult).do();

              case 2:
                sentTxn = _context5.sent;
                _context5.next = 5;
                return _algosdk.default.waitForConfirmation(this.client, txnId, 4);

              case 5:
                return _context5.abrupt("return", sentTxn);

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function sendTxn(_x5, _x6) {
        return _sendTxn.apply(this, arguments);
      }

      return sendTxn;
    }()
  }, {
    key: "lookupTransactionById",
    value: function () {
      var _lookupTransactionById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(txnId) {
        var txnDetails;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.indexer.lookupTransactionByID(txnId).do();

              case 2:
                txnDetails = _context6.sent;
                return _context6.abrupt("return", txnDetails);

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function lookupTransactionById(_x7) {
        return _lookupTransactionById.apply(this, arguments);
      }

      return lookupTransactionById;
    }()
  }, {
    key: "getAssetDetails",
    value: function () {
      var _getAssetDetails = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assetId) {
        var accountInfo;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.client.getAssetByID(Number(assetId)).do();

              case 2:
                accountInfo = _context7.sent;
                return _context7.abrupt("return", accountInfo.params);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getAssetDetails(_x8) {
        return _getAssetDetails.apply(this, arguments);
      }

      return getAssetDetails;
    }()
  }, {
    key: "getAssets",
    value: function () {
      var _getAssets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(address) {
        var accountInfo;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.client.accountInformation(address).do();

              case 2:
                accountInfo = _context8.sent;
                return _context8.abrupt("return", accountInfo.assets);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getAssets(_x9) {
        return _getAssets.apply(this, arguments);
      }

      return getAssets;
    }()
  }, {
    key: "getStatus",
    value: function () {
      var _getStatus = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.client.status().do();

              case 2:
                return _context9.abrupt("return", _context9.sent);

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getStatus() {
        return _getStatus.apply(this, arguments);
      }

      return getStatus;
    }()
  }, {
    key: "getBlockTimestamp",
    value: function () {
      var _getBlockTimestamp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(nonce) {
        var blockData;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.client.block(nonce).do();

              case 2:
                blockData = _context10.sent;
                return _context10.abrupt("return", blockData.block.ts);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getBlockTimestamp(_x10) {
        return _getBlockTimestamp.apply(this, arguments);
      }

      return getBlockTimestamp;
    }()
  }, {
    key: "getTransactionParams",
    value: function () {
      var _getTransactionParams = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.client.getTransactionParams().do();

              case 2:
                return _context11.abrupt("return", _context11.sent);

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getTransactionParams() {
        return _getTransactionParams.apply(this, arguments);
      }

      return getTransactionParams;
    }()
  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      return _algosdk.default.isValidAddress(address);
    }
  }, {
    key: "getPublicKey",
    value: function getPublicKey(address) {
      // const utfPublicKey = decodeAddress(address).publicKey
      // return new TextDecoder('utf-8').decode(utfPublicKey)
      return (0, _algosdk.decodeAddress)(address).publicKey;
    }
  }, {
    key: "createUniversalTxn",
    value: function createUniversalTxn(algoTxn, message) {
      return {
        txn: _algosdk.default.encodeUnsignedTransaction(algoTxn),
        message: message,
        txnId: algoTxn.txID().toString(),
        nativeTxn: algoTxn
      };
    }
  }]);

  return AlgoDriver;
}();

exports.AlgoDriver = AlgoDriver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBbGdvRHJpdmVyIiwiQVBJX0tFWSIsInRva2VuIiwiY2xpZW50IiwiYWxnb3NkayIsIkFsZ29kdjIiLCJzZXJ2ZXIiLCJwb3J0IiwiaW5kZXhlciIsIkluZGV4ZXIiLCJpbmRleGVyU2VydmVyIiwiYXNzZXRQYXJhbXMiLCJmcm9tIiwidG8iLCJhc3NldE5hbWUiLCJhc3NldFVSTCIsIm5vdGUiLCJhbW91bnQiLCJ1bml0TmFtZSIsImRlY2ltYWxzIiwidG90YWwiLCJhc3NldE1ldGFkYXRhIiwiZXh0cmFzIiwiZGVmYXVsdEZyb3plbiIsImNsYXdiYWNrIiwiZnJlZXplIiwibWFuYWdlciIsInJlc2VydmUiLCJnZXRUcmFuc2FjdGlvblBhcmFtcyIsInN1Z2dlc3RlZFBhcmFtcyIsImFsZ29UeG4iLCJtYWtlQXNzZXRDcmVhdGVUeG5XaXRoU3VnZ2VzdGVkUGFyYW1zRnJvbU9iamVjdCIsIlRleHRFbmNvZGVyIiwiZW5jb2RlIiwiYXNzZXRNZXRhZGF0YUhhc2giLCJjcmVhdGVVbml2ZXJzYWxUeG4iLCJtYWtlUGF5bWVudFR4bldpdGhTdWdnZXN0ZWRQYXJhbXNGcm9tT2JqZWN0IiwiVWludDhBcnJheSIsIkJ1ZmZlciIsImFzc2V0SW5kZXgiLCJ1bmRlZmluZWQiLCJjbG9zZVJlbWFpbmRlclRvIiwicmV2b2NhdGlvblRhcmdldCIsIm1ha2VBc3NldFRyYW5zZmVyVHhuV2l0aFN1Z2dlc3RlZFBhcmFtc0Zyb21PYmplY3QiLCJzaWduZWRUeG5SZXN1bHQiLCJ0eG5JZCIsInNlbmRSYXdUcmFuc2FjdGlvbiIsImRvIiwic2VudFR4biIsIndhaXRGb3JDb25maXJtYXRpb24iLCJsb29rdXBUcmFuc2FjdGlvbkJ5SUQiLCJ0eG5EZXRhaWxzIiwiYXNzZXRJZCIsImdldEFzc2V0QnlJRCIsIk51bWJlciIsImFjY291bnRJbmZvIiwicGFyYW1zIiwiYWRkcmVzcyIsImFjY291bnRJbmZvcm1hdGlvbiIsImFzc2V0cyIsInN0YXR1cyIsIm5vbmNlIiwiYmxvY2siLCJibG9ja0RhdGEiLCJ0cyIsImlzVmFsaWRBZGRyZXNzIiwicHVibGljS2V5IiwibWVzc2FnZSIsInR4biIsImVuY29kZVVuc2lnbmVkVHJhbnNhY3Rpb24iLCJ0eElEIiwidG9TdHJpbmciLCJuYXRpdmVUeG4iXSwic291cmNlcyI6WyIuLi8uLi9zcmMvQ2hhaW5Ecml2ZXJzL0FsZ29Ecml2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFsZ29zZGssIHsgZGVjb2RlQWRkcmVzcywgVHJhbnNhY3Rpb24gfSBmcm9tICdhbGdvc2RrJztcclxuaW1wb3J0IHtcclxuICAgIElDaGFpbkRyaXZlcixcclxuICAgIE1ha2VBc3NldFBhcmFtcyxcclxuICAgIE1ha2VPcHRJbkFzc2V0UGFyYW1zLFxyXG4gICAgTWFrZVBheW1lbnRQYXJhbXMsXHJcbiAgICBNYWtlVHJhbnNmZXJBc3NldFBhcmFtcyxcclxuICAgIFVuaXZlcnNhbFR4blxyXG59IGZyb20gJy4uL0B0eXBlcy9DaGFpbkRyaXZlcidcclxuXHJcbmV4cG9ydCBjbGFzcyBBbGdvRHJpdmVyIGltcGxlbWVudHMgSUNoYWluRHJpdmVyIHtcclxuICAgIHNlcnZlcjogc3RyaW5nID0gXCJodHRwczovL3Rlc3RuZXQtYWxnb3JhbmQuYXBpLnB1cmVzdGFrZS5pby9wczJcIjtcclxuICAgIGluZGV4ZXJTZXJ2ZXI6IHN0cmluZyA9IFwiaHR0cHM6Ly90ZXN0bmV0LWFsZ29yYW5kLmFwaS5wdXJlc3Rha2UuaW8vaWR4MlwiO1xyXG4gICAgcG9ydDogc3RyaW5nID0gXCJcIjtcclxuICAgIHRva2VuOiBhbnkgPSB7fTtcclxuICAgIGNsaWVudDogYWxnb3Nkay5BbGdvZHYyO1xyXG4gICAgaW5kZXhlcjogYWxnb3Nkay5JbmRleGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKEFQSV9LRVk/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnRva2VuID0geyBcIngtYXBpLWtleVwiOiBBUElfS0VZID8gQVBJX0tFWSA6ICcnIH1cclxuICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBhbGdvc2RrLkFsZ29kdjIodGhpcy50b2tlbiwgdGhpcy5zZXJ2ZXIsIHRoaXMucG9ydCk7XHJcbiAgICAgICAgdGhpcy5pbmRleGVyID0gbmV3IGFsZ29zZGsuSW5kZXhlcih0aGlzLnRva2VuLCB0aGlzLmluZGV4ZXJTZXJ2ZXIsIHRoaXMucG9ydCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbWFrZUFzc2V0VHhuKGFzc2V0UGFyYW1zOiBNYWtlQXNzZXRQYXJhbXMpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGZyb20sXHJcbiAgICAgICAgICAgIHRvLFxyXG4gICAgICAgICAgICBhc3NldE5hbWUsXHJcbiAgICAgICAgICAgIGFzc2V0VVJMLFxyXG4gICAgICAgICAgICBub3RlLFxyXG4gICAgICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgICAgIHVuaXROYW1lLFxyXG4gICAgICAgICAgICBkZWNpbWFscyxcclxuICAgICAgICAgICAgdG90YWwsXHJcbiAgICAgICAgICAgIGFzc2V0TWV0YWRhdGEsXHJcbiAgICAgICAgICAgIGV4dHJhcyA9IHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRGcm96ZW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY2xhd2JhY2s6IGZyb20sXHJcbiAgICAgICAgICAgICAgICBmcmVlemU6IGZyb20sXHJcbiAgICAgICAgICAgICAgICBtYW5hZ2VyOiBmcm9tLFxyXG4gICAgICAgICAgICAgICAgcmVzZXJ2ZTogZnJvbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSA9IGFzc2V0UGFyYW1zXHJcbiAgICAgICAgLy8gSGFzaCB0aGUgbWV0YWRhdGFcclxuICAgICAgICAvLyBjb25zdCBtZXRhRGF0YUJ1ZmZlciA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShhc3NldE1ldGFkYXRhKTsgICAgLy8gZW5jb2RlIGFzIFVURi04ICBcclxuICAgICAgICAvLyBjb25zdCBtZXRhRGF0YUhhc2hCdWZmZXIgPSBhd2FpdCBzdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgbWV0YURhdGFCdWZmZXIpOyAgICAvLyBoYXNoIHRoZSBtZXNzYWdlXHJcbiAgICAgICAgLy8gY29uc3QgaGFzaGVkTWV0YURhdGEgPSBuZXcgVWludDhBcnJheShtZXRhRGF0YUhhc2hCdWZmZXIpOyAgIC8vIENvbnZlcnQgQXJyYXlCdWZmZXIgdG8gQXJyYXlcclxuICAgICAgICBjb25zdCBzdWdnZXN0ZWRQYXJhbXMgPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uUGFyYW1zKClcclxuICAgICAgICBjb25zdCBhbGdvVHhuID0gYWxnb3Nkay5tYWtlQXNzZXRDcmVhdGVUeG5XaXRoU3VnZ2VzdGVkUGFyYW1zRnJvbU9iamVjdCh7XHJcbiAgICAgICAgICAgIGZyb20sXHJcbiAgICAgICAgICAgIHRvLFxyXG4gICAgICAgICAgICBhc3NldE5hbWUsXHJcbiAgICAgICAgICAgIGFzc2V0VVJMLFxyXG4gICAgICAgICAgICBub3RlOiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUobm90ZSksXHJcbiAgICAgICAgICAgIGFtb3VudCxcclxuICAgICAgICAgICAgdW5pdE5hbWUsXHJcbiAgICAgICAgICAgIGRlY2ltYWxzLFxyXG4gICAgICAgICAgICB0b3RhbCxcclxuICAgICAgICAgICAgLy8gYXNzZXRNZXRhZGF0YUhhc2g6IGhhc2hlZE1ldGFEYXRhLFxyXG4gICAgICAgICAgICBhc3NldE1ldGFkYXRhSGFzaDogYXNzZXRNZXRhZGF0YSxcclxuICAgICAgICAgICAgc3VnZ2VzdGVkUGFyYW1zLFxyXG4gICAgICAgICAgICAuLi5leHRyYXNcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVVuaXZlcnNhbFR4bihhbGdvVHhuLCBgU2lnbiB0aGlzIHR4biB0byBjcmVhdGUgYXNzZXQgJHthc3NldE5hbWV9YClcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBtYWtlUGF5bWVudFR4bihhc3NldFBhcmFtczogTWFrZVBheW1lbnRQYXJhbXMpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRvLFxyXG4gICAgICAgICAgICBmcm9tLFxyXG4gICAgICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgICAgIG5vdGUsXHJcbiAgICAgICAgICAgIGV4dHJhc1xyXG4gICAgICAgIH0gPSBhc3NldFBhcmFtc1xyXG5cclxuICAgICAgICBjb25zdCBzdWdnZXN0ZWRQYXJhbXMgPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uUGFyYW1zKClcclxuICAgICAgICBjb25zdCBhbGdvVHhuID0gYWxnb3Nkay5tYWtlUGF5bWVudFR4bldpdGhTdWdnZXN0ZWRQYXJhbXNGcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgZnJvbSxcclxuICAgICAgICAgICAgdG8sXHJcbiAgICAgICAgICAgIGFtb3VudCxcclxuICAgICAgICAgICAgbm90ZTogbmV3IFVpbnQ4QXJyYXkoQnVmZmVyLmZyb20obm90ZSkpLFxyXG4gICAgICAgICAgICBzdWdnZXN0ZWRQYXJhbXMsXHJcbiAgICAgICAgICAgIC4uLmV4dHJhc1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVW5pdmVyc2FsVHhuKGFsZ29UeG4sIGBTaWduIHRoaXMgdHhuIHRvIG1ha2UgYSBwYXltZW50IG9mICR7YW1vdW50fSBhbGdvcyB0byAke3RvfWApXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbWFrZUFzc2V0T3B0SW5UeG4oYXNzZXRQYXJhbXM6IE1ha2VPcHRJbkFzc2V0UGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgZnJvbSxcclxuICAgICAgICAgICAgYXNzZXRJbmRleCxcclxuICAgICAgICAgICAgZXh0cmFzID0ge1xyXG4gICAgICAgICAgICAgICAgYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgbm90ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgY2xvc2VSZW1haW5kZXJUbzogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgcmV2b2NhdGlvblRhcmdldDogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ID0gYXNzZXRQYXJhbXNcclxuXHJcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGVkUGFyYW1zID0gYXdhaXQgdGhpcy5nZXRUcmFuc2FjdGlvblBhcmFtcygpXHJcbiAgICAgICAgY29uc3QgYWxnb1R4biA9IGFsZ29zZGsubWFrZUFzc2V0VHJhbnNmZXJUeG5XaXRoU3VnZ2VzdGVkUGFyYW1zRnJvbU9iamVjdCh7XHJcbiAgICAgICAgICAgIGZyb20sXHJcbiAgICAgICAgICAgIHRvLFxyXG4gICAgICAgICAgICBhc3NldEluZGV4LFxyXG4gICAgICAgICAgICBzdWdnZXN0ZWRQYXJhbXMsXHJcbiAgICAgICAgICAgIC4uLmV4dHJhc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVVuaXZlcnNhbFR4bihhbGdvVHhuLCBgU2lnbiB0aGlzIHR4biB0byBvcHQtaW4gdG8gcmVjZWl2ZSBhc3NldCAke2Fzc2V0SW5kZXh9IGZyb20gJHtmcm9tfWApXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbWFrZUFzc2V0VHJhbnNmZXJUeG4oYXNzZXRQYXJhbXM6IE1ha2VUcmFuc2ZlckFzc2V0UGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgZnJvbSxcclxuICAgICAgICAgICAgYXNzZXRJbmRleCxcclxuICAgICAgICAgICAgZXh0cmFzID0ge1xyXG4gICAgICAgICAgICAgICAgYW1vdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgbm90ZTogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKCdUcmFuc2ZlciB0aGlzIGFzc2V0JyksXHJcbiAgICAgICAgICAgICAgICBjbG9zZVJlbWFpbmRlclRvOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICByZXZvY2F0aW9uVGFyZ2V0OiB1bmRlZmluZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gPSBhc3NldFBhcmFtc1xyXG5cclxuICAgICAgICBjb25zdCBzdWdnZXN0ZWRQYXJhbXMgPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uUGFyYW1zKClcclxuICAgICAgICBjb25zdCBhbGdvVHhuID0gYWxnb3Nkay5tYWtlQXNzZXRUcmFuc2ZlclR4bldpdGhTdWdnZXN0ZWRQYXJhbXNGcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgZnJvbSxcclxuICAgICAgICAgICAgdG8sXHJcbiAgICAgICAgICAgIGFzc2V0SW5kZXgsXHJcbiAgICAgICAgICAgIHN1Z2dlc3RlZFBhcmFtcyxcclxuICAgICAgICAgICAgLi4uZXh0cmFzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVW5pdmVyc2FsVHhuKGFsZ29UeG4sIGBTaWduIHRoaXMgdHhuIHRvIHRyYW5zZmVyIGFzc2V0ICR7YXNzZXRJbmRleH0gdG8gJHt0b31gKVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNlbmRUeG4oc2lnbmVkVHhuUmVzdWx0OiBhbnksIHR4bklkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIC8vIGNvbnN0IHR4bnM6IFVpbnQ4QXJyYXlbXSA9IHNpZ25lZFR4blJlc3VsdC5tYXAoKGVsZW1lbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoQnVmZmVyLmZyb20oZWxlbWVudCwgXCJiYXNlNjRcIikpXHJcbiAgICAgICAgLy8gfSlcclxuICAgICAgICAvLyBjb25zdCBlbmNvZGVkU3R4ID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHN0eClcclxuICAgICAgICAvLyBjb25zdCBzZW50VHhuID0gYXdhaXQgdGhpcy5jbGllbnQuc2VuZFJhd1RyYW5zYWN0aW9uKHR4bnMpLmRvKCk7XHJcbiAgICAgICAgY29uc3Qgc2VudFR4biA9IGF3YWl0IHRoaXMuY2xpZW50LnNlbmRSYXdUcmFuc2FjdGlvbihzaWduZWRUeG5SZXN1bHQpLmRvKCk7XHJcbiAgICAgICAgYXdhaXQgYWxnb3Nkay53YWl0Rm9yQ29uZmlybWF0aW9uKHRoaXMuY2xpZW50LCB0eG5JZCwgNCk7XHJcbiAgICAgICAgcmV0dXJuIHNlbnRUeG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb29rdXBUcmFuc2FjdGlvbkJ5SWQodHhuSWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHR4bkRldGFpbHMgPSBhd2FpdCB0aGlzLmluZGV4ZXIubG9va3VwVHJhbnNhY3Rpb25CeUlEKHR4bklkKS5kbygpO1xyXG4gICAgICAgIHJldHVybiB0eG5EZXRhaWxzO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldEFzc2V0RGV0YWlscyhhc3NldElkOiBzdHJpbmcgfCBOdW1iZXIpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGxldCBhY2NvdW50SW5mbyA9IChhd2FpdCB0aGlzLmNsaWVudC5nZXRBc3NldEJ5SUQoTnVtYmVyKGFzc2V0SWQpKS5kbygpKTtcclxuICAgICAgICByZXR1cm4gYWNjb3VudEluZm8ucGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldEFzc2V0cyhhZGRyZXNzOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGNvbnN0IGFjY291bnRJbmZvID0gYXdhaXQgdGhpcy5jbGllbnQuYWNjb3VudEluZm9ybWF0aW9uKGFkZHJlc3MpLmRvKCk7XHJcbiAgICAgICAgcmV0dXJuIGFjY291bnRJbmZvLmFzc2V0c1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldFN0YXR1cygpOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIGFueT4+IHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuc3RhdHVzKCkuZG8oKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXRCbG9ja1RpbWVzdGFtcChub25jZTogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBibG9ja0RhdGEgPSBhd2FpdCB0aGlzLmNsaWVudC5ibG9jayhub25jZSkuZG8oKVxyXG4gICAgICAgIHJldHVybiBibG9ja0RhdGEuYmxvY2sudHNcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXRUcmFuc2FjdGlvblBhcmFtcygpOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIGFueT4+IHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuZ2V0VHJhbnNhY3Rpb25QYXJhbXMoKS5kbygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVmFsaWRBZGRyZXNzKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBhbGdvc2RrLmlzVmFsaWRBZGRyZXNzKGFkZHJlc3MpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHVibGljS2V5KGFkZHJlc3M6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICAgIC8vIGNvbnN0IHV0ZlB1YmxpY0tleSA9IGRlY29kZUFkZHJlc3MoYWRkcmVzcykucHVibGljS2V5XHJcbiAgICAgICAgLy8gcmV0dXJuIG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKS5kZWNvZGUodXRmUHVibGljS2V5KVxyXG4gICAgICAgIHJldHVybiBkZWNvZGVBZGRyZXNzKGFkZHJlc3MpLnB1YmxpY0tleVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVW5pdmVyc2FsVHhuKGFsZ29UeG46IFRyYW5zYWN0aW9uLCBtZXNzYWdlOiBzdHJpbmcpOiBVbml2ZXJzYWxUeG4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR4bjogYWxnb3Nkay5lbmNvZGVVbnNpZ25lZFRyYW5zYWN0aW9uKGFsZ29UeG4pLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICB0eG5JZDogYWxnb1R4bi50eElEKCkudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgbmF0aXZlVHhuOiBhbGdvVHhuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVYUEsVTtFQVFULG9CQUFZQyxPQUFaLEVBQThCO0lBQUE7O0lBQUEsZ0NBUGIsK0NBT2E7O0lBQUEsdUNBTk4sZ0RBTU07O0lBQUEsOEJBTGYsRUFLZTs7SUFBQSwrQkFKakIsRUFJaUI7O0lBQUE7O0lBQUE7O0lBQzFCLEtBQUtDLEtBQUwsR0FBYTtNQUFFLGFBQWFELE9BQU8sR0FBR0EsT0FBSCxHQUFhO0lBQW5DLENBQWI7SUFDQSxLQUFLRSxNQUFMLEdBQWMsSUFBSUMsaUJBQVFDLE9BQVosQ0FBb0IsS0FBS0gsS0FBekIsRUFBZ0MsS0FBS0ksTUFBckMsRUFBNkMsS0FBS0MsSUFBbEQsQ0FBZDtJQUNBLEtBQUtDLE9BQUwsR0FBZSxJQUFJSixpQkFBUUssT0FBWixDQUFvQixLQUFLUCxLQUF6QixFQUFnQyxLQUFLUSxhQUFyQyxFQUFvRCxLQUFLSCxJQUF6RCxDQUFmO0VBQ0g7Ozs7O2tGQUVELGlCQUFtQkksV0FBbkI7UUFBQTs7UUFBQTtVQUFBO1lBQUE7Y0FBQTtnQkFFUUMsSUFGUixHQW1CUUQsV0FuQlIsQ0FFUUMsSUFGUixFQUdRQyxFQUhSLEdBbUJRRixXQW5CUixDQUdRRSxFQUhSLEVBSVFDLFNBSlIsR0FtQlFILFdBbkJSLENBSVFHLFNBSlIsRUFLUUMsUUFMUixHQW1CUUosV0FuQlIsQ0FLUUksUUFMUixFQU1RQyxJQU5SLEdBbUJRTCxXQW5CUixDQU1RSyxJQU5SLEVBT1FDLE1BUFIsR0FtQlFOLFdBbkJSLENBT1FNLE1BUFIsRUFRUUMsUUFSUixHQW1CUVAsV0FuQlIsQ0FRUU8sUUFSUixFQVNRQyxRQVRSLEdBbUJRUixXQW5CUixDQVNRUSxRQVRSLEVBVVFDLEtBVlIsR0FtQlFULFdBbkJSLENBVVFTLEtB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