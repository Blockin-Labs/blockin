


import { createChallenge } from '../index';
import { useEffect, useState } from 'react';
import { ChallengeParams } from '../@types/verify';
import { ChallengeResponse, PresetAsset, PresetUri, SupportedChain, VerifyChallengeRequest } from '../@types/SignInWithBlockinButton';

const CloseIcon = () => {
    return (
        <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
        </svg>
    )
}

const buttonStyle = {
    backgroundColor: 'rgb(176, 215, 252)',
    color: 'black',
    padding: '12px 15px',
    fontWeight: 600,
    borderRadius: '10px',
    cursor: 'pointer',
}

const supportedChainMap: any = {
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
}

const getChain = (chainName: string, currentChainInfo?: SupportedChain) => {
    if (currentChainInfo) return currentChainInfo;
    else return supportedChainMap[chainName];
}

const getSelectedResources = (assets: PresetAsset[], uris: PresetUri[]) => {
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
 * challengeParams - EIP-4361 params that will make up the challenge. See ChallengeParams type.
 * displayedAssets - Assets to be displayed as resource options to sign-in with. See PresetAsset type.
 * displayedUris - Uris to be displayed as resource options to sign-inn with. See PresetUri type.
 * signChallenge - Blockin doesn't handle any signing functionality. When user clicks sign-in, it will call this
 * function which is passed in as a prop. Expects a return value that is consistent with the VerifyChallengeRequest 
 * type.
 * verifyChallenge - This is where you perform the following: 1) call Blockin's verifyChallenge() within your backend,
 * 2) include any other additional verification checks about the challenge (like nonce verification if using a custom scheme 
 * or assert anything else about the challenge details that should be expected ), 3) if verification passes, update whatever is
 * needed on frontend and backend to authenticate the user. Expects a response consistent with the ChallengeResponse type. 
 * Note that we do this because for verification, you must have a valid API key and ChainDriver which is only accessible
 * via the authorizing resource's backend.
 * generateNonce - To generate a valid challenge, you must specify a nonce. This can either be done by specifying it in
 * challengeParams or via this function which returns a nonce string. This prop is optional, but if defined, we will 
 * use this for the nonce and override challengeParams. You may choose to implement your own custom nonce scheme, or Blockin
 * natively suports using block timestamps for the nonces with the generateNonceWithLastBlockTimestamp() function (this must be
 * called from a backend with a ChainDriver set). Any scheme must be checked and verified in verifyChallenge() (see the
 * VerifyChallenge options for natively checking this if block timestamps are used). If you use your own custom nonce generation
 * scheme here, you will also have to use and implement your own nonce verification scheme in verifyChallenge().
 * currentChain - String name of current selected chain to use. There are a few chains that are preset as supported chains. If
 * currentChain does not match any of the supported chains, you must specify currentChainInfo to provide metadata about the chain.
 * currentChainInfo - This must be defined if currentChain is not in the preset supported chains. See the SupportedChain type.
 * canAddCustomAssets - Defaults to false. If set to true, user can add custom asset IDs to the challenge. Is useful if you grant
 * privileges based on metadata and not a specific asset ID, for example.
 * canAddCustomUris - Defaults to false. If set to true, user can add custom asset URIs to the challenge.
 * customAddResourcesMessage - This is for a helper message that is used if a user can add custom resources. This should explain
 * what assets or uris will be accepted, what permissions they will grant, etc. For example, here is where you may explain that 
 * 'if asset with metadata hash === X is added, then privilege X will be granted'
 */
export const SignInWithBlockinButton = ({
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
    customAddResourcesMessage,
}: {
    challengeParams: ChallengeParams,
    currentChain: string,
    displayedAssets: PresetAsset[],
    displayedUris: PresetUri[],
    signChallenge: (challenge: string) => Promise<VerifyChallengeRequest>,
    verifyChallenge: (verifyRequest: VerifyChallengeRequest) => Promise<ChallengeResponse>,
    generateNonce?: () => Promise<string>,

    currentChainInfo?: SupportedChain,
    canAddCustomAssets?: boolean,
    canAddCustomUris?: boolean,
    customAddResourcesMessage?: string
    // canSetExpirationDate: boolean,
    // canSetNotBeforeDate: boolean,
}) => {

    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [selectedResources, setSelectedResources] = useState<string[]>(getSelectedResources(displayedAssets, displayedUris));
    const [displayMessage, setDisplayMessage] = useState('');
    const [chain, setChain] = useState(getChain(currentChain, currentChainInfo));

    const [assetId, setAssetId] = useState('');
    const [uri, setUri] = useState('');

    //adds a resource to the challenge (selectedResources)
    const addCustomResource = async (resource: string, isAssetID?: boolean) => {
        if (!resource) return;
        const resourceToAdd = isAssetID ? `Asset ID: ${resource}` : resource
        const newArr = [...selectedResources, resourceToAdd]
        setSelectedResources(newArr);
    }

    useEffect(() => {
        setChain(getChain(currentChain, currentChainInfo));
    }, [currentChain]);

    const resourcesAreHidden = displayedAssets.length == 0 && displayedUris.length == 0 && !canAddCustomAssets && !canAddCustomUris;

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
                    }}><CloseIcon /></button>
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

