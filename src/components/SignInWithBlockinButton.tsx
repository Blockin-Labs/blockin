


import { AlgoDriver, createChallenge, setChainDriver } from '../index';
import { useEffect, useState } from 'react';
import { ChallengeParams } from '../@types/verify';
import { ChallengeResponse, PresetAsset, PresetUri, SupportedChain } from '../@types/SignInWithBlockinButton';

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
        driver: new AlgoDriver(),
        name: 'Ethereum',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png'
    },
    'Algorand': {
        driver: new AlgoDriver(),
        name: 'Algorand',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png'
    }
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

export const SignInWithBlockinButton = ({
    challengeParams,


    hideResources = false,
    displayedAssets = [],
    displayedUris = [],
    signAndVerifyChallenge,
    generateNonce,
    currentChain,
    currentChainInfo,
    useBlockTimestampsForNonce = false,
    // canAddCustomAssets,
    // canAddCustomUris,
    // canSetExpirationDate,
    // canSetNotBeforeDate,
}: {
    challengeParams: ChallengeParams,


    hideResources?: boolean,
    currentChain: string,
    displayedAssets: PresetAsset[],
    displayedUris: PresetUri[],
    signAndVerifyChallenge: (challenge: string) => Promise<ChallengeResponse>
    generateNonce?: () => Promise<string>,
    useBlockTimestampsForNonce?: boolean,
    currentChainInfo?: SupportedChain,

    // canAddCustomAssets: boolean,
    // canAddCustomUris: boolean,
    // canSetExpirationDate: boolean,
    // canSetNotBeforeDate: boolean,
}) => {

    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [selectedResources, setSelectedResources] = useState<string[]>(getSelectedResources(displayedAssets, displayedUris));
    const [displayMessage, setDisplayMessage] = useState('');
    const [chain, setChain] = useState(getChain(currentChain, currentChainInfo));

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
                    }}><CloseIcon /></button>
                    <h1>Sign In with Blockin!</h1>
                    <img src={chain.logo} height='100px' width='auto' />

                    <h3><>{challengeParams.domain} wants you to sign in with your {chain.name} account: {challengeParams.address}</></h3>
                    <h3>{challengeParams.statement}</h3>
                    <h3>URI: {challengeParams.uri}</h3>
                    <h3>You will be authorized starting {challengeParams.notBefore ? challengeParams.notBefore : `now (${new Date().toISOString()})`} {challengeParams.expirationDate && `until ${challengeParams.expirationDate}`}</h3>
                    {!hideResources && <>
                        {<h3>Select below the resources you would like to receive access to:</h3>}
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

                    <hr />
                    <button style={buttonStyle} onClick={async () => {
                        setChainDriver(chain.driver);
                        const nonce = generateNonce ? await generateNonce() : '';

                        const challenge = {
                            ...challengeParams,
                            resources: selectedResources,
                            nonce,
                        };

                        const challengeString = await createChallenge(challenge, { useBlockTimestampsForNonce });

                        const { success, message } = await signAndVerifyChallenge(challengeString);

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

