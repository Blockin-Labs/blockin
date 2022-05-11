// Generated with util/create-component.js
import React from "react";
import { SignInWithBlockinButtonProps, PresetAsset, PresetUri, VerifyChallengeRequest } from "./SignInWithBlockinButton.types";
import "./SignInWithBlockinButton.scss";
import { createChallenge } from "../../verify";
import { useEffect, useState } from 'react';
// import { CloseIcon } from './CloseIcon';
import { getChain } from '../SupportedChains'

const buttonStyle = {
    backgroundColor: 'rgb(176, 215, 252)',
    color: 'black',
    padding: '12px 15px',
    fontWeight: 600,
    borderRadius: '10px',
    cursor: 'pointer',
}

/**
 * Gets the default selected resources from the passed-in props
 * @param assets Assets passed in as props
 * @param uris URIs passed in as props
 * @returns Array of formatted string[] resources
 */
const getDefaultSelectedResources = (assets: PresetAsset[], uris: PresetUri[]) => {
    const selectedResources = [];
    for (const asset of assets) {
        if (asset.defaultSelected) {
            selectedResources.push(`Asset ID: ${asset.assetId}`)
        }
    }

    for (const uri of uris) {
        if (uri.defaultSelected) {
            selectedResources.push(`${uri.uri}`)
        }
    }

    return selectedResources;
}

