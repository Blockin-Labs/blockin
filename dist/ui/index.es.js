import React, { useState, useEffect } from 'react';

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

var css_248z$2 = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\nhtml,\nbody {\n  padding: 0;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\r Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; }\n\n* {\n  box-sizing: border-box; }\n\na {\n  color: inherit;\n  text-decoration: none; }\n\na:link {\n  text-decoration: none; }\n\na:visited {\n  text-decoration: none; }\n\n/* a:hover {\r\n  text-decoration: underline;\r\n} */\n/* a:active {\r\n  text-decoration: underline;\r\n} */\n.asset-link {\n  color: #0063dc; }\n\nbutton {\n  background-color: #b0d7fc;\n  color: black;\n  padding: 12px 15px;\n  font-weight: 600;\n  border-radius: 10px;\n  cursor: pointer; }\n\nbutton:disabled {\n  cursor: not-allowed; }\n\ninput {\n  display: block;\n  background-color: #ececec;\n  border-radius: 5px;\n  padding: 5px 10px;\n  margin: 30px auto;\n  text-align: center; }\n\nheader {\n  background-color: #4190ff;\n  padding: 10px 30px 20px;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column; }\n\n.connect-screen {\n  text-align: center;\n  padding: 100px 0px;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.7);\n  top: 0px;\n  left: 0px;\n  transition: opacity 500ms;\n  z-index: 50;\n  height: 100vh;\n  width: 100vw; }\n\n.connect-screen div {\n  background-color: white;\n  opacity: 100%;\n  width: 600px;\n  max-width: 90vw;\n  margin: 50px auto 0px;\n  padding: 30px;\n  border-radius: 25px; }\n\n.connect-screen h1 {\n  margin-bottom: 55px; }\n\n.hidden {\n  display: none; }\n\nmain {\n  text-align: center;\n  padding: 100px 0px 0px;\n  max-width: 30rem;\n  margin-inline: auto; }\n\n.home h2 {\n  font-size: larger; }\n\n.home h3 {\n  font-size: large;\n  padding-bottom: 20px;\n  margin-bottom: 30px;\n  border-bottom: 1px solid black; }\n\n.home ul {\n  padding: 0px;\n  list-style: upper-roman;\n  margin: 0px; }\n\n.home li {\n  margin: 20px 0px 0px;\n  text-decoration: underline;\n  color: #0063dc; }\n\n.assetidinput {\n  display: flex;\n  align-items: center;\n  justify-content: space-between; }\n\n.banner {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: bold;\n  font-size: 50px;\n  color: black;\n  -webkit-text-fill-color: rgba(255, 255, 255, 0);\n  /* Will override color (regardless of order) */\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #f7f7f7;\n  font-family: Arial, Helvetica, sans-serif; }\n\n.bottomBanner {\n  width: 100%; }\n\n.bannerStatus {\n  float: left;\n  display: flex;\n  align-items: center;\n  cursor: default; }\n\n.bannerStatus div {\n  display: flex;\n  align-items: center;\n  margin-right: 30px; }\n\n.connectStatus {\n  float: right;\n  display: flex;\n  align-items: center;\n  cursor: default; }\n\n.connectStatus div {\n  display: flex;\n  align-items: center;\n  margin-right: 30px; }\n\np {\n  margin: 0px; }\n\n.sideIcon {\n  fill: white;\n  margin-right: 13px; }\n\n.blockinIcon {\n  fill: white; }\n\n.logout, .login {\n  background: none;\n  color: white;\n  padding: 0px;\n  margin: 0px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  font-size: medium;\n  font-weight: 500;\n  float: right; }\n\n.closeButton {\n  background: none;\n  fill: black;\n  padding: 3px 0px 0px 0px;\n  margin: 0px 0px 20px 0px;\n  border: none;\n  float: right;\n  display: flex;\n  justify-content: flex-end;\n  width: 100%; }\n\n.connectButton {\n  display: flex;\n  margin: auto;\n  justify-content: center;\n  align-items: center; }\n\n.connectButton svg {\n  fill: black; }\n\n.test-component {\n  background-color: var(--background);\n  color: var(--font-color);\n  border: 1px solid #131111;\n  padding: 16px;\n  width: 360px;\n  text-align: center; }\n  .test-component .heading {\n    font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n    font-size: 40px;\n    font-weight: bold; }\n";
styleInject(css_248z$2);

const URI_REGEX = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
/**
 * Creates a challenge that is well-formed according to EIP-4361 - Sign in With Ethereum. Some
 * slight modifications to EIP-4361 for our library include 1) any blockchain's native address, signature,
 * and verification schemes are supported and 2) in resources, one may prefix an asset with 'Asset ID: '
 * to specify micro-authorizations or role-based access using an on-chain asset.
 *
 *
 * @param challengeParams - JSON object with the challenge details such as domain, uri, statement, address, etc.
 * @param options - JSON object speicfying any additional options when creating the challenge
 * @returns Well-formed challenge string to be signed by the user, if successsful. Error string is returned
 * upon failure.
 */
function createChallenge(challengeParams, options) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         *  This function should remain completely ChainDriver free. ChainDriver dependencies tend to mess up the
         * React component generation in the browser.
         */
        const { domain, statement, address, uri, nonce, version = "1", chainId = "1", issuedAt = new Date().toISOString(), expirationDate = undefined, notBefore = undefined, resources = undefined } = challengeParams;
        try {
            const challenge = {
                domain,
                statement,
                address,
                uri,
                version,
                chainId,
                nonce,
                issuedAt,
                expirationDate,
                notBefore,
                resources
            };
            validateChallengeObjectIsWellFormed(challenge); // will throw error if invalid
            return constructChallengeStringFromChallengeObject(challenge);
        }
        catch (error) {
            return `Error: ${error}`;
        }
    });
}
/**
 * Validates the object is well-formed according to the EIP-4361 interface, plus our additional add-ons
 * to the interface for Blockin.
 * @param challenge - Valid JSON challenge object
 */
