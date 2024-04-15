// Generated with util/create-component.js
import React, { useEffect, useState } from 'react';
import { createChallenge } from '../..';
import { NumberType } from '../../types/verify.types';
import ChainSelect from '../ChainSelect';
import SignInModal from '../SignInModal';
import { getChain } from '../SupportedChains';
import './BlockinUIDisplay.scss';
import { BlockinUIDisplayProps, SupportedChainMetadata } from './BlockinUIDisplay.types';

/**
 * BlockinUIDisplay - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const BlockinUIDisplay: React.FC<BlockinUIDisplayProps<NumberType>> = ({
  challengeParams,
  address,
  loggedInDetails,
  accessTiers = [],
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
  maxTimeInFuture,
  customBeforeSigningWarning,
  skipModalStep
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
  }, [selectedChainName, address]);

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
  };

  return (
    <div className="blockin-global">
      <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Chain Select */}
        {chainOptions && !hideChainSelect && (
          <ChainSelect
            buttonStyle={buttonStyle}
            modalStyle={modalStyle}
            selectedChain={chain}
            chains={chainOptions}
            updateChain={async (newChain: SupportedChainMetadata) => {
              if (onChainUpdate) await onChainUpdate(newChain);
            }}
          />
        )}

        {/* Connect Button */}
        {!hideConnect && (
          <>
            {connected ? (
              <button
                className="blockin-button main-button main-display button-style-override"
                style={{ ...buttonStyle }}
                onClick={async () => {
                  if (disconnect) await disconnect();
                }}>
                Disconnect
              </button>
            ) : (
              <button
                className="blockin-button main-button main-display button-style-override"
                style={buttonStyle}
                onClick={async () => {
                  if (connect) await connect();
                }}>
                Connect
              </button>
            )}
          </>
        )}

        {/* Main Sign In Button */}
        {!hideLogin && (
          <>
            {loggedIn ? (
              <button
                className="blockin-button main-button main-display button-style-override"
                style={buttonStyle}
                onClick={async () => {
                  if (logout) await logout();
                }}>
                Sign Out
              </button>
            ) : (
              <>
                {connected && (
                  <button
                    className="blockin-button main-button main-display button-style-override"
                    style={buttonStyle}
                    onClick={async () => {
                      if (skipModalStep) {
                        if (!challengeParams) {
                          throw new Error('You must provide challengeParams');
                        }
                        if (!signAndVerifyChallenge) {
                          throw new Error('You must provide signAndVerifyChallenge');
                        }

                        await signAndVerifyChallenge(createChallenge(challengeParams));
                      } else {
                        setSignInModalIsVisible(!signInModalIsVisible);
                      }
                    }}>
                    Sign In
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
      {/* Address display */}
      {customDisplay && <div className="main-display flex-center">{customDisplay}</div>}
      {!hideConnectVsSignInHelper && (
        <div style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
          <div style={{ color: 'inherit' }}>
            <div className="group relative flex justify-center">
              <div className="rounded px-4 ">Hover to learn more</div>
              <span
                className="absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100"
                style={{ maxWidth: 300, zIndex: 1000 }}>
                <>
                  {'What is the difference between connecting and signing in?'}
                  <br />
                  <br />
                  {
                    'Connecting is simply providing this website with what your public address is so that they can fetch and display your PUBLIC information. This also lets them know what address to prompt you to sign transactions with.'
                  }
                  <br />
                  <br />
                  {
                    'Signing in with Blockin lets you prove your identity (that you are the owner of the address) to the website, similar to a password. This allows you to access PRIVATE features that are only available to authenticated users.'
                  }
                  <br />
                  <br />
                  {'Note certain features may require both connecting and signing in.'}
                </>
              </span>
            </div>
          </div>
        </div>
      )}

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
        accessTiers={accessTiers}
        modalStyle={modalStyle}
        allowTimeSelect={allowTimeSelect}
        maxTimeInFuture={maxTimeInFuture}
        customBeforeSigningWarning={customBeforeSigningWarning}
        // hideConnectVsSignInHelper={hideConnectVsSignInHelper}
      />
    </div>
  );
};

export default BlockinUIDisplay;