/**
 * SignInWithBlockinButton - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const SignInWithBlockinButton: React.FC<SignInWithBlockinButtonProps> = ({
    challengeParams,
    displayedAssets = [],
    displayedUris = [],
    signChallenge,
    verifyChallenge,
    generateNonce,
    currentChain,
    currentChainInfo,
    canAddCustomAssets = false,
    canAddCustomUris = false,
    customAddResourcesMessage = '',
}) => {
    const [modalIsVisible, setModalIsVisible] = useState(false);

    const [selectedResources, setSelectedResources] = useState<string[]>(getDefaultSelectedResources(displayedAssets, displayedUris));
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
    const addCustomResource = async (resource: string, isAssetID?: boolean) => {
        if (!resource) return;
        const resourceToAdd = isAssetID ? `Asset ID: ${resource}` : resource
        const newArr = [...selectedResources, resourceToAdd]
        setSelectedResources(newArr);
    }

    /**
     * Upon chain change, update chain metadata and props
     */
    useEffect(() => {
        setChain(getChain(currentChain, currentChainInfo));
    }, [currentChain]);


    return <>
        <button style={buttonStyle} onClick={() => setModalIsVisible(!modalIsVisible)}>
            Sign In with Blockin
        </button>

        {modalIsVisible && <>
            <section style={{
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
            }} >
                <div style={{
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
                }}>
                    <button onClick={() => { setModalIsVisible(!modalIsVisible) }} style={{
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
                    }}>Close</button>
                    <h1>Sign In with Blockin!</h1>
                    <img src={chain.logo} height='100px' width='auto' />

                    <h3><>{challengeParams.domain} wants you to sign in with your {chain.name} account: {challengeParams.address}</></h3>
                    <h3>{challengeParams.statement}</h3>
                    <h3>URI: {challengeParams.uri}</h3>
                    <h3>You will be authorized starting {challengeParams.notBefore ? challengeParams.notBefore : `now (${new Date().toISOString()})`} {challengeParams.expirationDate && `until ${challengeParams.expirationDate}`}</h3>
                    {!resourcesAreHidden && <>
                        {(displayedAssets.length !== 0 || displayedUris.length !== 0) && <>
                            {<h3>Select from the resources you would like to receive access to:</h3>}
                            {displayedAssets.map(elem => {
                                return <>
                                    <hr />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ textAlign: 'left', alignItems: 'center', height: '100%', marginRight: 10 }}>
                                                <img src={chain.logo} height='50px' width='auto' />
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                <b>{elem.name}</b>
                                                <br />
                                                Asset ID:{' '}
                                                <a
                                                    style={{
                                                        color: 'rgb(0, 99, 220)'
                                                    }}
                                                    href={`https://testnet.algoexplorer.io/asset/${elem.assetId}`}
                                                    target="_blank"
                                                    rel="noreferrer">
                                                    {elem.assetId}
                                                </a> - {elem.description}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            {selectedResources.includes(`Asset ID: ${elem.assetId}`) ?
                                                <button style={buttonStyle} onClick={() => {
                                                    const newArr = selectedResources.filter(resource => resource !== `Asset ID: ${elem.assetId}`)
                                                    setSelectedResources(newArr);
                                                }}
                                                    disabled={elem.frozen}>
                                                    Deselect
                                                </button> :
                                                <button style={buttonStyle} disabled={elem.frozen} onClick={() => {
                                                    const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`]
                                                    setSelectedResources(newArr);
                                                }}>
                                                    Select
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </>
                            })}


                            {displayedUris.map(elem => {
                                return <>
                                    <hr />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <div style={{ display: 'flex' }}>
                                            <div style={{ textAlign: 'left', alignItems: 'center', height: '100%', marginRight: 10 }}>
                                                <img src='https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png' height='auto' width='50px' />
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                <b>{elem.name}</b>
                                                <br />
                                                URI: {' '}
                                                <a
                                                    style={{
                                                        color: 'rgb(0, 99, 220)'
                                                    }}
                                                    href={`${elem.uri}`}
                                                    target="_blank"
                                                    rel="noreferrer">
                                                    {elem.uri}
                                                </a> - {elem.description}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {selectedResources.includes(elem.uri) ?
                                                <button disabled={elem.frozen} style={buttonStyle} onClick={() => {
                                                    const newArr = selectedResources.filter(resource => resource !== elem.uri)
                                                    setSelectedResources(newArr);
                                                }}>
                                                    Deselect
                                                </button> :
                                                <button disabled={elem.frozen} style={buttonStyle} onClick={() => {
                                                    const newArr = [...selectedResources, elem.uri]
                                                    setSelectedResources(newArr);
                                                }}>
                                                    Select
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </>
                            })}
                        </>}
                    </>}
                    {(canAddCustomAssets || canAddCustomUris) &&
                        <>
                            {<h3>You may also add custom resources below: </h3>}
                            {<h3>{customAddResourcesMessage}</h3>}

                            {canAddCustomAssets && <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <input value={assetId} type="text" placeholder='Add Asset ID #' onChange={e => setAssetId(e.target.value)} />
                                    <button
                                        onClick={async () => {
                                            await addCustomResource(assetId);
                                            setAssetId('');
                                        }}
                                    >
                                        Add Asset ID
                                    </button>
                                </div>
                            </>}

                            {canAddCustomUris && <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <input value={uri} type="text" placeholder='Add URI' onChange={e => setUri(e.target.value)} />
                                    <button
                                        onClick={async () => {
                                            await addCustomResource(uri);
                                            setUri('');
                                        }}
                                    >
                                        Add URI
                                    </button>
                                </div>
                            </>}
                        </>
                    }

                    {selectedResources && <h3>List of Selected Resources</h3>}
                    {selectedResources.map(resource => {
                        return <li>{resource}<button onClick={() => {
                            const newArr = selectedResources.filter(elem => resource !== elem)
                            setSelectedResources(newArr);
                        }}>Remove</button></li>
                    })}



                    <hr />
                    <button style={buttonStyle} onClick={async () => {
                        const nonce = generateNonce ? await generateNonce() : challengeParams.nonce;

                        const challenge = {
                            ...challengeParams,
                            resources: selectedResources,
                            nonce
                        };

                        const challengeString = await createChallenge(challenge);

                        const signChallengeResponse: VerifyChallengeRequest = await signChallenge(challengeString);
                        const { success, message } = await verifyChallenge(signChallengeResponse);

                        if (!success) {
                            setDisplayMessage(message);
                        } else {
                            setDisplayMessage('');
                            setSelectedResources([]);
                            setModalIsVisible(false);
                        }
                    }}>
                        Sign In
                    </button>
                    {displayMessage && <p>{displayMessage}</p>}

                </div>
            </section>
        </>
        }
    </>;
}

export default SignInWithBlockinButton