function validateChallengeObjectIsWellFormed(challenge) {
    if (!URI_REGEX.test(challenge.domain)) {
        throw `Inputted domain (${challenge.domain}) is not a valid URI`;
    }
    /**
     * We only check for existence of an address here for Rollup React purposes (we don't use ChainDriver's isValidAddress).
     * Will not be able to generate a valid signature with an invalid address, however.
     */
    if (!challenge.address) {
        throw `No address specified or address is invalid`;
    }
    if (!URI_REGEX.test(challenge.uri)) {
        throw `Inputted URI (${challenge.uri}) is not a valid URI`;
    }
    if (!challenge.nonce) {
        throw `No nonce (${challenge.nonce}) specified`;
    }
    if (!ISO8601_DATE_REGEX.test(challenge.issuedAt)) {
        throw `Issued at date (${challenge.issuedAt}) is not in valid ISO 8601 format`;
    }
    if (challenge.expirationDate && !ISO8601_DATE_REGEX.test(challenge.expirationDate)) {
        throw `Inputted expiration date (${challenge.expirationDate}) is not in valid ISO 8601 format`;
    }
    if (challenge.notBefore && !ISO8601_DATE_REGEX.test(challenge.notBefore)) {
        throw `Inputted not before date (${challenge.notBefore}) is not in valid ISO 8601 format`;
    }
    if (challenge.resources) {
        for (const resource of challenge.resources) {
            if (!resource.startsWith('Asset ID: ') && !URI_REGEX.test(resource)) {
                throw `Inputted resource in resources (${resource}) does not start with 'Asset ID: ' and is not a valid URI`;
            }
        }
    }
}
/**
 * Parses a JSON object that specifies the challenge fields and returns a well-formatted EIP-4361 string.
 * Note that there is no validity checks on the inputs. It is a precondition that it is well-formed.
 * @param challenge - Well-formatted JSON object specifying the EIP-4361 fields.
 * @returns - Well-formatted EIP-4361 challenge string to be signed.
 */
function constructChallengeStringFromChallengeObject(challenge) {
    let message = "";
    message += `${challenge.domain} wants you to sign in with your Algorand account:\n`;
    message += `${challenge.address}\n\n`;
    if (challenge.statement) {
        message += `${challenge.statement}\n`;
    }
    message += `\n`;
    message += `URI: ${challenge.uri}\n`;
    message += `Version: ${challenge.version}\n`;
    message += `Chain ID: ${challenge.chainId}\n`;
    message += `Nonce: ${challenge.nonce}\n`;
    message += `Issued At: ${challenge.issuedAt}`;
    if (challenge.expirationDate) {
        message += `\nExpiration Time: ${challenge.expirationDate}`;
    }
    if (challenge.notBefore) {
        message += `\nNot Before: ${challenge.notBefore}\n`;
    }
    if (challenge.resources) {
        message += `\nResources:`;
        for (const resource of challenge.resources) {
            message += `\n- ${resource}`;
        }
    }
    return message;
}

