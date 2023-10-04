// Generated with util/create-component.js
import React from "react";
import { BlockinUIDisplayProps, SupportedChainMetadata } from "./BlockinUIDisplay.types";
import { useEffect, useState } from 'react';
import { getChain } from '../SupportedChains'
import ChainSelect from '../ChainSelect';
import Blockies from 'react-blockies';
import SignInModal from "../SignInModal";
import { CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Typography, Tooltip } from "antd";
import { NumberType } from "bitbadgesjs-utils";
import "./BlockinUIDisplay.scss";

const Link = ({ url, text }: { url: string, text?: string }) => {
  return <a className="blockin-link" href={url} target='_blank' rel="noreferrer">{text ? text : url}</a>
}

/**
 * BlockinUIDisplay - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const BlockinUIDisplay: React.FC<BlockinUIDisplayProps<NumberType>> = ({
  challengeParams,
  address,
  loggedInDetails,
  displayedResources = [],
  displayedAssets = [],
  signAndVerifyChallenge,
  selectedChainName,
  selectedChainInfo,
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
  hideChainSelect,
  customDisplay,
  logout,
  hideConnectVsSignInHelper,
  allowTimeSelect,
  maxTimeInFuture

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
        <CopyOutlined rev={''} className='blockin-copy-address' onClick={(e) => {

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
    <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>




      {/* Chain Select */}
      {
        chainOptions && !hideChainSelect &&
        <ChainSelect

          buttonStyle={buttonStyle} modalStyle={modalStyle} selectedChain={chain} chains={chainOptions} updateChain={async (newChain: SupportedChainMetadata) => {
            if (onChainUpdate) await onChainUpdate(newChain);
          }} />
      }

      {/* Connect Button */}
      {
        !hideConnect && <>
          {connected ?
            <button className='blockin-button main-button main-display button-style-override' style={{ ...buttonStyle }} onClick={async () => {
              if (disconnect) await disconnect()
            }}>
              Disconnect
            </button> :
            <button className='blockin-button main-button main-display button-style-override' style={buttonStyle} onClick={async () => {
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
            <button className='blockin-button main-button main-display button-style-override' style={buttonStyle} onClick={async () => {
              if (logout) await logout()
            }}

            >
              Sign Out
            </button> :
            <>{connected &&
              <button className='blockin-button main-button main-display button-style-override' style={buttonStyle} onClick={
                () => setSignInModalIsVisible(!signInModalIsVisible)
              }>
                Sign In
              </button>
            }</>
          }
        </>
      }
    </div>
    {/* Address display */}
    {customDisplay &&
      <div className='main-display flex-center'>{customDisplay}</div>
    }
    {!hideConnectVsSignInHelper &&
      <div style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
        <Typography.Text style={{ color: 'inherit' }}>
          <Tooltip placement="bottom" color="black" title={<>
            {"What is the difference between connecting and signing in?"}
            <br />
            <br />
            {"Connecting is simply providing this website with what your public address is so that they can fetch and display your PUBLIC information. This also lets them know what address to prompt you to sign transactions with."}
            <br />
            <br />
            {"Signing in with Blockin lets you prove your identity (that you are the owner of the address) to the website, similar to a password. This allows you to access PRIVATE features that are only available to authenticated users."}
            <br />
            <br />
            {"Note certain features may require both connecting and signing in."}
          </>}
          >
            <InfoCircleOutlined rev={""} /> Hover to learn more
          </Tooltip>
        </Typography.Text>
      </div>
    }

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
      displayedAssets={displayedAssets}
      modalStyle={modalStyle}
      allowTimeSelect={allowTimeSelect}
      maxTimeInFuture={maxTimeInFuture}
    // hideConnectVsSignInHelper={hideConnectVsSignInHelper}
    />
  </div >;
}

export default BlockinUIDisplay