// Generated with util/create-component.js
import React from "react";

import { ChainSelectProps } from "./ChainSelect.types";
import { useEffect, useState } from "react";
import { SupportedChainMetadata } from "../BlockinUIDisplay/BlockinUIDisplay.types";
import { getChain } from "../SupportedChains";

/**
 * ChainSelect - Component to handle updating the chain for multi-chain dApps. This is to be used in conjunction
 * with the SignInWithBlockin button.
 */
const ChainSelect: React.FC<ChainSelectProps> = ({ chains, updateChain, selectedChain, buttonStyle, modalStyle }) => {
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
    }

    return <>
        <button className='blockin-button main-button main-display' style={buttonStyle} onClick={() => setMenuIsVisible(!menuIsVisible)}>
            <img className='blockin-chain-select-logo-right' height='20px' width='20px' src={selectedChain?.logo} /> {selectedChain?.abbreviation}
        </button>


        {menuIsVisible && <div className='blockin-root blockin-chain-select' onClick={(e) => {
            setMenuIsVisible(!menuIsVisible)
            e.stopPropagation();
            e.preventDefault();
        }}>
            <div className="blockin-popup-container" style={modalStyle} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}>
                <div className="blockin-popup" style={modalStyle}>
                    {/* Header with the Close Button */}
                    <div className='blockin-header'>
                        <div className="header-end">

                        </div>
                        <section className="header-middle">
                            {/* Title and Chain Logo */}

                            <h1>Chain Select</h1>
                            <div className='blockin-header-chain-info'>
                            </div>
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

                    <hr />

                    {
                        chains.map(chain => {
                            return <div key={chain.name}>
                                <button style={buttonStyle} className='blockin-button' onClick={() => handleChainChange(chain)}>
                                    Select {chain.name}
                                    <img className='blockin-chain-select-logo-left' height='20px' width='20px' src={chain?.logo} />
                                </button>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>}
    </>
};

export default ChainSelect;