// import { setChainDriver } from "../../blockin";
// import { AlgoDriver } from "../../ChainDrivers/AlgoDriver";
const TestComponent = ({ heading, content }) => {
    const [testing, setTesting] = useState('');
    const handleCreateChallenge = () => __awaiter(void 0, void 0, void 0, function* () {
        // setChainDriver(new AlgoDriver('Testnet'));
        const c = yield constructChallengeStringFromChallengeObject({ domain: 'https://blockin.edu', statement: 'asfad', address: 'A3KW6EZITJQTIHIVZUMN2BVG7DBKEBSGEJBIGEXQ4CPBQV6XAUQKZ5RRWA', uri: 'https://blockin.edu', nonce: '123', version: '1', chainId: 'ALL', issuedAt: new Date().toISOString() });
        setTesting(c);
    });
    return React.createElement("div", { "data-testid": "test-component", className: "test-component" },
        React.createElement("h1", { "data-testid": "test-component__heading", className: "heading" },
            heading,
            testing,
            React.createElement("button", { onClick: () => __awaiter(void 0, void 0, void 0, function* () { return yield handleCreateChallenge(); }) }, "Click 4 Challenge")),
        React.createElement("div", { "data-testid": "test-component__content" }, content));
};

var css_248z$1 = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\nhtml,\nbody {\n  padding: 0;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\r Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; }\n\n* {\n  box-sizing: border-box; }\n\na {\n  color: inherit;\n  text-decoration: none; }\n\na:link {\n  text-decoration: none; }\n\na:visited {\n  text-decoration: none; }\n\n/* a:hover {\r\n  text-decoration: underline;\r\n} */\n/* a:active {\r\n  text-decoration: underline;\r\n} */\n.asset-link {\n  color: #0063dc; }\n\nbutton {\n  background-color: #b0d7fc;\n  color: black;\n  padding: 12px 15px;\n  font-weight: 600;\n  border-radius: 10px;\n  cursor: pointer; }\n\nbutton:disabled {\n  cursor: not-allowed; }\n\ninput {\n  display: block;\n  background-color: #ececec;\n  border-radius: 5px;\n  padding: 5px 10px;\n  margin: 30px auto;\n  text-align: center; }\n\nheader {\n  background-color: #4190ff;\n  padding: 10px 30px 20px;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column; }\n\n.connect-screen {\n  text-align: center;\n  padding: 100px 0px;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.7);\n  top: 0px;\n  left: 0px;\n  transition: opacity 500ms;\n  z-index: 50;\n  height: 100vh;\n  width: 100vw; }\n\n.connect-screen div {\n  background-color: white;\n  opacity: 100%;\n  width: 600px;\n  max-width: 90vw;\n  margin: 50px auto 0px;\n  padding: 30px;\n  border-radius: 25px; }\n\n.connect-screen h1 {\n  margin-bottom: 55px; }\n\n.hidden {\n  display: none; }\n\nmain {\n  text-align: center;\n  padding: 100px 0px 0px;\n  max-width: 30rem;\n  margin-inline: auto; }\n\n.home h2 {\n  font-size: larger; }\n\n.home h3 {\n  font-size: large;\n  padding-bottom: 20px;\n  margin-bottom: 30px;\n  border-bottom: 1px solid black; }\n\n.home ul {\n  padding: 0px;\n  list-style: upper-roman;\n  margin: 0px; }\n\n.home li {\n  margin: 20px 0px 0px;\n  text-decoration: underline;\n  color: #0063dc; }\n\n.assetidinput {\n  display: flex;\n  align-items: center;\n  justify-content: space-between; }\n\n.banner {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: bold;\n  font-size: 50px;\n  color: black;\n  -webkit-text-fill-color: rgba(255, 255, 255, 0);\n  /* Will override color (regardless of order) */\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #f7f7f7;\n  font-family: Arial, Helvetica, sans-serif; }\n\n.bottomBanner {\n  width: 100%; }\n\n.bannerStatus {\n  float: left;\n  display: flex;\n  align-items: center;\n  cursor: default; }\n\n.bannerStatus div {\n  display: flex;\n  align-items: center;\n  margin-right: 30px; }\n\n.connectStatus {\n  float: right;\n  display: flex;\n  align-items: center;\n  cursor: default; }\n\n.connectStatus div {\n  display: flex;\n  align-items: center;\n  margin-right: 30px; }\n\np {\n  margin: 0px; }\n\n.sideIcon {\n  fill: white;\n  margin-right: 13px; }\n\n.blockinIcon {\n  fill: white; }\n\n.logout, .login {\n  background: none;\n  color: white;\n  padding: 0px;\n  margin: 0px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  font-size: medium;\n  font-weight: 500;\n  float: right; }\n\n.closeButton {\n  background: none;\n  fill: black;\n  padding: 3px 0px 0px 0px;\n  margin: 0px 0px 20px 0px;\n  border: none;\n  float: right;\n  display: flex;\n  justify-content: flex-end;\n  width: 100%; }\n\n.connectButton {\n  display: flex;\n  margin: auto;\n  justify-content: center;\n  align-items: center; }\n\n.connectButton svg {\n  fill: black; }\n\n.foo-bar {\n  font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n  color: #005f20; }\n";
styleInject(css_248z$1);

/**
 * Gets metadata about the current chain. First, if currentChainInfo is passed, we just return that.
 * Next, we check the supported chains map and see if the name passed in matches. If nothing else was
 * found, we return a default object.
 * @param chainName Name of the current blockchain you would like to get. See SUPPORTED_CHAIN_MAP for
 * the natively supported names.
 * @param currentChainInfo Optional chain info. Must be of type SupportedChain. If this is defined, we
 * just return this
 * @returns SupportedChain object containing metadata about the chain.
 */
const getChain = (chainName, currentChainInfo) => {
    if (currentChainInfo)
        return currentChainInfo;
    else if (SUPPORTED_CHAIN_MAP[chainName])
        return SUPPORTED_CHAIN_MAP[chainName];
    else
        return {
            name: chainName,
            logo: 'https://cdn-icons-png.flaticon.com/512/2091/2091665.png'
        };
};
const SUPPORTED_CHAIN_MAP = {
    'Ethereum': {
        name: 'Ethereum',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png'
    },
    'Algorand Mainnet': {
        name: 'Algorand',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png'
    },
    'Algorand Testnet': {
        name: 'Algorand (Testnet)',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png'
    },
};

const buttonStyle = {
    backgroundColor: 'rgb(176, 215, 252)',
    color: 'black',
    padding: '12px 15px',
    fontWeight: 600,
    borderRadius: '10px',
    cursor: 'pointer',
};
/**
 * Gets the default selected resources from the passed-in props
 * @param assets Assets passed in as props
 * @param uris URIs passed in as props
 * @returns Array of formatted string[] resources
 */
const getDefaultSelectedResources = (assets, uris) => {
    const selectedResources = [];
    for (const asset of assets) {
        if (asset.defaultSelected) {
            selectedResources.push(`Asset ID: ${asset.assetId}`);
        }
    }
    for (const uri of uris) {
        if (uri.defaultSelected) {
            selectedResources.push(`${uri.uri}`);
        }
    }
    return selectedResources;
};
/**
 * SignInWithBlockinButton - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const SignInWithBlockinButton = ({ challengeParams, displayedAssets = [], displayedUris = [], signChallenge, verifyChallenge, generateNonce, currentChain, currentChainInfo, canAddCustomAssets = false, canAddCustomUris = false, customAddResourcesMessage = '', }) => {
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [selectedResources, setSelectedResources] = useState(getDefaultSelectedResources(displayedAssets, displayedUris));
    const [displayMessage, setDisplayMessage] = useState('');
    const [chain, setChain] = useState(getChain(currentChain, currentChainInfo));
    const [assetId, setAssetId] = useState('');
    const [uri, setUri] = useState('');
    /**
     * This will be true when 1) there are no selectable resources passed in by provider and 2) user can not add custom
     * resources.
     */
    const resourcesAreHidden = displayedAssets.length === 0 && displayedUris.length === 0 && !canAddCustomAssets && !canAddCustomUris;
    /**
     * Adds a resource that was added by the user to selectedResources. Formats in correct Blockin format
     * for assets vs. URIs.
     * @param resource ID / text that the user inputted
     * @param isAssetID If is an asset, we prefix with 'Asset ID: ' to match the Blockin interface
     */
    const addCustomResource = (resource, isAssetID) => __awaiter(void 0, void 0, void 0, function* () {
        if (!resource)
            return;
        const resourceToAdd = isAssetID ? `Asset ID: ${resource}` : resource;
        const newArr = [...selectedResources, resourceToAdd];
        setSelectedResources(newArr);
    });
    /**
     * Upon chain change, update chain metadata and props
     */
    useEffect(() => {
        setChain(getChain(currentChain, currentChainInfo));
    }, [currentChain]);
    return React.createElement(React.Fragment, null,
        React.createElement("button", { style: buttonStyle, onClick: () => setModalIsVisible(!modalIsVisible) }, "Sign In with Blockin"),
        modalIsVisible && React.createElement(React.Fragment, null,
            React.createElement("section", { style: {
                    textAlign: 'center',
                    padding: '100px 0px',
                    position: 'fixed',
                    background: 'rgba(0, 0, 0, 0.7)',
                    top: 0,
                    left: 0,
                    transition: 'opacity 500ms',
                    zIndex: 50,
                    minHeight: '100vh',
                    minWidth: '100vw',
                } },
                React.createElement("div", { style: {
                        wordWrap: 'break-word',
                        backgroundColor: 'white',
                        opacity: '100%',
                        width: 600,
                        height: 600,
                        maxWidth: '90vw',
                        margin: '0 auto 0px',
                        padding: '30px',
                        borderRadius: '25px',
                        overflowY: 'auto',
                        scrollbarWidth: 'none'
                    } },
                    React.createElement("button", { onClick: () => { setModalIsVisible(!modalIsVisible); }, style: {
                            background: 'none',
                            fill: 'black',
                            padding: '3px 0px 0px 0px',
                            margin: '0px 0px 20px 0px',
                            border: 'none',
                            float: 'right',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                            cursor: 'pointer'
                        } }, "Close"),
                    React.createElement("h1", null, "Sign In with Blockin!"),
                    React.createElement("img", { src: chain.logo, height: '100px', width: 'auto' }),
                    React.createElement("h3", null,
                        React.createElement(React.Fragment, null,
                            challengeParams.domain,
                            " wants you to sign in with your ",
                            chain.name,
                            " account: ",
                            challengeParams.address)),
                    React.createElement("h3", null, challengeParams.statement),
                    React.createElement("h3", null,
                        "URI: ",
                        challengeParams.uri),
                    React.createElement("h3", null,
                        "You will be authorized starting ",
                        challengeParams.notBefore ? challengeParams.notBefore : `now (${new Date().toISOString()})`,
                        " ",
                        challengeParams.expirationDate && `until ${challengeParams.expirationDate}`),
                    !resourcesAreHidden && React.createElement(React.Fragment, null, (displayedAssets.length !== 0 || displayedUris.length !== 0) && React.createElement(React.Fragment, null,
                        React.createElement("h3", null, "Select from the resources you would like to receive access to:"),
                        displayedAssets.map(elem => {
                            return React.createElement(React.Fragment, null,
                                React.createElement("hr", null),
                                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                    React.createElement("div", { style: { display: 'flex' } },
                                        React.createElement("div", { style: { textAlign: 'left', alignItems: 'center', height: '100%', marginRight: 10 } },
                                            React.createElement("img", { src: chain.logo, height: '50px', width: 'auto' })),
                                        React.createElement("div", { style: { textAlign: 'left' } },
                                            React.createElement("b", null, elem.name),
                                            React.createElement("br", null),
                                            "Asset ID:",
                                            ' ',
                                            React.createElement("a", { style: {
                                                    color: 'rgb(0, 99, 220)'
                                                }, href: `https://testnet.algoexplorer.io/asset/${elem.assetId}`, target: "_blank", rel: "noreferrer" }, elem.assetId),
                                            " - ",
                                            elem.description)),
                                    React.createElement("div", { style: { textAlign: 'right' } }, selectedResources.includes(`Asset ID: ${elem.assetId}`) ?
                                        React.createElement("button", { style: buttonStyle, onClick: () => {
                                                const newArr = selectedResources.filter(resource => resource !== `Asset ID: ${elem.assetId}`);
                                                setSelectedResources(newArr);
                                            }, disabled: elem.frozen }, "Deselect") :
                                        React.createElement("button", { style: buttonStyle, disabled: elem.frozen, onClick: () => {
                                                const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`];
                                                setSelectedResources(newArr);
                                            } }, "Select"))));
                        }),
                        displayedUris.map(elem => {
                            return React.createElement(React.Fragment, null,
                                React.createElement("hr", null),
                                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                    React.createElement("div", { style: { display: 'flex' } },
                                        React.createElement("div", { style: { textAlign: 'left', alignItems: 'center', height: '100%', marginRight: 10 } },
                                            React.createElement("img", { src: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png', height: 'auto', width: '50px' })),
                                        React.createElement("div", { style: { textAlign: 'left' } },
                                            React.createElement("b", null, elem.name),
                                            React.createElement("br", null),
                                            "URI: ",
                                            ' ',
                                            React.createElement("a", { style: {
                                                    color: 'rgb(0, 99, 220)'
                                                }, href: `${elem.uri}`, target: "_blank", rel: "noreferrer" }, elem.uri),
                                            " - ",
                                            elem.description)),
                                    React.createElement("div", { style: { textAlign: 'right' } }, selectedResources.includes(elem.uri) ?
                                        React.createElement("button", { disabled: elem.frozen, style: buttonStyle, onClick: () => {
                                                const newArr = selectedResources.filter(resource => resource !== elem.uri);
                                                setSelectedResources(newArr);
                                            } }, "Deselect") :
                                        React.createElement("button", { disabled: elem.frozen, style: buttonStyle, onClick: () => {
                                                const newArr = [...selectedResources, elem.uri];
                                                setSelectedResources(newArr);
                                            } }, "Select"))));
                        }))),
                    (canAddCustomAssets || canAddCustomUris) &&
                        React.createElement(React.Fragment, null,
                            React.createElement("h3", null, "You may also add custom resources below: "),
                            React.createElement("h3", null, customAddResourcesMessage),
                            canAddCustomAssets && React.createElement(React.Fragment, null,
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    } },
                                    React.createElement("input", { value: assetId, type: "text", placeholder: 'Add Asset ID #', onChange: e => setAssetId(e.target.value) }),
                                    React.createElement("button", { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                            yield addCustomResource(assetId);
                                            setAssetId('');
                                        }) }, "Add Asset ID"))),
                            canAddCustomUris && React.createElement(React.Fragment, null,
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    } },
                                    React.createElement("input", { value: uri, type: "text", placeholder: 'Add URI', onChange: e => setUri(e.target.value) }),
                                    React.createElement("button", { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                            yield addCustomResource(uri);
                                            setUri('');
                                        }) }, "Add URI")))),
                    selectedResources && React.createElement("h3", null, "List of Selected Resources"),
                    selectedResources.map(resource => {
                        return React.createElement("li", null,
                            resource,
                            React.createElement("button", { onClick: () => {
                                    const newArr = selectedResources.filter(elem => resource !== elem);
                                    setSelectedResources(newArr);
                                } }, "Remove"));
                    }),
                    React.createElement("hr", null),
                    React.createElement("button", { style: buttonStyle, onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                            const nonce = generateNonce ? yield generateNonce() : challengeParams.nonce;
                            const challenge = Object.assign(Object.assign({}, challengeParams), { resources: selectedResources, nonce });
                            const challengeString = yield createChallenge(challenge);
                            const signChallengeResponse = yield signChallenge(challengeString);
                            const { success, message } = yield verifyChallenge(signChallengeResponse);
                            if (!success) {
                                setDisplayMessage(message);
                            }
                            else {
                                setDisplayMessage('');
                                setSelectedResources([]);
                                setModalIsVisible(false);
                            }
                        }) }, "Sign In"),
                    displayMessage && React.createElement("p", null, displayMessage)))));
};

var css_248z = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\nhtml,\nbody {\n  padding: 0;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\r Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; }\n\n* {\n  box-sizing: border-box; }\n\na {\n  color: inherit;\n  text-decoration: none; }\n\na:link {\n  text-decoration: none; }\n\na:visited {\n  text-decoration: none; }\n\n/* a:hover {\r\n  text-decoration: underline;\r\n} */\n/* a:active {\r\n  text-decoration: underline;\r\n} */\n.asset-link {\n  color: #0063dc; }\n\nbutton {\n  background-color: #b0d7fc;\n  color: black;\n  padding: 12px 15px;\n  font-weight: 600;\n  border-radius: 10px;\n  cursor: pointer; }\n\nbutton:disabled {\n  cursor: not-allowed; }\n\ninput {\n  display: block;\n  background-color: #ececec;\n  border-radius: 5px;\n  padding: 5px 10px;\n  margin: 30px auto;\n  text-align: center; }\n\nheader {\n  background-color: #4190ff;\n  padding: 10px 30px 20px;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column; }\n\n.connect-screen {\n  text-align: center;\n  padding: 100px 0px;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.7);\n  top: 0px;\n  left: 0px;\n  transition: opacity 500ms;\n  z-index: 50;\n  height: 100vh;\n  width: 100vw; }\n\n.connect-screen div {\n  background-color: white;\n  opacity: 100%;\n  width: 600px;\n  max-width: 90vw;\n  margin: 50px auto 0px;\n  padding: 30px;\n  border-radius: 25px; }\n\n.connect-screen h1 {\n  margin-bottom: 55px; }\n\n.hidden {\n  display: none; }\n\nmain {\n  text-align: center;\n  padding: 100px 0px 0px;\n  max-width: 30rem;\n  margin-inline: auto; }\n\n.home h2 {\n  font-size: larger; }\n\n.home h3 {\n  font-size: large;\n  padding-bottom: 20px;\n  margin-bottom: 30px;\n  border-bottom: 1px solid black; }\n\n.home ul {\n  padding: 0px;\n  list-style: upper-roman;\n  margin: 0px; }\n\n.home li {\n  margin: 20px 0px 0px;\n  text-decoration: underline;\n  color: #0063dc; }\n\n.assetidinput {\n  display: flex;\n  align-items: center;\n  justify-content: space-between; }\n\n.banner {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: bold;\n  font-size: 50px;\n  color: black;\n  -webkit-text-fill-color: rgba(255, 255, 255, 0);\n  /* Will override color (regardless of order) */\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #f7f7f7;\n  font-family: Arial, Helvetica, sans-serif; }\n\n.bottomBanner {\n  width: 100%; }\n\n.bannerStatus {\n  float: left;\n  display: flex;\n  align-items: center;\n  cursor: default; }\n\n.bannerStatus div {\n  display: flex;\n  align-items: center;\n  margin-right: 30px; }\n\n.connectStatus {\n  float: right;\n  display: flex;\n  align-items: center;\n  cursor: default; }\n\n.connectStatus div {\n  display: flex;\n  align-items: center;\n  margin-right: 30px; }\n\np {\n  margin: 0px; }\n\n.sideIcon {\n  fill: white;\n  margin-right: 13px; }\n\n.blockinIcon {\n  fill: white; }\n\n.logout, .login {\n  background: none;\n  color: white;\n  padding: 0px;\n  margin: 0px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  font-size: medium;\n  font-weight: 500;\n  float: right; }\n\n.closeButton {\n  background: none;\n  fill: black;\n  padding: 3px 0px 0px 0px;\n  margin: 0px 0px 20px 0px;\n  border: none;\n  float: right;\n  display: flex;\n  justify-content: flex-end;\n  width: 100%; }\n\n.connectButton {\n  display: flex;\n  margin: auto;\n  justify-content: center;\n  align-items: center; }\n\n.connectButton svg {\n  fill: black; }\n\n.foo-bar {\n  font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n  color: #005f20; }\n";
styleInject(css_248z);

// Generated with util/create-component.js
/**
 * ChainSelect - Component to handle updating the chain for multi-chain dApps. This is to be used in conjunction
 * with the SignInWithBlockin button.
 */
const ChainSelect = ({ chains, updateChain }) => {
    const [chain, setChain] = useState();
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    useEffect(() => {
        if (chains[0]) {
            handleChainChange(chains[0]);
        }
    }, []);
    const handleChainChange = (chain) => {
        setChain(chain.name);
        updateChain(chain);
    };
    return React.createElement(React.Fragment, null,
        React.createElement("b", null,
            "Current Chain: ",
            chain),
        " ",
        React.createElement("button", { onClick: () => setMenuIsVisible(!menuIsVisible) }, menuIsVisible ? 'Hide' : 'Show'),
        React.createElement("div", null, menuIsVisible && React.createElement(React.Fragment, null, chains.map(chain => {
            return React.createElement("div", { key: chain.name },
                React.createElement("button", { onClick: () => handleChainChange(chain) },
                    "Switch to Chain: ",
                    chain.name));
        }))));
};

export { ChainSelect, SignInWithBlockinButton, TestComponent };
//# sourceMappingURL=index.es.js.map
