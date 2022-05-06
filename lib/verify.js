"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChallenge = createChallenge;
exports.getAllAssets = getAllAssets;
exports.getAssetDetails = getAssetDetails;
exports.initializeVerify = initializeVerify;
exports.lookupTransactionById = lookupTransactionById;
exports.verifyChallenge = verifyChallenge;

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var URI_REGEX = /\w+:(\/?\/?)[^\s]+/;
var ISO8601_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
var chainDriver;

function initializeVerify(driver) {
  chainDriver = driver;
}

function lookupTransactionById(_x) {
  return _lookupTransactionById.apply(this, arguments);
}

function _lookupTransactionById() {
  _lookupTransactionById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(txnID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return chainDriver.lookupTransactionById(txnID);

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _lookupTransactionById.apply(this, arguments);
}

function getAssetDetails(_x2) {
  return _getAssetDetails.apply(this, arguments);
} // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4361.md
// This is EIP-4361 - Sign in With Ethereum

/**
 * Creates a challenge to be signed by Wallet Provider to prove identity
 * @param domain 
 * @param statement 
 * @param address 
 * @param uri 
 * @param expirationDate 
 * @param notBefore 
 * @param resources 
 * @returns 
 */


function _getAssetDetails() {
  _getAssetDetails = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(txnId) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return chainDriver.getAssetDetails(txnId);

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getAssetDetails.apply(this, arguments);
}

function createChallenge(_x3) {
  return _createChallenge.apply(this, arguments);
}
/**
 * Verifies that the challenge was signed by the account belonging to the asset
 * @param originalChallenge 
 * @param signedChallenge 
 * @returns 
 */


function _createChallenge() {
  _createChallenge = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(challengeParams) {
    var domain, statement, address, uri, _challengeParams$vers, version, _challengeParams$chai, chainId, _challengeParams$issu, issuedAt, _challengeParams$expi, expirationDate, _challengeParams$notB, notBefore, _challengeParams$reso, resources, challenge;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            domain = challengeParams.domain, statement = challengeParams.statement, address = challengeParams.address, uri = challengeParams.uri, _challengeParams$vers = challengeParams.version, version = _challengeParams$vers === void 0 ? "1" : _challengeParams$vers, _challengeParams$chai = challengeParams.chainId, chainId = _challengeParams$chai === void 0 ? "1" : _challengeParams$chai, _challengeParams$issu = challengeParams.issuedAt, issuedAt = _challengeParams$issu === void 0 ? new Date().toISOString() : _challengeParams$issu, _challengeParams$expi = challengeParams.expirationDate, expirationDate = _challengeParams$expi === void 0 ? undefined : _challengeParams$expi, _challengeParams$notB = challengeParams.notBefore, notBefore = _challengeParams$notB === void 0 ? undefined : _challengeParams$notB, _challengeParams$reso = challengeParams.resources, resources = _challengeParams$reso === void 0 ? undefined : _challengeParams$reso;
            _context3.prev = 1;
            _context3.t0 = domain;
            _context3.t1 = statement;
            _context3.t2 = address;
            _context3.t3 = uri;
            _context3.t4 = version;
            _context3.t5 = chainId;
            _context3.next = 10;
            return getChallengeNonce();

          case 10:
            _context3.t6 = _context3.sent;
            _context3.t7 = issuedAt;
            _context3.t8 = expirationDate;
            _context3.t9 = notBefore;
            _context3.t10 = resources;
            challenge = {
              domain: _context3.t0,
              statement: _context3.t1,
              address: _context3.t2,
              uri: _context3.t3,
              version: _context3.t4,
              chainId: _context3.t5,
              nonce: _context3.t6,
              issuedAt: _context3.t7,
              expirationDate: _context3.t8,
              notBefore: _context3.t9,
              resources: _context3.t10
            };
            validateChallenge(challenge); // will throw error if invalid

            return _context3.abrupt("return", constructMessageString(challenge));

          case 20:
            _context3.prev = 20;
            _context3.t11 = _context3["catch"](1);
            return _context3.abrupt("return", "Error: ".concat(_context3.t11));

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 20]]);
  }));
  return _createChallenge.apply(this, arguments);
}

function verifyChallenge(_x4, _x5) {
  return _verifyChallenge.apply(this, arguments);
}

function _verifyChallenge() {
  _verifyChallenge = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(originalChallenge, signedChallenge) {
    var generatedEIP4361ChallengeStr, challenge, currDate, originalAddress;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getChallengeString(originalChallenge);

          case 2:
            generatedEIP4361ChallengeStr = _context4.sent;
            challenge = createMessageFromString(generatedEIP4361ChallengeStr);
            validateChallenge(challenge);
            console.log("Success: Constructed challenge from string and verified it is well-formed.");
            currDate = new Date();

            if (!(challenge.expirationDate && currDate >= new Date(challenge.expirationDate))) {
              _context4.next = 9;
              break;
            }

            throw "Error: Challenge expired: ".concat(challenge.expirationDate);

          case 9:
            if (!(challenge.notBefore && currDate <= new Date(challenge.notBefore))) {
              _context4.next = 11;
              break;
            }

            throw "Error: Challenge invalid until: ".concat(challenge.notBefore);

          case 11:
            originalAddress = challenge.address;
            _context4.next = 14;
            return verifyChallengeSignature(originalChallenge, signedChallenge, originalAddress);

          case 14:
            console.log("Success: Signature matches address specified within the challenge.");

            if (!challenge.resources) {
              _context4.next = 19;
              break;
            }

            _context4.next = 18;
            return verifyOwnershipOfAssets(challenge.address, challenge.resources);

          case 18:
            grantPermissions(challenge.resources);

          case 19:
            return _context4.abrupt("return", "Successfully granted access via Blockin");

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _verifyChallenge.apply(this, arguments);
}

function verifyChallengeNonce(_x6) {
  return _verifyChallengeNonce.apply(this, arguments);
}
/** Called after a user is fully verified. Handles permissions or performs actions based on the accepted asset IDs  */


function _verifyChallengeNonce() {
  _verifyChallengeNonce = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(nonce) {
    var blockTimestamp, currentTimestamp;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return chainDriver.getBlockTimestamp(nonce);

          case 2:
            blockTimestamp = _context5.sent;
            currentTimestamp = Math.round(new Date().getTime() / 1000);
            return _context5.abrupt("return", blockTimestamp > currentTimestamp - 60);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _verifyChallengeNonce.apply(this, arguments);
}

function grantPermissions(_x7) {
  return _grantPermissions.apply(this, arguments);
}
/** The functions in this section are standard and should not be edited, except for possibly the function
 *  calls of the functions from above if edited. */


function _grantPermissions() {
  _grantPermissions = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assetIds) {
    var _iterator3, _step3, assetIdStr, assetId;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _iterator3 = _createForOfIteratorHelper(assetIds);
            _context6.prev = 1;

            _iterator3.s();

          case 3:
            if ((_step3 = _iterator3.n()).done) {
              _context6.next = 11;
              break;
            }

            assetIdStr = _step3.value;

            if (assetIdStr.startsWith('Asset ID:')) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("continue", 9);

          case 7:
            assetId = assetIdStr.substring(10);
            console.log("User has been granted privileges of " + assetId);

          case 9:
            _context6.next = 3;
            break;

          case 11:
            _context6.next = 16;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](1);

            _iterator3.e(_context6.t0);

          case 16:
            _context6.prev = 16;

            _iterator3.f();

            return _context6.finish(16);

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 13, 16, 19]]);
  }));
  return _grantPermissions.apply(this, arguments);
}

