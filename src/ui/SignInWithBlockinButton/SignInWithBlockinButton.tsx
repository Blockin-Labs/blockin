// Generated with util/create-component.js
import React from "react";
import { SignInWithBlockinButtonProps, PresetAsset, PresetUri, VerifyChallengeOnBackendRequest } from "./SignInWithBlockinButton.types";
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

const LockIcon = () => {
    return <>{'\uD83D\uDD12'}</>
}

const Link = ({ url, text }: { url: string, text?: string }) => {
    return <a href={url} target='_blank' rel="noreferrer">{text ? text : url}</a>
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
    verifyChallengeOnBackend,
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

    const [advancedIsVisible, setAdvancedIsVisible] = useState(false);

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
        const signChallengeResponse: VerifyChallengeOnBackendRequest = await signChallenge(challengeString);

        /**
         * Verify the challenge using the passed in verifyChallenge() props function. Note that this 
         * isn't Blockin's verifyChallenge(). This should be called by your backend with an API key within
         * this function.
         * 
         * Expects { success: boolean, message: string }
         */
        const { success, message } = await verifyChallengeOnBackend(signChallengeResponse);

        /**
         * Handle success / failure
         */
        if (!success) {
            setDisplayMessage(message);
        } else {
            setDisplayMessage('');
            setSelectedResources(getDefaultSelectedResources(displayedAssets, displayedUris));
            setModalIsVisible(false);
        }
    }

    const generateHumanReadableTimeDetails = (notBefore?: string, expirationDate?: string) => {
        if (!notBefore && !expirationDate) {
            return 'This sign-in attempt has no expiration date.';
        }
        else if (notBefore && !expirationDate) {
            return `This sign-in attempt has no expiration date but is not valid until ${notBefore}.`
        }
        else if (!notBefore && expirationDate) {
            return `This sign-in attempt expires at ${expirationDate}.`
        }
        else {
            return `This sign-in attempt expires at ${expirationDate} and is not valid until ${notBefore}.`
        }
    }


    return <div className='blockin-global'>
        {/* Main Sign In Button */}
        <button className='blockin-button main-button' onClick={() => setModalIsVisible(!modalIsVisible)}>
            Sign In with Blockin
        </button>

        {/* Popup Modal Once Clicked */}
        {modalIsVisible && <>
            <div className='blockin-root' >
                <div className="blockin-popup-container">
                    <div className="blockin-popup">
                        {/* Header with the Close Button */}
                        <div className='blockin-header'>
                            <div className="header-end">

                            </div>
                            <div className="header-middle">
                                {/* Title and Chain Logo */}

                                <h1>Sign In with Blockin!</h1>
                                <div className='blockin-header-chain-info'>
                                    <div>
                                        <img src={chain.logo} height='100px' width='auto' />
                                        <h5>{chain.name}</h5>
                                    </div>
                                    <div>
                                        <b>X</b>
                                    </div>
                                    <div>
                                        <img src={'https://avatars.githubusercontent.com/u/105506360?s=200&v=4'} height='100px' width='auto' />
                                        <h5>Blockin</h5>
                                    </div>
                                </div>


                            </div>

                            <div className="header-end">
                                {/* Close Button */}
                                <button className='blockin-closebutton' onClick={() => { setModalIsVisible(!modalIsVisible) }} >
                                    {/* CloseIcon SVG */}
                                    <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Challenge Details */}
                        <div className='blockin-challenge'>
                            <hr />
                            <h3>Sign-In Details</h3>
                            <div className='blockin-challenge-details'>

                                <p><b>
                                    <Link url={challengeParams.uri} />
                                </b></p>
                                <p><b>
                                    <Link url={challengeParams.domain} /> wants you to sign in with your {chain.name} account: {<Link text={challengeParams.address} url={chain.getAddressExplorerUrl(challengeParams.address)} />}
                                </b></p>
                                <p><b>{challengeParams.statement}</b></p>
                                {challengeParams.issuedAt && <><p><b>This sign-in attempt was issued at {challengeParams.issuedAt}</b></p></>}
                                <p><b>{generateHumanReadableTimeDetails(challengeParams.notBefore, challengeParams.expirationDate)}</b></p>


                                {/* Would probably be nice to have an "Advanced" section here where the user can see all of the below fields which 99% wont understand */}
                                {/* Don't show if undefined */}
                            </div>
                            <hr />
                            <div>
                                <h3>Advanced Sign-In Details</h3>
                                <button className="blockin-button" onClick={() => setAdvancedIsVisible(!advancedIsVisible)}>
                                    {advancedIsVisible ? 'Hide' : 'Show'}
                                </button>
                                {advancedIsVisible && <div>
                                    <p><b>Nonce: {generateNonce ? 'Nonce will be generated upon clicking sign-in.' : challengeParams.nonce}</b></p>
                                    <p><b>Chain ID: {challengeParams.chainId ? challengeParams.chainId : '1 (Default)'}</b></p>
                                    <p><b>Version: {challengeParams.version ? challengeParams.version : '1 (Default)'}</b></p>
                                </div>
                                }
                            </div>
                        </div>

                        {/* Challenge Resources Preset According to Props */}
                        <div className='blockin-preset-resources'>
                            {!resourcesAreHidden && <>
                                {(displayedAssets.length !== 0 || displayedUris.length !== 0) && <>
                                    <hr />
                                    <h3>Select Resources</h3>
                                    {<p>Select the resources you would like to receive access to:</p>}

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
                                                        <Link
                                                            url={`https://testnet.algoexplorer.io/asset/${elem.assetId}`}
                                                            text={elem.assetId}
                                                        /> - {elem.description}
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
                                                            Selected {elem.frozen && <LockIcon />}
                                                        </button> :
                                                        <button
                                                            className='blockin-button'
                                                            disabled={elem.frozen}
                                                            onClick={() => {
                                                                const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`]
                                                                setSelectedResources(newArr);
                                                            }}
                                                        >
                                                            Not Selected {elem.frozen && <LockIcon />}
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
                                                            Selected {elem.frozen && <LockIcon />}
                                                        </button> :
                                                        <button className='blockin-button' disabled={elem.frozen} onClick={() => {
                                                            const newArr = [...selectedResources, elem.uri]
                                                            setSelectedResources(newArr);
                                                        }}>
                                                            Not Selected {elem.frozen && <LockIcon />}
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
                                    <hr />
                                    <h3>Add Custom Resources</h3>
                                    {<p><Link url={challengeParams.domain} /> is allowing you to add your own custom resources to this sign-in attempt below. </p>}
                                    {<p>{customAddResourcesMessage}</p>}
                                    <hr />

                                    {canAddCustomAssets && <>
                                        <div className='blockin-addcustom'>
                                            <h4>Add Custom Asset</h4>
                                            <div>
                                                <input className='blockin-input' value={assetId} type="text" placeholder='Enter Asset ID #' onChange={e => setAssetId(e.target.value)} />
                                            </div>
                                            <div>
                                                <button className='blockin-button'
                                                    onClick={async () => {
                                                        await addCustomResource(assetId, true);
                                                        setAssetId('');
                                                    }}
                                                >
                                                    Add Asset ID
                                                </button>
                                            </div>
                                        </div>
                                    </>}
                                    <hr />
                                    {canAddCustomUris && <>
                                        <div className='blockin-addcustom'>
                                            <h4>Add Custom URI</h4>
                                            <input className='blockin-input' value={uri} type="text" placeholder='Enter URI' onChange={e => setUri(e.target.value)} />
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
                            <hr />
                            {/* {console.log(selectedResources)} */}
                            {selectedResources?.length > 0 && <><h3>Summary of Selected Resources</h3><p>Please take a moment to review all your selected resources for this sign-in attempt.</p></>}
                            {/* First display selectable assets */}
                            {displayedAssets.map(elem => {
                                if (!selectedResources.includes(`Asset ID: ${elem.assetId}`)) return <></>;
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
                                                <Link
                                                    url={`https://testnet.algoexplorer.io/asset/${elem.assetId}`}
                                                    text={elem.assetId}
                                                /> - {elem.description}
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
                                                    Selected {elem.frozen && <LockIcon />}
                                                </button> :
                                                <button
                                                    className='blockin-button'
                                                    disabled={elem.frozen}
                                                    onClick={() => {
                                                        const newArr = [...selectedResources, `Asset ID: ${elem.assetId}`]
                                                        setSelectedResources(newArr);
                                                    }}
                                                >
                                                    Not Selected {elem.frozen && <LockIcon />}
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </>
                            })}

                            {/* Display selectable URIs */}
                            {displayedUris.map(elem => {
                                if (!selectedResources.includes(`${elem.uri}`)) return <></>;
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
                                                    Selected {elem.frozen && <LockIcon />}
                                                </button> :
                                                <button className='blockin-button' disabled={elem.frozen} onClick={() => {
                                                    const newArr = [...selectedResources, elem.uri]
                                                    setSelectedResources(newArr);
                                                }}>
                                                    Not Selected {elem.frozen && <LockIcon />}
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </>
                            })}

                            {selectedResources.map(resource => {
                                if (displayedAssets.find(elem => `Asset ID: ${elem.assetId}` === resource) || displayedUris.find(elem => elem.uri === resource)) return <></>;
                                return <>
                                    <hr />
                                    <div className='blockin-listitem'>
                                        {/* Metadata includes 1) chain logo, 2) asset name, 3) link to asset, and 
                                                4) desccription of asset
                                             */}
                                        <div className='blockin-listitem-metadata'>
                                            <div className='blockin-listitem-logo'>
                                                <img src='https://cdn4.iconfinder.com/data/icons/meBaze-Freebies/512/add-user.png' height='auto' width='50px' />
                                            </div>
                                            <div>
                                                <b>User Added: {resource}</b>
                                            </div>
                                        </div>
                                        {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                                fields to allow / disable selecting. */}
                                        <div className='blockin-listitem-button'>
                                            <button
                                                className='blockin-button'
                                                onClick={() => {
                                                    const newArr = selectedResources.filter(elem => resource !== elem)
                                                    setSelectedResources(newArr);
                                                }}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </>
                            })}
                        </div>




                        {/* Final Sign Challenge Button. Calls signChallenge() and verifyChallenge(). */}
                        <div className='blockin-sign-challenge-button'>
                            <hr />
                            <h3>Sign Challenge and Submit</h3>
                            <p>The last step is for you to sign the message. Once you click the button below, this site will send a signature request to your {chain.name} wallet.</p>
                            <button className='blockin-button' onClick={handleSignIn}>
                                Sign In
                            </button>

                            {displayMessage && <b><p>Oops! We ran into an error.</p><p>Error message: {displayMessage}</p></b>}

                        </div>
                    </div>
                </div>
            </div>
        </>
        }
    </div >;
}

export default SignInWithBlockinButton