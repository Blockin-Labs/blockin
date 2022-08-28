// Generated with util/create-component.js
import React from "react";
import { BlockinUIDisplayProps, SupportedChainMetadata } from "./BlockinUIDisplay.types";
import "./BlockinUIDisplay.scss";
import { useEffect, useState } from 'react';
import { getChain } from '../SupportedChains'
import ChainSelect from '../ChainSelect';
import Blockies from 'react-blockies';
import SignInModal from "../SignInModal";

const Link = ({ url, text }: { url: string, text?: string }) => {
    return <a href={url} target='_blank' rel="noreferrer">{text ? text : url}</a>
}

/**
 * BlockinUIDisplay - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const BlockinUIDisplay: React.FC<BlockinUIDisplayProps> = ({
    challengeParams,
    address,
    loggedInDetails,
    displayedResources = [],
    signAndVerifyChallenge,
    selectedChainName,
    selectedChainInfo,
    canAddCustomAssets = false,
    canAddCustomUris = false,
    customAddHelpDisplay = '',
    buttonStyle,
    modalStyle,
    chainOptions,
    onChainUpdate,
    connect,
    disconnect,
    connected,
    hideConnect,
    hideLogin,
    loggedIn,
    hideChainName,
    customDisplay,
    logout,
}) => {
    const [signInModalIsVisible, setSignInModalIsVisible] = useState(false);
    const [chain, setChain] = useState(getChain(selectedChainName, selectedChainInfo));
    const [displayNameAddress, setDisplayNameAddress] = useState('');

    /**
     * Upon chain change, update chain metadata and props
     */
    useEffect(() => {
        const chainInfo = getChain(selectedChainName, selectedChainInfo);
        setChain(chainInfo);
        if (address) {
            updateDisplayAddress(address, chainInfo);
        }
    }, [
        selectedChainName,
        address
    ]);

    useEffect(() => {
        updateDisplayAddress(address);
    }, []);

    const updateDisplayAddress = async (address: string | undefined, chainInfo?: SupportedChainMetadata) => {
        if (!address) return;

        const chainDetails = chainInfo ? chainInfo : chain;

        let displayName = '';

        if (chainDetails.getNameForAddress) {
            const name = await chainDetails.getNameForAddress(address);
            if (name) {
                displayName = name;
            }
        }

        if (!displayName) {
            if (address.length <= 11) {
                displayName = address;
            } else {
                displayName = address.substring(0, 5) + '...' + address.substring(address.length - 5);
            }
        }

        setDisplayNameAddress(displayName);
    }

    const getDisplayAddressAndSignInDetails = () => {
        const displayAddress = connected && displayNameAddress;
        const displayLoggedInDetails = loggedIn && loggedInDetails;


        if (!address || (!displayAddress && !displayLoggedInDetails)) {
            return '';
        } else if (displayAddress && !displayLoggedInDetails) {
            const addressExplorerUrl = chain.getAddressExplorerUrl ? chain.getAddressExplorerUrl(address) : '';

            return <><Link text={`(${displayNameAddress})`} url={addressExplorerUrl} />
                <img src="https://img.icons8.com/fluency/48/undefined/copy.png" className='blockin-copy-address' onClick={(e) => {
                    navigator.clipboard.writeText(address);

                    /* Alert the copied text */
                    alert("Copied to clipboard: " + address);
                }} /></>
        } else if (!displayAddress && displayLoggedInDetails) {
            return `(${loggedInDetails})`
        } else {
            const addressExplorerUrl = chain.getAddressExplorerUrl ? chain.getAddressExplorerUrl(address) : '';

            return <>(<Link text={`${displayNameAddress}`} url={addressExplorerUrl} /> - {loggedInDetails})</>
        }
    }

    return <div className='blockin-global'>
        <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            {/* Address display */}
            {
                connected && <>
                    {address && !hideChainName && <div className='main-display'>
                        <Blockies
                            seed={address ? address.toLowerCase() : ''}
                            size={10}
                        /> </div>}
                </>
            }
            {!hideChainName &&
                <div className='main-display' style={{ alignItems: 'center', fontSize: 20 }}><b>{!hideChainName && <>{`${selectedChainName}`} {getDisplayAddressAndSignInDetails()}</>}</b></div>
            }

            {customDisplay &&
                <div className='main-display'>{customDisplay}</div>
            }

            {/* Chain Select */}
            {
                chainOptions && chainOptions?.length > 1 &&
                <ChainSelect buttonStyle={buttonStyle} modalStyle={modalStyle} selectedChain={chain} chains={chainOptions} updateChain={async (newChain: SupportedChainMetadata) => {
                    if (onChainUpdate) await onChainUpdate(newChain);
                }} />
            }

            {/* Connect Button */}
            {
                !hideConnect && <>
                    {connected ?
                        <button className='blockin-button main-button main-display' style={buttonStyle} onClick={async () => {
                            if (disconnect) await disconnect()
                        }}>
                            Disconnect
                        </button> :
                        <button className='blockin-button main-button main-display' style={buttonStyle} onClick={async () => {
                            if (connect) await connect()
                        }}>
                            Connect
                        </button>
                    }
                </>
            }

            {/* Main Sign In Button */}
            {
                !hideLogin && <>
                    {loggedIn ?
                        <button className='blockin-button main-button main-display' style={buttonStyle} onClick={async () => {
                            if (logout) await logout()
                        }}

                        >
                            Sign Out
                        </button> :
                        <>{connected &&
                            <button className='blockin-button main-button main-display' style={buttonStyle} onClick={
                                () => setSignInModalIsVisible(!signInModalIsVisible)
                            }>
                                Sign In
                            </button>
                        }</>
                    }
                </>
            }
        </div>

        {/* Popup Modal Once Clicked */}
        <SignInModal
            modalIsVisible={signInModalIsVisible}
            setModalIsVisible={setSignInModalIsVisible}
            selectedChainName={selectedChainName}
            selectedChainInfo={selectedChainInfo}
            challengeParams={challengeParams}
            address={address}
            signAndVerifyChallenge={signAndVerifyChallenge}
            displayNotConnnectedWarning={!connected && !hideConnect}
            displayedResources={displayedResources}
            canAddCustomAssets={canAddCustomAssets}
            canAddCustomUris={canAddCustomUris}
            customAddHelpDisplay={customAddHelpDisplay}
            modalStyle={modalStyle}
        />
    </div >;
}

export default BlockinUIDisplay