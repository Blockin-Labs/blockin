import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getChain } from '../../ChainDrivers/SupportedChains';
import { createChallenge } from '../../verify';
import './SignInWithBlockinButton.css';
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
export const SignInWithBlockinButton = ({ challengeParams, displayedAssets = [], displayedUris = [], signChallenge, verifyChallenge, generateNonce, currentChain, currentChainInfo, canAddCustomAssets = false, canAddCustomUris = false, customAddResourcesMessage = '', }) => {
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
    const addCustomResource = async (resource, isAssetID) => {
        if (!resource)
            return;
        const resourceToAdd = isAssetID ? `Asset ID: ${resource}` : resource;
        const newArr = [...selectedResources, resourceToAdd];
        setSelectedResources(newArr);
    };
    /**
     * Upon chain change, update chain metadata and props
     */
    useEffect(() => {
        setChain(getChain(currentChain, currentChainInfo));
    }, [currentChain]);
    return _jsxs(_Fragment, { children: [_jsx("button", Object.assign({ style: buttonStyle, onClick: () => setModalIsVisible(!modalIsVisible) }, { children: "Sign In with Blockin" })), modalIsVisible && _jsx(_Fragment, { children: _jsx("section", Object.assign({ style: {
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
                    } }, { children: _jsxs("div", Object.assign({ style: {
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
                        } }, { children: [_jsx("button", Object.assign({ onClick: () => { setModalIsVisible(!modalIsVisible); }, style: {
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
                                } }, { children: "Close" })), _jsx("h1", { children: "Sign In with Blockin!" }), _jsx("img", { src: chain.logo, height: '100px', width: 'auto' }), _jsx("h3", { children: _jsxs(_Fragment, { children: [challengeParams.domain, " wants you to sign in with your ", chain.name, " account: ", challengeParams.address] }) }), _jsx("h3", { children: challengeParams.statement }), _jsxs("h3", { children: ["URI: ", challengeParams.uri] }), _jsxs("h3", { children: ["You will be authorized starting ", challengeParams.notBefore ? challengeParams.notBefore : `now (${new Date().toISOString()})`, " ", challengeParams.expirationDate && `until ${challengeParams.expirationDate}`] }), !resourcesAreHidden && _jsx(_Fragment, { children: (displayedAssets.length !== 0 || displayedUris.length !== 0) && _jsxs(_Fragment, { children: [_jsx("h3", { children: "Select from the resources you would like to receive access to:" }), displayedAssets.map(elem => {
                                            return _jsxs(_Fragment, { children: [_jsx("hr", {}), _jsxs("div", Object.assign({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, { children: [_jsxs("div", Object.assign({ style: { display: 'flex' } }, { children: [_jsx("div", Object.assign({ style: { textAlign: 'left', alignItems: 'center', height: '100%', marginRight: 10 } }, { children: _jsx("img", { src: chain.logo, height: '50px', width: 'auto' }) })), _jsxs("div", Object.assign({ style: { textAlign: 'left' } }, { children: [_jsx("b", { children: elem.name }), _jsx("br", {}), "Asset ID:", ' ', _jsx("a", Object.assign({ style: {
                                                                                    color: 'rgb(0, 99, 220)'
                                                                                }, href: `https://testnet.algoexplorer.io/asset/${elem.assetId}`, target: "_blank", rel: "noreferrer" }, { children: elem.assetId })), " - ", elem.description] }))] })), _jsx("div", Object.assign({ style: { textAlign: 'right' } }, { children: selectedResources.includes(`Asset ID: ${elem.assetId}`) ?
                                                                    _jsx("button", Object.assign({ style: buttonStyle, onClick: () => {
                                                                            const newArr = selectedResources.filter(resource => resource !== `Asset ID: ${elem.assetId}`);
                                                                            setSelectedResources(newArr);
                                                                        }, disabled: elem.frozen }, { children: "Deselect" })) :
                                                                    _jsx("button", Object.assign({ style: buttonStyle, disabled: elem.frozen, onClick: () => {
                                                                            const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`];
                                                                            setSelectedResources(newArr);
                                                                        } }, { children: "Select" })) }))] }))] });
                                        }), displayedUris.map(elem => {
                                            return _jsxs(_Fragment, { children: [_jsx("hr", {}), _jsxs("div", Object.assign({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, { children: [_jsxs("div", Object.assign({ style: { display: 'flex' } }, { children: [_jsx("div", Object.assign({ style: { textAlign: 'left', alignItems: 'center', height: '100%', marginRight: 10 } }, { children: _jsx("img", { src: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png', height: 'auto', width: '50px' }) })), _jsxs("div", Object.assign({ style: { textAlign: 'left' } }, { children: [_jsx("b", { children: elem.name }), _jsx("br", {}), "URI: ", ' ', _jsx("a", Object.assign({ style: {
                                                                                    color: 'rgb(0, 99, 220)'
                                                                                }, href: `${elem.uri}`, target: "_blank", rel: "noreferrer" }, { children: elem.uri })), " - ", elem.description] }))] })), _jsx("div", Object.assign({ style: { textAlign: 'right' } }, { children: selectedResources.includes(elem.uri) ?
                                                                    _jsx("button", Object.assign({ disabled: elem.frozen, style: buttonStyle, onClick: () => {
                                                                            const newArr = selectedResources.filter(resource => resource !== elem.uri);
                                                                            setSelectedResources(newArr);
                                                                        } }, { children: "Deselect" })) :
                                                                    _jsx("button", Object.assign({ disabled: elem.frozen, style: buttonStyle, onClick: () => {
                                                                            const newArr = [...selectedResources, elem.uri];
                                                                            setSelectedResources(newArr);
                                                                        } }, { children: "Select" })) }))] }))] });
                                        })] }) }), (canAddCustomAssets || canAddCustomUris) &&
                                _jsxs(_Fragment, { children: [_jsx("h3", { children: "You may also add custom resources below: " }), _jsx("h3", { children: customAddResourcesMessage }), canAddCustomAssets && _jsx(_Fragment, { children: _jsxs("div", Object.assign({ style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                } }, { children: [_jsx("input", { value: assetId, type: "text", placeholder: 'Add Asset ID #', onChange: e => setAssetId(e.target.value) }), _jsx("button", Object.assign({ onClick: async () => {
                                                            await addCustomResource(assetId);
                                                            setAssetId('');
                                                        } }, { children: "Add Asset ID" }))] })) }), canAddCustomUris && _jsx(_Fragment, { children: _jsxs("div", Object.assign({ style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                } }, { children: [_jsx("input", { value: uri, type: "text", placeholder: 'Add URI', onChange: e => setUri(e.target.value) }), _jsx("button", Object.assign({ onClick: async () => {
                                                            await addCustomResource(uri);
                                                            setUri('');
                                                        } }, { children: "Add URI" }))] })) })] }), selectedResources && _jsx("h3", { children: "List of Selected Resources" }), selectedResources.map(resource => {
                                return _jsxs("li", { children: [resource, _jsx("button", Object.assign({ onClick: () => {
                                                const newArr = selectedResources.filter(elem => resource !== elem);
                                                setSelectedResources(newArr);
                                            } }, { children: "Remove" }))] });
                            }), _jsx("hr", {}), _jsx("button", Object.assign({ style: buttonStyle, onClick: async () => {
                                    const nonce = generateNonce ? await generateNonce() : challengeParams.nonce;
                                    const challenge = Object.assign(Object.assign({}, challengeParams), { resources: selectedResources, nonce });
                                    const challengeString = await createChallenge(challenge);
                                    // const challengeString = '';
                                    const signChallengeResponse = await signChallenge(challengeString);
                                    const { success, message } = await verifyChallenge(signChallengeResponse);
                                    if (!success) {
                                        setDisplayMessage(message);
                                    }
                                    else {
                                        setDisplayMessage('');
                                        setSelectedResources([]);
                                        setModalIsVisible(false);
                                    }
                                } }, { children: "Sign In" })), displayMessage && _jsx("p", { children: displayMessage })] })) })) })] });
};