function validateChallenge(challenge) {
  if (!URI_REGEX.test(challenge.domain)) {
    throw "Inputted domain (".concat(challenge.domain, ") is not a valid URI");
  }

  if (!chainDriver.isValidAddress(challenge.address)) {
    throw "Inputted address (".concat(challenge.address, ") is not a valid Algorand address");
  }

  if (!URI_REGEX.test(challenge.uri)) {
    throw "Inputted URI (".concat(challenge.uri, ") is not a valid URI");
  }

  if (!verifyChallengeNonce(challenge.nonce)) {
    throw "Illegal nonce (".concat(challenge.nonce, ") specified");
  }

  if (!ISO8601_DATE_REGEX.test(challenge.issuedAt)) {
    throw "Issued at date (".concat(challenge.issuedAt, ") is not in valid ISO 8601 format");
  }

  if (challenge.expirationDate && !ISO8601_DATE_REGEX.test(challenge.expirationDate)) {
    throw "Inputted expiration date (".concat(challenge.expirationDate, ") is not in valid ISO 8601 format");
  }

  if (challenge.notBefore && !ISO8601_DATE_REGEX.test(challenge.notBefore)) {
    throw "Inputted not before date (".concat(challenge.notBefore, ") is not in valid ISO 8601 format");
  }

  if (challenge.resources) {
    var _iterator = _createForOfIteratorHelper(challenge.resources),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var resource = _step.value;

        if (!resource.startsWith('Asset ID: ') && !URI_REGEX.test(resource)) {
          throw "Inputted resource in resources (".concat(resource, ") does not start with 'Asset ID: ' and is not a valid URI");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

function getChallengeNonce() {
  return _getChallengeNonce.apply(this, arguments);
}

function _getChallengeNonce() {
  _getChallengeNonce = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var status;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return chainDriver.getStatus();

          case 2:
            status = _context7.sent;
            return _context7.abrupt("return", Number(status['last-round']));

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _getChallengeNonce.apply(this, arguments);
}

function constructMessageString(challenge) {
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

    var _iterator2 = _createForOfIteratorHelper(challenge.resources),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var resource = _step2.value;
        message += "\n- ".concat(resource);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return message;
}
/**
 * This function usually is not needed. If it is not needed, just return the input as is.
 * 
 * For Algorand and WalletConnect, you can't just explicitly call signBytes() so we had to include it as
 * a note within a txn object. This function extracts the challenge note from the txn object stringified JSON
 */


function getChallengeString(_x8) {
  return _getChallengeString.apply(this, arguments);
}

function _getChallengeString() {
  _getChallengeString = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(txnBytes) {
    var txnString, bytes, idx, challengeString;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            txnString = new TextDecoder().decode(txnBytes);
            bytes = [];
            idx = txnString.indexOf('note') + 7;

            while (txnBytes[idx] !== 163) {
              bytes.push(txnBytes[idx]);
              idx++;
            }

            challengeString = new TextDecoder().decode(new Uint8Array(bytes));
            console.log(challengeString);
            return _context8.abrupt("return", challengeString);

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _getChallengeString.apply(this, arguments);
}

function createMessageFromString(challenge) {
  var messageArray = challenge.split("\n");
  var domain = messageArray[0].split(' ')[0];
  var address = messageArray[1];
  var statement = messageArray[3];
  var uri = messageArray[5].split(' ')[1];
  var version = messageArray[6].split(':')[1].trim();
  var chainId = messageArray[7].split(':')[1].trim();
  var nonce = Number(messageArray[8].split(':')[1].trim());
  var issuedAt = messageArray[9].split(':').slice(1).join(':').trim();
  var expirationDate;
  var notBefore;
  var resources = [];

  if (messageArray[10]) {
    if (messageArray[10].indexOf('Expiration Time:') != -1) {
      expirationDate = messageArray[10].split(':').slice(1).join(':').trim();
    } else if (messageArray[10].indexOf('Not Before:') != -1) {
      notBefore = messageArray[10].split(':').slice(1).join(':').trim();
    } else if (messageArray[10].indexOf('Resources:') != -1) {
      resources = [];

      for (var i = 11; i < messageArray.length; i++) {
        var resource = messageArray[i].split(' ').slice(1).join(' ').trim();
        resources.push(resource);
      }
    }
  }

  if (messageArray[11]) {
    if (messageArray[11].indexOf('Not Before:') != -1) {
      notBefore = messageArray[11].split(':').slice(1).join(':').trim();
    } else if (messageArray[11].indexOf('Resources:') != -1) {
      resources = [];

      for (var _i = 12; _i < messageArray.length; _i++) {
        var _resource = messageArray[_i].split(' ').slice(1).join(' ').trim();

        resources.push(_resource);
      }
    }
  }

  if (messageArray[12]) {
    if (messageArray[12].indexOf('Resources:') != -1) {
      resources = [];

      for (var _i2 = 13; _i2 < messageArray.length; _i2++) {
        var _resource2 = messageArray[_i2].split(' ').slice(1).join(' ').trim();

        resources.push(_resource2);
      }
    }
  }

  return {
    domain: domain,
    address: address,
    statement: statement,
    expirationDate: expirationDate,
    notBefore: notBefore,
    resources: resources,
    issuedAt: issuedAt,
    uri: uri,
    version: version,
    chainId: chainId,
    nonce: nonce
  };
}
/** The functions in this section are left up to the resource server's implementation. */


function verifyChallengeSignature(_x9, _x10, _x11) {
  return _verifyChallengeSignature.apply(this, arguments);
}

function _verifyChallengeSignature() {
  _verifyChallengeSignature = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(originalChallengeToUint8Array, signedChallenge, originalAddress) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (_tweetnacl.default.sign.detached.verify(originalChallengeToUint8Array, signedChallenge, chainDriver.getPublicKey(originalAddress))) {
              _context9.next = 2;
              break;
            }

            throw 'Invalid signature';

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _verifyChallengeSignature.apply(this, arguments);
}

function getAllAssets(_x12) {
  return _getAllAssets.apply(this, arguments);
}

function _getAllAssets() {
  _getAllAssets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(address) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return chainDriver.getAssets(address);

          case 2:
            return _context10.abrupt("return", _context10.sent);

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _getAllAssets.apply(this, arguments);
}

function verifyOwnershipOfAssets(_x13, _x14) {
  return _verifyOwnershipOfAssets.apply(this, arguments);
}

function _verifyOwnershipOfAssets() {
  _verifyOwnershipOfAssets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(address, assetIds) {
    var assets, _iterator4, _step4, _loop, _ret;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return chainDriver.getAssets(address);

          case 2:
            assets = _context11.sent;
            _iterator4 = _createForOfIteratorHelper(assetIds);
            _context11.prev = 4;

            _loop = function _loop() {
              var assetIdStr = _step4.value;

              if (!assetIdStr.startsWith('Asset ID:')) {
                return "continue";
              }

              var assetId = assetIdStr.substring(10);
              var requestedAsset = assets.find(function (elem) {
                return elem['asset-id'].toString() === assetId;
              });

              if (!requestedAsset) {
                throw "Address ".concat(address, " does not own requested asset : ").concat(assetId);
              } else {
                console.log("Success: Found asset in user's wallet: ".concat(assetId, "."));
              }
            };

            _iterator4.s();

          case 7:
            if ((_step4 = _iterator4.n()).done) {
              _context11.next = 13;
              break;
            }

            _ret = _loop();

            if (!(_ret === "continue")) {
              _context11.next = 11;
              break;
            }

            return _context11.abrupt("continue", 11);

          case 11:
            _context11.next = 7;
            break;

          case 13:
            _context11.next = 18;
            break;

          case 15:
            _context11.prev = 15;
            _context11.t0 = _context11["catch"](4);

            _iterator4.e(_context11.t0);

          case 18:
            _context11.prev = 18;

            _iterator4.f();

            return _context11.finish(18);

          case 21:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[4, 15, 18, 21]]);
  }));
  return _verifyOwnershipOfAssets.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJVUklfUkVHRVgiLCJJU084NjAxX0RBVEVfUkVHRVgiLCJjaGFpbkRyaXZlciIsImluaXRpYWxpemVWZXJpZnkiLCJkcml2ZXIiLCJsb29rdXBUcmFuc2FjdGlvbkJ5SWQiLCJ0eG5JRCIsImdldEFzc2V0RGV0YWlscyIsInR4bklkIiwiY3JlYXRlQ2hhbGxlbmdlIiwiY2hhbGxlbmdlUGFyYW1zIiwiZG9tYWluIiwic3RhdGVtZW50IiwiYWRkcmVzcyIsInVyaSIsInZlcnNpb24iLCJjaGFpbklkIiwiaXNzdWVkQXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJleHBpcmF0aW9uRGF0ZSIsInVuZGVmaW5lZCIsIm5vdEJlZm9yZSIsInJlc291cmNlcyIsImdldENoYWxsZW5nZU5vbmNlIiwiY2hhbGxlbmdlIiwibm9uY2UiLCJ2YWxpZGF0ZUNoYWxsZW5nZSIsImNvbnN0cnVjdE1lc3NhZ2VTdHJpbmciLCJ2ZXJpZnlDaGFsbGVuZ2UiLCJvcmlnaW5hbENoYWxsZW5nZSIsInNpZ25lZENoYWxsZW5nZSIsImdldENoYWxsZW5nZVN0cmluZyIsImdlbmVyYXRlZEVJUDQzNjFDaGFsbGVuZ2VTdHIiLCJjcmVhdGVNZXNzYWdlRnJvbVN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJjdXJyRGF0ZSIsIm9yaWdpbmFsQWRkcmVzcyIsInZlcmlmeUNoYWxsZW5nZVNpZ25hdHVyZSIsInZlcmlmeU93bmVyc2hpcE9mQXNzZXRzIiwiZ3JhbnRQZXJtaXNzaW9ucyIsInZlcmlmeUNoYWxsZW5nZU5vbmNlIiwiZ2V0QmxvY2tUaW1lc3RhbXAiLCJibG9ja1RpbWVzdGFtcCIsImN1cnJlbnRUaW1lc3RhbXAiLCJNYXRoIiwicm91bmQiLCJnZXRUaW1lIiwiYXNzZXRJZHMiLCJhc3NldElkU3RyIiwic3RhcnRzV2l0aCIsImFzc2V0SWQiLCJzdWJzdHJpbmciLCJ0ZXN0IiwiaXNWYWxpZEFkZHJlc3MiLCJyZXNvdXJjZSIsImdldFN0YXR1cyIsInN0YXR1cyIsIk51bWJlciIsIm1lc3NhZ2UiLCJ0eG5CeXRlcyIsInR4blN0cmluZyIsIlRleHREZWNvZGVyIiwiZGVjb2RlIiwiYnl0ZXMiLCJpZHgiLCJpbmRleE9mIiwicHVzaCIsImNoYWxsZW5nZVN0cmluZyIsIlVpbnQ4QXJyYXkiLCJtZXNzYWdlQXJyYXkiLCJzcGxpdCIsInRyaW0iLCJzbGljZSIsImpvaW4iLCJpIiwibGVuZ3RoIiwib3JpZ2luYWxDaGFsbGVuZ2VUb1VpbnQ4QXJyYXkiLCJuYWNsIiwic2lnbiIsImRldGFjaGVkIiwidmVyaWZ5IiwiZ2V0UHVibGljS2V5IiwiZ2V0QWxsQXNzZXRzIiwiZ2V0QXNzZXRzIiwiYXNzZXRzIiwicmVxdWVzdGVkQXNzZXQiLCJmaW5kIiwiZWxlbSIsInRvU3RyaW5nIl0sInNvdXJjZXMiOlsiLi4vc3JjL3ZlcmlmeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbmFjbCBmcm9tIFwidHdlZXRuYWNsXCI7XHJcbmltcG9ydCB7IElDaGFpbkRyaXZlciB9IGZyb20gJy4vQHR5cGVzL0NoYWluRHJpdmVyJ1xyXG5pbXBvcnQgeyBDaGFsbGVuZ2VQYXJhbXMsIEVJUDQzNjFDaGFsbGVuZ2UgfSBmcm9tICcuL0B0eXBlcy92ZXJpZnknXHJcblxyXG5jb25zdCBVUklfUkVHRVg6IFJlZ0V4cCA9IC9cXHcrOihcXC8/XFwvPylbXlxcc10rLztcclxuY29uc3QgSVNPODYwMV9EQVRFX1JFR0VYOiBSZWdFeHAgPSAvXigtPyg/OlsxLTldWzAtOV0qKT9bMC05XXs0fSktKDFbMC0yXXwwWzEtOV0pLSgzWzAxXXwwWzEtOV18WzEyXVswLTldKVQoMlswLTNdfFswMV1bMC05XSk6KFswLTVdWzAtOV0pOihbMC01XVswLTldKSguWzAtOV0rKT8oWik/JC9cclxuXHJcbnZhciBjaGFpbkRyaXZlcjogSUNoYWluRHJpdmVyXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVZlcmlmeShkcml2ZXI6IElDaGFpbkRyaXZlcikge1xyXG4gICAgY2hhaW5Ecml2ZXIgPSBkcml2ZXJcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvb2t1cFRyYW5zYWN0aW9uQnlJZCh0eG5JRDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgY2hhaW5Ecml2ZXIubG9va3VwVHJhbnNhY3Rpb25CeUlkKHR4bklEKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFzc2V0RGV0YWlscyh0eG5JZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgY2hhaW5Ecml2ZXIuZ2V0QXNzZXREZXRhaWxzKHR4bklkKVxyXG59XHJcblxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vRUlQcy9ibG9iL21hc3Rlci9FSVBTL2VpcC00MzYxLm1kXHJcbi8vIFRoaXMgaXMgRUlQLTQzNjEgLSBTaWduIGluIFdpdGggRXRoZXJldW1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBjaGFsbGVuZ2UgdG8gYmUgc2lnbmVkIGJ5IFdhbGxldCBQcm92aWRlciB0byBwcm92ZSBpZGVudGl0eVxyXG4gKiBAcGFyYW0gZG9tYWluIFxyXG4gKiBAcGFyYW0gc3RhdGVtZW50IFxyXG4gKiBAcGFyYW0gYWRkcmVzcyBcclxuICogQHBhcmFtIHVyaSBcclxuICogQHBhcmFtIGV4cGlyYXRpb25EYXRlIFxyXG4gKiBAcGFyYW0gbm90QmVmb3JlIFxyXG4gKiBAcGFyYW0gcmVzb3VyY2VzIFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDaGFsbGVuZ2UoY2hhbGxlbmdlUGFyYW1zOiBDaGFsbGVuZ2VQYXJhbXMpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgICBkb21haW4sXHJcbiAgICAgICAgc3RhdGVtZW50LFxyXG4gICAgICAgIGFkZHJlc3MsXHJcbiAgICAgICAgdXJpLFxyXG4gICAgICAgIHZlcnNpb24gPSBcIjFcIixcclxuICAgICAgICBjaGFpbklkID0gXCIxXCIsXHJcbiAgICAgICAgaXNzdWVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgZXhwaXJhdGlvbkRhdGUgPSB1bmRlZmluZWQsXHJcbiAgICAgICAgbm90QmVmb3JlID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIHJlc291cmNlcyA9IHVuZGVmaW5lZFxyXG4gICAgfSA9IGNoYWxsZW5nZVBhcmFtcztcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGNoYWxsZW5nZTogRUlQNDM2MUNoYWxsZW5nZSA9IHtcclxuICAgICAgICAgICAgZG9tYWluLFxyXG4gICAgICAgICAgICBzdGF0ZW1lbnQsXHJcbiAgICAgICAgICAgIGFkZHJlc3MsXHJcbiAgICAgICAgICAgIHVyaSxcclxuICAgICAgICAgICAgdmVyc2lvbixcclxuICAgICAgICAgICAgY2hhaW5JZCxcclxuICAgICAgICAgICAgbm9uY2U6IGF3YWl0IGdldENoYWxsZW5nZU5vbmNlKCksXHJcbiAgICAgICAgICAgIGlzc3VlZEF0LFxyXG4gICAgICAgICAgICBleHBpcmF0aW9uRGF0ZSxcclxuICAgICAgICAgICAgbm90QmVmb3JlLFxyXG4gICAgICAgICAgICByZXNvdXJjZXNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbGlkYXRlQ2hhbGxlbmdlKGNoYWxsZW5nZSk7IC8vIHdpbGwgdGhyb3cgZXJyb3IgaWYgaW52YWxpZFxyXG5cclxuICAgICAgICByZXR1cm4gY29uc3RydWN0TWVzc2FnZVN0cmluZyhjaGFsbGVuZ2UpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcclxuICAgICAgICByZXR1cm4gYEVycm9yOiAke2Vycm9yfWA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWZXJpZmllcyB0aGF0IHRoZSBjaGFsbGVuZ2Ugd2FzIHNpZ25lZCBieSB0aGUgYWNjb3VudCBiZWxvbmdpbmcgdG8gdGhlIGFzc2V0XHJcbiAqIEBwYXJhbSBvcmlnaW5hbENoYWxsZW5nZSBcclxuICogQHBhcmFtIHNpZ25lZENoYWxsZW5nZSBcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5Q2hhbGxlbmdlKG9yaWdpbmFsQ2hhbGxlbmdlOiBVaW50OEFycmF5LCBzaWduZWRDaGFsbGVuZ2U6IFVpbnQ4QXJyYXkpIHtcclxuICAgIC8qXHJcbiAgICAgICAgTWFrZSBzdXJlIGdldENoYWxsZW5nZVN0cmluZygpIGlzIGNvbnNpc3RlbnQgd2l0aCB5b3VyIGltcGxlbWVudGF0aW9uLlxyXG5cclxuICAgICAgICBJZiBvcmlnaW5hbENoYWxsZW5nZSBpcyBhIHN0cmluZ2lmaWVkIEpTT04gYW5kIHlvdSBuZWVkIHRvIHBhcnNlIHRoZSBjaGFsbGVuZ2Ugc3RyaW5nIG91dCBvZiBpdCxcclxuICAgICAgICB0aGlzIGlzIHdoZXJlIHRvIGltcGxlbWVudCBpdC5cclxuXHJcbiAgICAgICAgSWYgb3JpZ2luYWxDaGFsbGVuZ2UgaXMgYWxyZWFkeSB0aGUgY2hhbGxlbmdlIHN0cmluZywganVzdCByZXR1cm4gdGhlIGlucHV0dGVkIHBhcmFtZXRlci5cclxuICAgICovXHJcbiAgICBjb25zdCBnZW5lcmF0ZWRFSVA0MzYxQ2hhbGxlbmdlU3RyOiBzdHJpbmcgPSBhd2FpdCBnZXRDaGFsbGVuZ2VTdHJpbmcob3JpZ2luYWxDaGFsbGVuZ2UpO1xyXG5cclxuICAgIGNvbnN0IGNoYWxsZW5nZTogRUlQNDM2MUNoYWxsZW5nZSA9IGNyZWF0ZU1lc3NhZ2VGcm9tU3RyaW5nKGdlbmVyYXRlZEVJUDQzNjFDaGFsbGVuZ2VTdHIpO1xyXG4gICAgdmFsaWRhdGVDaGFsbGVuZ2UoY2hhbGxlbmdlKTtcclxuICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzczogQ29uc3RydWN0ZWQgY2hhbGxlbmdlIGZyb20gc3RyaW5nIGFuZCB2ZXJpZmllZCBpdCBpcyB3ZWxsLWZvcm1lZC5cIik7XHJcblxyXG4gICAgY29uc3QgY3VyckRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgaWYgKGNoYWxsZW5nZS5leHBpcmF0aW9uRGF0ZSAmJiBjdXJyRGF0ZSA+PSBuZXcgRGF0ZShjaGFsbGVuZ2UuZXhwaXJhdGlvbkRhdGUpKSB7XHJcbiAgICAgICAgdGhyb3cgYEVycm9yOiBDaGFsbGVuZ2UgZXhwaXJlZDogJHtjaGFsbGVuZ2UuZXhwaXJhdGlvbkRhdGV9YFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFsbGVuZ2Uubm90QmVmb3JlICYmIGN1cnJEYXRlIDw9IG5ldyBEYXRlKGNoYWxsZW5nZS5ub3RCZWZvcmUpKSB7XHJcbiAgICAgICAgdGhyb3cgYEVycm9yOiBDaGFsbGVuZ2UgaW52YWxpZCB1bnRpbDogJHtjaGFsbGVuZ2Uubm90QmVmb3JlfWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvcmlnaW5hbEFkZHJlc3MgPSBjaGFsbGVuZ2UuYWRkcmVzcztcclxuICAgIGF3YWl0IHZlcmlmeUNoYWxsZW5nZVNpZ25hdHVyZShvcmlnaW5hbENoYWxsZW5nZSwgc2lnbmVkQ2hhbGxlbmdlLCBvcmlnaW5hbEFkZHJlc3MpXHJcbiAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3M6IFNpZ25hdHVyZSBtYXRjaGVzIGFkZHJlc3Mgc3BlY2lmaWVkIHdpdGhpbiB0aGUgY2hhbGxlbmdlLlwiKTtcclxuXHJcbiAgICBpZiAoY2hhbGxlbmdlLnJlc291cmNlcykge1xyXG4gICAgICAgIGF3YWl0IHZlcmlmeU93bmVyc2hpcE9mQXNzZXRzKGNoYWxsZW5nZS5hZGRyZXNzLCBjaGFsbGVuZ2UucmVzb3VyY2VzKTtcclxuICAgICAgICBncmFudFBlcm1pc3Npb25zKGNoYWxsZW5nZS5yZXNvdXJjZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgU3VjY2Vzc2Z1bGx5IGdyYW50ZWQgYWNjZXNzIHZpYSBCbG9ja2luYDtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5Q2hhbGxlbmdlTm9uY2Uobm9uY2U6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgbGV0IGJsb2NrVGltZXN0YW1wID0gYXdhaXQgY2hhaW5Ecml2ZXIuZ2V0QmxvY2tUaW1lc3RhbXAobm9uY2UpXHJcbiAgICB2YXIgY3VycmVudFRpbWVzdGFtcCA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgcmV0dXJuIGJsb2NrVGltZXN0YW1wID4gY3VycmVudFRpbWVzdGFtcCAtIDYwOyAvL3dpdGhpbiBsYXN0IDEgbWludXRlcyBvciA2MCBzZWNvbmRzXHJcbn1cclxuXHJcbi8qKiBDYWxsZWQgYWZ0ZXIgYSB1c2VyIGlzIGZ1bGx5IHZlcmlmaWVkLiBIYW5kbGVzIHBlcm1pc3Npb25zIG9yIHBlcmZvcm1zIGFjdGlvbnMgYmFzZWQgb24gdGhlIGFjY2VwdGVkIGFzc2V0IElEcyAgKi9cclxuYXN5bmMgZnVuY3Rpb24gZ3JhbnRQZXJtaXNzaW9ucyhhc3NldElkczogc3RyaW5nW10pIHtcclxuICAgIGZvciAoY29uc3QgYXNzZXRJZFN0ciBvZiBhc3NldElkcykge1xyXG4gICAgICAgIGlmICghYXNzZXRJZFN0ci5zdGFydHNXaXRoKCdBc3NldCBJRDonKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYXNzZXRJZCA9IGFzc2V0SWRTdHIuc3Vic3RyaW5nKDEwKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaGFzIGJlZW4gZ3JhbnRlZCBwcml2aWxlZ2VzIG9mIFwiICsgYXNzZXRJZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKiBUaGUgZnVuY3Rpb25zIGluIHRoaXMgc2VjdGlvbiBhcmUgc3RhbmRhcmQgYW5kIHNob3VsZCBub3QgYmUgZWRpdGVkLCBleGNlcHQgZm9yIHBvc3NpYmx5IHRoZSBmdW5jdGlvblxyXG4gKiAgY2FsbHMgb2YgdGhlIGZ1bmN0aW9ucyBmcm9tIGFib3ZlIGlmIGVkaXRlZC4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGVDaGFsbGVuZ2UoY2hhbGxlbmdlOiBFSVA0MzYxQ2hhbGxlbmdlKSB7XHJcbiAgICBpZiAoIVVSSV9SRUdFWC50ZXN0KGNoYWxsZW5nZS5kb21haW4pKSB7XHJcbiAgICAgICAgdGhyb3cgYElucHV0dGVkIGRvbWFpbiAoJHtjaGFsbGVuZ2UuZG9tYWlufSkgaXMgbm90IGEgdmFsaWQgVVJJYDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWNoYWluRHJpdmVyLmlzVmFsaWRBZGRyZXNzKGNoYWxsZW5nZS5hZGRyZXNzKSkge1xyXG4gICAgICAgIHRocm93IGBJbnB1dHRlZCBhZGRyZXNzICgke2NoYWxsZW5nZS5hZGRyZXNzfSkgaXMgbm90IGEgdmFsaWQgQWxnb3JhbmQgYWRkcmVzc2A7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFVUklfUkVHRVgudGVzdChjaGFsbGVuZ2UudXJpKSkge1xyXG4gICAgICAgIHRocm93IGBJbnB1dHRlZCBVUkkgKCR7Y2hhbGxlbmdlLnVyaX0pIGlzIG5vdCBhIHZhbGlkIFVSSWA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF2ZXJpZnlDaGFsbGVuZ2VOb25jZShjaGFsbGVuZ2Uubm9uY2UpKSB7XHJcbiAgICAgICAgdGhyb3cgYElsbGVnYWwgbm9uY2UgKCR7Y2hhbGxlbmdlLm5vbmNlfSkgc3BlY2lmaWVkYDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUlTTzg2MDFfREFURV9SRUdFWC50ZXN0KGNoYWxsZW5nZS5pc3N1ZWRBdCkpIHtcclxuICAgICAgICB0aHJvdyBgSXNzdWVkIGF0IGRhdGUgKCR7Y2hhbGxlbmdlLmlzc3VlZEF0fSkgaXMgbm90IGluIHZhbGlkIElTTyA4NjAxIGZvcm1hdGA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYWxsZW5nZS5leHBpcmF0aW9uRGF0ZSAmJiAhSVNPODYwMV9EQVRFX1JFR0VYLnRlc3QoY2hhbGxlbmdlLmV4cGlyYXRpb25EYXRlKSkge1xyXG4gICAgICAgIHRocm93IGBJbnB1dHRlZCBleHBpcmF0aW9uIGRhdGUgKCR7Y2hhbGxlbmdlLmV4cGlyYXRpb25EYXRlfSkgaXMgbm90IGluIHZhbGlkIElTTyA4NjAxIGZvcm1hdGA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYWxsZW5nZS5ub3RCZWZvcmUgJiYgIUlTTzg2MDFfREFURV9SRUdFWC50ZXN0KGNoYWxsZW5nZS5ub3RCZWZvcmUpKSB7XHJcbiAgICAgICAgdGhyb3cgYElucHV0dGVkIG5vdCBiZWZvcmUgZGF0ZSAoJHtjaGFsbGVuZ2Uubm90QmVmb3JlfSkgaXMgbm90IGluIHZhbGlkIElTTyA4NjAxIGZvcm1hdGA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYWxsZW5nZS5yZXNvdXJjZXMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHJlc291cmNlIG9mIGNoYWxsZW5nZS5yZXNvdXJjZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXNvdXJjZS5zdGFydHNXaXRoKCdBc3NldCBJRDogJykgJiYgIVVSSV9SRUdFWC50ZXN0KHJlc291cmNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgYElucHV0dGVkIHJlc291cmNlIGluIHJlc291cmNlcyAoJHtyZXNvdXJjZX0pIGRvZXMgbm90IHN0YXJ0IHdpdGggJ0Fzc2V0IElEOiAnIGFuZCBpcyBub3QgYSB2YWxpZCBVUklgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRDaGFsbGVuZ2VOb25jZSgpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgbGV0IHN0YXR1cyA9IGF3YWl0IGNoYWluRHJpdmVyLmdldFN0YXR1cygpXHJcbiAgICByZXR1cm4gTnVtYmVyKHN0YXR1c1snbGFzdC1yb3VuZCddKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0TWVzc2FnZVN0cmluZyhjaGFsbGVuZ2U6IEVJUDQzNjFDaGFsbGVuZ2UpOiBzdHJpbmcge1xyXG4gICAgbGV0IG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgbWVzc2FnZSArPSBgJHtjaGFsbGVuZ2UuZG9tYWlufSB3YW50cyB5b3UgdG8gc2lnbiBpbiB3aXRoIHlvdXIgQWxnb3JhbmQgYWNjb3VudDpcXG5gXHJcbiAgICBtZXNzYWdlICs9IGAke2NoYWxsZW5nZS5hZGRyZXNzfVxcblxcbmA7XHJcbiAgICBpZiAoY2hhbGxlbmdlLnN0YXRlbWVudCkge1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gYCR7Y2hhbGxlbmdlLnN0YXRlbWVudH1cXG5gO1xyXG4gICAgfVxyXG4gICAgbWVzc2FnZSArPSBgXFxuYDtcclxuICAgIG1lc3NhZ2UgKz0gYFVSSTogJHtjaGFsbGVuZ2UudXJpfVxcbmA7XHJcbiAgICBtZXNzYWdlICs9IGBWZXJzaW9uOiAke2NoYWxsZW5nZS52ZXJzaW9ufVxcbmA7XHJcbiAgICBtZXNzYWdlICs9IGBDaGFpbiBJRDogJHtjaGFsbGVuZ2UuY2hhaW5JZH1cXG5gO1xyXG4gICAgbWVzc2FnZSArPSBgTm9uY2U6ICR7Y2hhbGxlbmdlLm5vbmNlfVxcbmA7XHJcbiAgICBtZXNzYWdlICs9IGBJc3N1ZWQgQXQ6ICR7Y2hhbGxlbmdlLmlzc3VlZEF0fWA7XHJcbiAgICBpZiAoY2hhbGxlbmdlLmV4cGlyYXRpb25EYXRlKSB7XHJcbiAgICAgICAgbWVzc2FnZSArPSBgXFxuRXhwaXJhdGlvbiBUaW1lOiAke2NoYWxsZW5nZS5leHBpcmF0aW9uRGF0ZX1gO1xyXG4gICAgfVxyXG4gICAgaWYgKGNoYWxsZW5nZS5ub3RCZWZvcmUpIHtcclxuICAgICAgICBtZXNzYWdlICs9IGBcXG5Ob3QgQmVmb3JlOiAke2NoYWxsZW5nZS5ub3RCZWZvcmV9XFxuYDtcclxuICAgIH1cclxuICAgIGlmIChjaGFsbGVuZ2UucmVzb3VyY2VzKSB7XHJcbiAgICAgICAgbWVzc2FnZSArPSBgXFxuUmVzb3VyY2VzOmA7XHJcbiAgICAgICAgZm9yIChjb25zdCByZXNvdXJjZSBvZiBjaGFsbGVuZ2UucmVzb3VyY2VzKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gYFxcbi0gJHtyZXNvdXJjZX1gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtZXNzYWdlO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiB1c3VhbGx5IGlzIG5vdCBuZWVkZWQuIElmIGl0IGlzIG5vdCBuZWVkZWQsIGp1c3QgcmV0dXJuIHRoZSBpbnB1dCBhcyBpcy5cclxuICogXHJcbiAqIEZvciBBbGdvcmFuZCBhbmQgV2FsbGV0Q29ubmVjdCwgeW91IGNhbid0IGp1c3QgZXhwbGljaXRseSBjYWxsIHNpZ25CeXRlcygpIHNvIHdlIGhhZCB0byBpbmNsdWRlIGl0IGFzXHJcbiAqIGEgbm90ZSB3aXRoaW4gYSB0eG4gb2JqZWN0LiBUaGlzIGZ1bmN0aW9uIGV4dHJhY3RzIHRoZSBjaGFsbGVuZ2Ugbm90ZSBmcm9tIHRoZSB0eG4gb2JqZWN0IHN0cmluZ2lmaWVkIEpTT05cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldENoYWxsZW5nZVN0cmluZyh0eG5CeXRlczogVWludDhBcnJheSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCB0eG5TdHJpbmcgPSBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUodHhuQnl0ZXMpO1xyXG5cclxuICAgIGNvbnN0IGJ5dGVzID0gW107XHJcbiAgICBsZXQgaWR4ID0gdHhuU3RyaW5nLmluZGV4T2YoJ25vdGUnKSArIDc7XHJcbiAgICB3aGlsZSAodHhuQnl0ZXNbaWR4XSAhPT0gMTYzKSB7XHJcbiAgICAgICAgYnl0ZXMucHVzaCh0eG5CeXRlc1tpZHhdKTtcclxuICAgICAgICBpZHgrKztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGFsbGVuZ2VTdHJpbmcgPSBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKTtcclxuICAgIGNvbnNvbGUubG9nKGNoYWxsZW5nZVN0cmluZyk7XHJcblxyXG4gICAgcmV0dXJuIGNoYWxsZW5nZVN0cmluZztcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVzc2FnZUZyb21TdHJpbmcoY2hhbGxlbmdlOiBzdHJpbmcpOiBFSVA0MzYxQ2hhbGxlbmdlIHtcclxuICAgIGNvbnN0IG1lc3NhZ2VBcnJheSA9IGNoYWxsZW5nZS5zcGxpdChcIlxcblwiKTtcclxuICAgIGNvbnN0IGRvbWFpbiA9IG1lc3NhZ2VBcnJheVswXS5zcGxpdCgnICcpWzBdO1xyXG4gICAgY29uc3QgYWRkcmVzcyA9IG1lc3NhZ2VBcnJheVsxXTtcclxuICAgIGNvbnN0IHN0YXRlbWVudCA9IG1lc3NhZ2VBcnJheVszXTtcclxuICAgIGNvbnN0IHVyaSA9IG1lc3NhZ2VBcnJheVs1XS5zcGxpdCgnICcpWzFdO1xyXG4gICAgY29uc3QgdmVyc2lvbiA9IG1lc3NhZ2VBcnJheVs2XS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcclxuICAgIGNvbnN0IGNoYWluSWQgPSBtZXNzYWdlQXJyYXlbN10uc3BsaXQoJzonKVsxXS50cmltKCk7XHJcbiAgICBjb25zdCBub25jZSA9IE51bWJlcihtZXNzYWdlQXJyYXlbOF0uc3BsaXQoJzonKVsxXS50cmltKCkpO1xyXG4gICAgY29uc3QgaXNzdWVkQXQgPSBtZXNzYWdlQXJyYXlbOV0uc3BsaXQoJzonKS5zbGljZSgxKS5qb2luKCc6JykudHJpbSgpO1xyXG5cclxuICAgIGxldCBleHBpcmF0aW9uRGF0ZTtcclxuICAgIGxldCBub3RCZWZvcmU7XHJcbiAgICBsZXQgcmVzb3VyY2VzID0gW107XHJcbiAgICBpZiAobWVzc2FnZUFycmF5WzEwXSkge1xyXG4gICAgICAgIGlmIChtZXNzYWdlQXJyYXlbMTBdLmluZGV4T2YoJ0V4cGlyYXRpb24gVGltZTonKSAhPSAtMSkge1xyXG4gICAgICAgICAgICBleHBpcmF0aW9uRGF0ZSA9IG1lc3NhZ2VBcnJheVsxMF0uc3BsaXQoJzonKS5zbGljZSgxKS5qb2luKCc6JykudHJpbSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZUFycmF5WzEwXS5pbmRleE9mKCdOb3QgQmVmb3JlOicpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIG5vdEJlZm9yZSA9IG1lc3NhZ2VBcnJheVsxMF0uc3BsaXQoJzonKS5zbGljZSgxKS5qb2luKCc6JykudHJpbSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZUFycmF5WzEwXS5pbmRleE9mKCdSZXNvdXJjZXM6JykgIT0gLTEpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VzID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxMTsgaSA8IG1lc3NhZ2VBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBtZXNzYWdlQXJyYXlbaV0uc3BsaXQoJyAnKS5zbGljZSgxKS5qb2luKCcgJykudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXNzYWdlQXJyYXlbMTFdKSB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2VBcnJheVsxMV0uaW5kZXhPZignTm90IEJlZm9yZTonKSAhPSAtMSkge1xyXG4gICAgICAgICAgICBub3RCZWZvcmUgPSBtZXNzYWdlQXJyYXlbMTFdLnNwbGl0KCc6Jykuc2xpY2UoMSkuam9pbignOicpLnRyaW0oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VBcnJheVsxMV0uaW5kZXhPZignUmVzb3VyY2VzOicpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHJlc291cmNlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTI7IGkgPCBtZXNzYWdlQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gbWVzc2FnZUFycmF5W2ldLnNwbGl0KCcgJykuc2xpY2UoMSkuam9pbignICcpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWVzc2FnZUFycmF5WzEyXSkge1xyXG4gICAgICAgIGlmIChtZXNzYWdlQXJyYXlbMTJdLmluZGV4T2YoJ1Jlc291cmNlczonKSAhPSAtMSkge1xyXG4gICAgICAgICAgICByZXNvdXJjZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDEzOyBpIDwgbWVzc2FnZUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IG1lc3NhZ2VBcnJheVtpXS5zcGxpdCgnICcpLnNsaWNlKDEpLmpvaW4oJyAnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgZG9tYWluLCBhZGRyZXNzLCBzdGF0ZW1lbnQsIGV4cGlyYXRpb25EYXRlLCBub3RCZWZvcmUsIHJlc291cmNlcywgaXNzdWVkQXQsIHVyaSwgdmVyc2lvbiwgY2hhaW5JZCwgbm9uY2UgfTtcclxufVxyXG5cclxuLyoqIFRoZSBmdW5jdGlvbnMgaW4gdGhpcyBzZWN0aW9uIGFyZSBsZWZ0IHVwIHRvIHRoZSByZXNvdXJjZSBzZXJ2ZXIncyBpbXBsZW1lbnRhdGlvbi4gKi9cclxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5Q2hhbGxlbmdlU2lnbmF0dXJlKG9yaWdpbmFsQ2hhbGxlbmdlVG9VaW50OEFycmF5OiBVaW50OEFycmF5LCBzaWduZWRDaGFsbGVuZ2U6IFVpbnQ4QXJyYXksIG9yaWdpbmFsQWRkcmVzczogc3RyaW5nKSB7XHJcbiAgICBpZiAoIW5hY2wuc2lnbi5kZXRhY2hlZC52ZXJpZnkob3JpZ2luYWxDaGFsbGVuZ2VUb1VpbnQ4QXJyYXksIHNpZ25lZENoYWxsZW5nZSwgY2hhaW5Ecml2ZXIuZ2V0UHVibGljS2V5KG9yaWdpbmFsQWRkcmVzcykpKSB7XHJcbiAgICAgICAgdGhyb3cgJ0ludmFsaWQgc2lnbmF0dXJlJztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbEFzc2V0cyhhZGRyZXNzOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiAoYXdhaXQgY2hhaW5Ecml2ZXIuZ2V0QXNzZXRzKGFkZHJlc3MpKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlPd25lcnNoaXBPZkFzc2V0cyhhZGRyZXNzOiBzdHJpbmcsIGFzc2V0SWRzOiBzdHJpbmdbXSkge1xyXG5cclxuICAgIGxldCBhc3NldHMgPSAoYXdhaXQgY2hhaW5Ecml2ZXIuZ2V0QXNzZXRzKGFkZHJlc3MpKTtcclxuICAgIGZvciAoY29uc3QgYXNzZXRJZFN0ciBvZiBhc3NldElkcykge1xyXG4gICAgICAgIGlmICghYXNzZXRJZFN0ci5zdGFydHNXaXRoKCdBc3NldCBJRDonKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYXNzZXRJZCA9IGFzc2V0SWRTdHIuc3Vic3RyaW5nKDEwKTtcclxuICAgICAgICBjb25zdCByZXF1ZXN0ZWRBc3NldCA9IGFzc2V0cy5maW5kKChlbGVtOiBhbnkpID0+IGVsZW1bJ2Fzc2V0LWlkJ10udG9TdHJpbmcoKSA9PT0gYXNzZXRJZCk7XHJcblxyXG4gICAgICAgIGlmICghcmVxdWVzdGVkQXNzZXQpIHtcclxuICAgICAgICAgICAgdGhyb3cgYEFkZHJlc3MgJHthZGRyZXNzfSBkb2VzIG5vdCBvd24gcmVxdWVzdGVkIGFzc2V0IDogJHthc3NldElkfWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFN1Y2Nlc3M6IEZvdW5kIGFzc2V0IGluIHVzZXIncyB3YWxsZXQ6ICR7YXNzZXRJZH0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7OztB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