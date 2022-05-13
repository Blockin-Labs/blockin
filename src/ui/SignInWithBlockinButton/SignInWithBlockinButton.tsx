// Generated with util/create-component.js
import React from "react";
import { SignInWithBlockinButtonProps, PresetAsset, PresetUri, VerifyChallengeRequest } from "./SignInWithBlockinButton.types";
import "./SignInWithBlockinButton.scss";
import { createChallenge } from "../../verify";
import { useEffect, useState } from 'react';
import { getChain } from '../SupportedChains'

/*
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

    /**
     * Handles a user clicking the sign in button on the popup modal.
     */
    const handleSignIn = async () => {
        /**
         * Generate the challenge object by attempting to call generateNonce() and inputting
         * the selectedResources
         */
        const nonce = generateNonce ? await generateNonce() : challengeParams.nonce;
        const challenge = {
            ...challengeParams,
            resources: selectedResources,
            nonce
        };

        /**
         * Call Blockin to create the challenge string.
         */
        const challengeString = await createChallenge(challenge);

        /**
         * Sign the challenge using the passed in signChallenge() props function
         * 
         * Expects { originalBytes: Uint8Array, signatureBytes: Uint8Array }
         */
        const signChallengeResponse: VerifyChallengeRequest = await signChallenge(challengeString);

        /**
         * Verify the challenge using the passed in verifyChallenge() props function. Note that this 
         * isn't Blockin's verifyChallenge(). This should be called by your backend with an API key within
         * this function.
         * 
         * Expects { success: boolean, message: string }
         */
        const { success, message } = await verifyChallenge(signChallengeResponse);

        /**
         * Handle success / failure
         */
        if (!success) {
            setDisplayMessage(message);
        } else {
            setDisplayMessage('');
            setSelectedResources([]);
            setModalIsVisible(false);
        }
    }


    return <>
        {/* Main Sign In Button */}
        <button className='blockin-button' onClick={() => setModalIsVisible(!modalIsVisible)}>
            Sign In with Blockin
        </button>

        {/* Popup Modal Once Clicked */}
        {modalIsVisible && <>
            <section className='blockin-root' >
                <div className="blockin-popup">
                    {/* Header with the Close Button */}
                    <header className='blockin-header'>
                        {/* Close Button */}
                        <button className='blockin-closebutton' onClick={() => { setModalIsVisible(!modalIsVisible) }} >
                            {/* CloseIcon SVG */}
                            <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                            </svg>
                        </button>

                        {/* Title and Chain Logo */}
                        <section>
                            <h1>Sign In with Blockin!</h1>
                            <img src={chain.logo} height='100px' width='auto' />
                        </section>
                    </header>

                    {/* Challenge Details */}
                    <div className='blockin-challenge'>
                        <h3><>{challengeParams.domain} wants you to sign in with your {chain.name} account: {challengeParams.address}</></h3>
                        <h3>{challengeParams.statement}</h3>
                        <h3>URI: {challengeParams.uri}</h3>
                        <h3>You will be authorized starting {challengeParams.notBefore ? challengeParams.notBefore : `now (${new Date().toISOString()})`} {challengeParams.expirationDate && `until ${challengeParams.expirationDate}`}</h3>
                        <h3>Issued At: {challengeParams.issuedAt}</h3>

                        {/* Would probably be nice to have an "Advanced" section here where the user can see all of the below fields which 99% wont understand */}
                        {/* Don't show if undefined */}
                        <h3>Nonce: {challengeParams.nonce}</h3>
                        <h3>Chain ID: {challengeParams.chainId}</h3>
                        <h3>Version: {challengeParams.version}</h3>
                    </div>

                    {/* Challenge Resources Preset According to Props */}
                    <div className='blockin-preset-resources'>
                        {!resourcesAreHidden && <>
                            {(displayedAssets.length !== 0 || displayedUris.length !== 0) && <>
                                {<h3>Select from the resources you would like to receive access to:</h3>}

                                {/* First display selectable assets */}
                                {displayedAssets.map(elem => {
                                    return <>
                                        <hr />
                                        <div className='blockin-listitem'>
                                            {/* Metadata includes 1) chain logo, 2) asset name, 3) link to asset, and 
                                                4) desccription of asset
                                             */}
                                            <div className='blockin-listitem-metadata'>
                                                <div className='blockin-listitem-logo'>
                                                    <img src={chain.logo} height='50px' width='auto' />
                                                </div>
                                                <div>
                                                    <b>{elem.name}</b>
                                                    <br />
                                                    Asset ID:{' '}
                                                    <a
                                                        href={`https://testnet.algoexplorer.io/asset/${elem.assetId}`}
                                                        target="_blank"
                                                        rel="noreferrer">
                                                        {elem.assetId}
                                                    </a> - {elem.description}
                                                </div>
                                            </div>

                                            {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                                fields to allow / disable selecting. */}
                                            <div className='blockin-listitem-button'>
                                                {selectedResources.includes(`Asset ID: ${elem.assetId}`) ?
                                                    <button
                                                        className='blockin-button'
                                                        onClick={() => {
                                                            const newArr = selectedResources.filter(resource => resource !== `Asset ID: ${elem.assetId}`)
                                                            setSelectedResources(newArr);
                                                        }}
                                                        disabled={elem.frozen}
                                                    >
                                                        Deselect
                                                    </button> :
                                                    <button
                                                        className='blockin-button'
                                                        disabled={elem.frozen}
                                                        onClick={() => {
                                                            const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`]
                                                            setSelectedResources(newArr);
                                                        }}
                                                    >
                                                        Select
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </>
                                })}

                                {/* Display selectable URIs */}
                                {displayedUris.map(elem => {
                                    return <>
                                        <hr />
                                        <div className='blockin-listitem'>
                                            {/* Metadata includes 1) chain logo, 2) asset name, 3) link to asset, and 
                                                4) desccription of asset
                                             */}
                                            <div className='blockin-listitem-metadata'>
                                                <div className='blockin-listitem-logo'>
                                                    <img src='https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png' height='auto' width='50px' />
                                                </div>
                                                <div>
                                                    <b>{elem.name}</b>
                                                    <br />
                                                    URI: {' '}
                                                    <a
                                                        href={`${elem.uri}`}
                                                        target="_blank"
                                                        rel="noreferrer">
                                                        {elem.uri}
                                                    </a> - {elem.description}
                                                </div>
                                            </div>
                                            {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                                fields to allow / disable selecting. */}
                                            <div className='blockin-listitem-button'>
                                                {selectedResources.includes(elem.uri) ?
                                                    <button className='blockin-button' disabled={elem.frozen} onClick={() => {
                                                        const newArr = selectedResources.filter(resource => resource !== elem.uri)
                                                        setSelectedResources(newArr);
                                                    }}>
                                                        Deselect
                                                    </button> :
                                                    <button className='blockin-button' disabled={elem.frozen} onClick={() => {
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
                    </div>

                    {/* Section where user can add custom resources to challenge, if allowed */}
                    <div className='blockin-custom-add-resources'>
                        {(canAddCustomAssets || canAddCustomUris) &&
                            <>
                                {<h3>You may also add custom resources below: </h3>}
                                {<h3>{customAddResourcesMessage}</h3>}

                                {canAddCustomAssets && <>
                                    <div className='blockin-listitem'>
                                        <input className='blockin-input' value={assetId} type="text" placeholder='Add Asset ID #' onChange={e => setAssetId(e.target.value)} />
                                        <button className='blockin-button'
                                            onClick={async () => {
                                                await addCustomResource(assetId, true);
                                                setAssetId('');
                                            }}
                                        >
                                            Add Asset ID
                                        </button>
                                    </div>
                                </>}

                                {canAddCustomUris && <>
                                    <div className='blockin-listitem'>
                                        <input className='blockin-input' value={uri} type="text" placeholder='Add URI' onChange={e => setUri(e.target.value)} />
                                        <button className='blockin-button'
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
                    </div>

                    {/* Here, we display a complete list of all the selected resources for the challenge */}
                    <div className='blockin-selected-resources-summary'>
                        {selectedResources && <h3>List of Selected Resources</h3>}
                        {selectedResources.map(resource => {
                            return <li>{resource}<button className='blockin-button' onClick={() => {
                                const newArr = selectedResources.filter(elem => resource !== elem)
                                setSelectedResources(newArr);
                            }}>Remove</button></li>
                        })}
                    </div>


                    <hr />

                    {/* Final Sign Challenge Button. Calls signChallenge() and verifyChallenge(). */}
                    <div className='blockin-sign-challenge-button'>
                        <button className='blockin-button' onClick={handleSignIn}>
                            Sign In
                        </button>
                        {displayMessage && <p>{displayMessage}</p>}

                    </div>
                </div>
            </section>
        </>
        }
    </>;
}

export default SignInWithBlockinButton