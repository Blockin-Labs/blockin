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

var css_248z$1 = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\n.blockin-button {\n  background-color: #b0d7fc;\n  color: black;\n  padding: 12px 15px;\n  font-weight: 600;\n  border-radius: 10px;\n  cursor: pointer; }\n\n.blockin-button:disabled {\n  cursor: not-allowed; }\n\n.blockin-input {\n  display: block;\n  background-color: #ececec;\n  border-radius: 5px;\n  padding: 5px 10px;\n  margin: 30px auto;\n  text-align: center; }\n\n.blockin-closebutton {\n  background: none;\n  fill: black;\n  padding: 3px 0px 0px 0px;\n  margin: 0px 0px 20px 0px;\n  border: none;\n  float: right;\n  display: flex;\n  justify-content: flex-end;\n  width: 100%;\n  cursor: pointer; }\n\n.blockin-root {\n  text-align: center;\n  padding: 100px 0px;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.7);\n  top: 0;\n  left: 0;\n  transition: opacity 500ms;\n  z-index: 50;\n  min-height: 100vh;\n  min-width: 100vw; }\n\n.blockin-popup {\n  word-wrap: break-word;\n  background-color: white;\n  opacity: 100%;\n  width: 600px;\n  height: 600px;\n  max-width: 90vw;\n  margin: 0 auto 0px;\n  padding: 30px;\n  border-radius: 25px;\n  overflow-y: auto;\n  scrollbar-width: none; }\n\n.blockin-listitem {\n  display: flex;\n  justify-content: space-between;\n  align-items: center; }\n\n.blockin-listitem-metadata {\n  display: flex;\n  text-align: left;\n  align-items: center;\n  height: 100%; }\n\n.blockin-listitem-button {\n  display: flex;\n  text-align: right;\n  align-items: center;\n  height: 100%; }\n\n.blockin-listitem-logo {\n  margin-right: 10px; }\n\n.foo-bar {\n  font-family: \"Avenir Next\", Helvetica, Arial, sans-serif;\n  color: #005f20; }\n";
styleInject(css_248z$1);

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

/*
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
    /**
     * Handles a user clicking the sign in button on the popup modal.
     */
    const handleSignIn = () => __awaiter(void 0, void 0, void 0, function* () {
        /**
         * Generate the challenge object by attempting to call generateNonce() and inputting
         * the selectedResources
         */
        const nonce = generateNonce ? yield generateNonce() : challengeParams.nonce;
        const challenge = Object.assign(Object.assign({}, challengeParams), { resources: selectedResources, nonce });
        /**
         * Call Blockin to create the challenge string.
         */
        const challengeString = yield createChallenge(challenge);
        /**
         * Sign the challenge using the passed in signChallenge() props function
         *
         * Expects { originalBytes: Uint8Array, signatureBytes: Uint8Array }
         */
        const signChallengeResponse = yield signChallenge(challengeString);
        /**
         * Verify the challenge using the passed in verifyChallenge() props function. Note that this
         * isn't Blockin's verifyChallenge(). This should be called by your backend with an API key within
         * this function.
         *
         * Expects { success: boolean, message: string }
         */
        const { success, message } = yield verifyChallenge(signChallengeResponse);
        /**
         * Handle success / failure
         */
        if (!success) {
            setDisplayMessage(message);
        }
        else {
            setDisplayMessage('');
            setSelectedResources([]);
            setModalIsVisible(false);
        }
    });
    return React.createElement(React.Fragment, null,
        React.createElement("button", { className: 'blockin-button', onClick: () => setModalIsVisible(!modalIsVisible) }, "Sign In with Blockin"),
        modalIsVisible && React.createElement(React.Fragment, null,
            React.createElement("section", { className: 'blockin-root' },
                React.createElement("div", { className: "blockin-popup" },
                    React.createElement("header", { className: 'blockin-header' },
                        React.createElement("button", { className: 'blockin-closebutton', onClick: () => { setModalIsVisible(!modalIsVisible); } },
                            React.createElement("svg", { width: 25, height: 25, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 320 512" },
                                React.createElement("path", { d: "M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" }))),
                        React.createElement("section", null,
                            React.createElement("h1", null, "Sign In with Blockin!"),
                            React.createElement("img", { src: chain.logo, height: '100px', width: 'auto' }))),
                    React.createElement("div", { className: 'blockin-challenge' },
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
                        React.createElement("h3", null,
                            "Issued At: ",
                            challengeParams.issuedAt),
                        React.createElement("h3", null,
                            "Nonce: ",
                            challengeParams.nonce),
                        React.createElement("h3", null,
                            "Chain ID: ",
                            challengeParams.chainId),
                        React.createElement("h3", null,
                            "Version: ",
                            challengeParams.version)),
                    React.createElement("div", { className: 'blockin-preset-resources' }, !resourcesAreHidden && React.createElement(React.Fragment, null, (displayedAssets.length !== 0 || displayedUris.length !== 0) && React.createElement(React.Fragment, null,
                        React.createElement("h3", null, "Select from the resources you would like to receive access to:"),
                        displayedAssets.map(elem => {
                            return React.createElement(React.Fragment, null,
                                React.createElement("hr", null),
                                React.createElement("div", { className: 'blockin-listitem' },
                                    React.createElement("div", { className: 'blockin-listitem-metadata' },
                                        React.createElement("div", { className: 'blockin-listitem-logo' },
                                            React.createElement("img", { src: chain.logo, height: '50px', width: 'auto' })),
                                        React.createElement("div", null,
                                            React.createElement("b", null, elem.name),
                                            React.createElement("br", null),
                                            "Asset ID:",
                                            ' ',
                                            React.createElement("a", { href: `https://testnet.algoexplorer.io/asset/${elem.assetId}`, target: "_blank", rel: "noreferrer" }, elem.assetId),
                                            " - ",
                                            elem.description)),
                                    React.createElement("div", { className: 'blockin-listitem-button' }, selectedResources.includes(`Asset ID: ${elem.assetId}`) ?
                                        React.createElement("button", { className: 'blockin-button', onClick: () => {
                                                const newArr = selectedResources.filter(resource => resource !== `Asset ID: ${elem.assetId}`);
                                                setSelectedResources(newArr);
                                            }, disabled: elem.frozen }, "Deselect") :
                                        React.createElement("button", { className: 'blockin-button', disabled: elem.frozen, onClick: () => {
                                                const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`];
                                                setSelectedResources(newArr);
                                            } }, "Select"))));
                        }),
                        displayedUris.map(elem => {
                            return React.createElement(React.Fragment, null,
                                React.createElement("hr", null),
                                React.createElement("div", { className: 'blockin-listitem' },
                                    React.createElement("div", { className: 'blockin-listitem-metadata' },
                                        React.createElement("div", { className: 'blockin-listitem-logo' },
                                            React.createElement("img", { src: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png', height: 'auto', width: '50px' })),
                                        React.createElement("div", null,
                                            React.createElement("b", null, elem.name),
                                            React.createElement("br", null),
                                            "URI: ",
                                            ' ',
                                            React.createElement("a", { href: `${elem.uri}`, target: "_blank", rel: "noreferrer" }, elem.uri),
                                            " - ",
                                            elem.description)),
                                    React.createElement("div", { className: 'blockin-listitem-button' }, selectedResources.includes(elem.uri) ?
                                        React.createElement("button", { className: 'blockin-button', disabled: elem.frozen, onClick: () => {
                                                const newArr = selectedResources.filter(resource => resource !== elem.uri);
                                                setSelectedResources(newArr);
                                            } }, "Deselect") :
                                        React.createElement("button", { className: 'blockin-button', disabled: elem.frozen, onClick: () => {
                                                const newArr = [...selectedResources, elem.uri];
                                                setSelectedResources(newArr);
                                            } }, "Select"))));
                        })))),
                    React.createElement("div", { className: 'blockin-custom-add-resources' }, (canAddCustomAssets || canAddCustomUris) &&
                        React.createElement(React.Fragment, null,
                            React.createElement("h3", null, "You may also add custom resources below: "),
                            React.createElement("h3", null, customAddResourcesMessage),
                            canAddCustomAssets && React.createElement(React.Fragment, null,
                                React.createElement("div", { className: 'blockin-listitem' },
                                    React.createElement("input", { className: 'blockin-input', value: assetId, type: "text", placeholder: 'Add Asset ID #', onChange: e => setAssetId(e.target.value) }),
                                    React.createElement("button", { className: 'blockin-button', onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                            yield addCustomResource(assetId, true);
                                            setAssetId('');
                                        }) }, "Add Asset ID"))),
                            canAddCustomUris && React.createElement(React.Fragment, null,
                                React.createElement("div", { className: 'blockin-listitem' },
                                    React.createElement("input", { className: 'blockin-input', value: uri, type: "text", placeholder: 'Add URI', onChange: e => setUri(e.target.value) }),
                                    React.createElement("button", { className: 'blockin-button', onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                            yield addCustomResource(uri);
                                            setUri('');
                                        }) }, "Add URI"))))),
                    React.createElement("div", { className: 'blockin-selected-resources-summary' },
                        selectedResources && React.createElement("h3", null, "List of Selected Resources"),
                        selectedResources.map(resource => {
                            return React.createElement("li", null,
                                resource,
                                React.createElement("button", { className: 'blockin-button', onClick: () => {
                                        const newArr = selectedResources.filter(elem => resource !== elem);
                                        setSelectedResources(newArr);
                                    } }, "Remove"));
                        })),
                    React.createElement("hr", null),
                    React.createElement("div", { className: 'blockin-sign-challenge-button' },
                        React.createElement("button", { className: 'blockin-button', onClick: handleSignIn }, "Sign In"),
                        displayMessage && React.createElement("p", null, displayMessage))))));
};

var css_248z = ":root {\n  --background: #fff;\n  --font-color: #494949; }\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #3c3c3c;\n    --font-color: #fafafa; } }\n\n.blockin-button {\n  background-color: #b0d7fc;\n  color: black;\n  padding: 12px 15px;\n  font-weight: 600;\n  border-radius: 10px;\n  cursor: pointer; }\n\n.blockin-button:disabled {\n  cursor: not-allowed; }\n\n.blockin-input {\n  display: block;\n  background-color: #ececec;\n  border-radius: 5px;\n  padding: 5px 10px;\n  margin: 30px auto;\n  text-align: center; }\n\n.blockin-closebutton {\n  background: none;\n  fill: black;\n  padding: 3px 0px 0px 0px;\n  margin: 0px 0px 20px 0px;\n  border: none;\n  float: right;\n  display: flex;\n  justify-content: flex-end;\n  width: 100%;\n  cursor: pointer; }\n\n.blockin-root {\n  text-align: center;\n  padding: 100px 0px;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.7);\n  top: 0;\n  left: 0;\n  transition: opacity 500ms;\n  z-index: 50;\n  min-height: 100vh;\n  min-width: 100vw; }\n\n.blockin-popup {\n  word-wrap: break-word;\n  background-color: white;\n  opacity: 100%;\n  width: 600px;\n  height: 600px;\n  max-width: 90vw;\n  margin: 0 auto 0px;\n  padding: 30px;\n  border-radius: 25px;\n  overflow-y: auto;\n  scrollbar-width: none; }\n\n.blockin-listitem {\n  display: flex;\n  justify-content: space-between;\n  align-items: center; }\n\n.blockin-listitem-metadata {\n  display: flex;\n  text-align: left;\n  align-items: center;\n  height: 100%; }\n\n.blockin-listitem-button {\n  display: flex;\n  text-align: right;\n  align-items: center;\n  height: 100%; }\n\n.blockin-listitem-logo {\n  margin-right: 10px; }\n";
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
        React.createElement("button", { className: 'blockin-button', onClick: () => setMenuIsVisible(!menuIsVisible) }, menuIsVisible ? 'Hide' : 'Show'),
        React.createElement("div", null, menuIsVisible && React.createElement(React.Fragment, null, chains.map(chain => {
            return React.createElement("div", { key: chain.name },
                React.createElement("button", { className: 'blockin-button', onClick: () => handleChainChange(chain) },
                    "Switch to Chain: ",
                    chain.name));
        }))));
};

export { ChainSelect, SignInWithBlockinButton };
//# sourceMappingURL=index.js.map
