// Generated with util/create-component.js
import React from 'react';

import { ChainSelectProps } from './ChainSelect.types';
import { useEffect, useState } from 'react';
import { SupportedChainMetadata } from '../BlockinUIDisplay/BlockinUIDisplay.types';
import { getChain } from '../SupportedChains';

/**
 * ChainSelect - Component to handle updating the chain for multi-chain dApps. This is to be used in conjunction
 * with the SignInWithBlockin button.
 */
const ChainSelect: React.FC<ChainSelectProps> = ({ chains, updateChain, selectedChain, buttonStyle, modalStyle, disabled }) => {
  const [chain, setChain] = useState<string>();
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);

  /**
   * If selectedChain is not defined, default to first inputted chain.
   */
  useEffect(() => {
    if (!selectedChain && chains[0]) {
      handleChainChange(chains[0]);
    } else if (selectedChain) {
      handleChainChange(selectedChain);
    }
  }, []);

  /**
   * Update everytime the chain changes
   */
  useEffect(() => {
    if (selectedChain) {
      handleChainChange(selectedChain);
    }
  }, [selectedChain?.name]);

  const handleChainChange = (chain: SupportedChainMetadata) => {
    setChain(chain.name);
    updateChain(chain);
    if (menuIsVisible) {
      setMenuIsVisible(false);
    }
  };

  return (
    <>
      <div className="blockin-global non-mobile-only">
        <button
          disabled={disabled}
          className="blockin-button main-button main-display blockin-button-semi-disabled button-style-override"
          style={buttonStyle}
          onClick={() => setMenuIsVisible(!menuIsVisible)}>
          <img className="blockin-chain-select-logo-right" style={{ height: 20, width: 20 }} src={selectedChain?.logo} />
          <span className="non-mobile-only">{selectedChain?.name}</span>
        </button>
      </div>

      <div className="blockin-global mobile-only">
        <button
          disabled={disabled}
          className="blockin-button main-button main-display button-style-override"
          style={{ ...buttonStyle, width: 50 }}
          onClick={() => setMenuIsVisible(!menuIsVisible)}>
          <img className="" style={{ height: 25, width: 25 }} src={selectedChain?.logo} />
        </button>
      </div>

      {menuIsVisible && (
        <div
          className="blockin-root blockin-chain-select"
          onClick={(e) => {
            if (disabled) return;

            setMenuIsVisible(!menuIsVisible);
            e.stopPropagation();
            e.preventDefault();
          }}>
          <div
            className="blockin-popup-container modal-style-override rounded-xl inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#10244d_100%)]"
            style={modalStyle}
            onClick={(e) => {
              if (disabled) return;
              e.stopPropagation();
              e.preventDefault();
            }}>
            <div className="blockin-popup" style={modalStyle}>
              {/* Header with the Close Button */}
              <div className="blockin-header" style={{ minWidth: 180 }}>
                <div className="header-end"></div>
                <section className="header-middle">
                  {/* Title and Chain Logo */}

                  <h1 style={{}}>Chain Select</h1>
                  <div className="blockin-header-chain-info"></div>
                </section>

                <div className="header-end">
                  {/* Close Button */}
                  {/* <button className='blockin-closebutton'  >
                                <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                                </svg>
                            </button> */}
                </div>
              </div>

              {chains.map((chain) => {
                if (chain.name && !chain.logo) chain = getChain(chain.name);

                return (
                  <div key={chain.name}>
                    <button
                      style={buttonStyle}
                      className="blockin-button main-button main-display button-style-override"
                      onClick={() => handleChainChange(chain)}>
                      <img className="blockin-chain-select-logo-right" style={{ height: 20, width: 20 }} src={chain?.logo} />

                      {chain.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChainSelect;
