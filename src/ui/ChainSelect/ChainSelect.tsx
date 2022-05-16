// Generated with util/create-component.js
import React from "react";

import { ChainSelectProps } from "./ChainSelect.types";
import { useEffect, useState } from "react";
import "./ChainSelect.scss";
import { ChainProps } from "../SignInWithBlockinButton/SignInWithBlockinButton.types";
import { getChain } from "../SupportedChains";

/**
 * ChainSelect - Component to handle updating the chain for multi-chain dApps. This is to be used in conjunction
 * with the SignInWithBlockin button.
 */
const ChainSelect: React.FC<ChainSelectProps> = ({ chains, updateChain }) => {
    const [chain, setChain] = useState<string>();
    const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (chains[0]) {
            handleChainChange(chains[0]);
        }
    }, []);

    const handleChainChange = (chain: ChainProps) => {
        setChain(chain.name);
        updateChain(chain);
        if (menuIsVisible) {
            setMenuIsVisible(false);
        }
    }

    return <div className="blockin-chain-select blockin-global">
        <button className='blockin-button main-button' onClick={() => setMenuIsVisible(!menuIsVisible)}>
            Selected Chain: {getChain(chain).name} <img className='blockin-chain-select-logo' src={getChain(chain).logo} height='20px' width='20px' />
        </button>
        <div>
            {menuIsVisible && <div className='blockin-root'>
                <div className="blockin-popup-container">
                    <div className="blockin-popup">
                        {/* Header with the Close Button */}
                        <header className='blockin-header'>
                            <span className="header-end">

                            </span>
                            <section className="header-middle">
                                {/* Title and Chain Logo */}

                                <h1>Chain Select</h1>
                                <div className='blockin-header-chain-info'>
                                </div>
                            </section>

                            <span className="header-end">
                                {/* Close Button */}
                                <button className='blockin-closebutton' onClick={() => { setMenuIsVisible(!menuIsVisible) }} >
                                    {/* CloseIcon SVG */}
                                    <svg width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                                    </svg>
                                </button>
                            </span>
                        </header>
                        <hr />
                        {
                            chains.map(chain => {
                                return <div key={chain.name}>
                                    <button className='blockin-button' onClick={() => handleChainChange(chain)}>
                                        Select {chain.name} <img className='blockin-chain-select-logo' height='20px' width='20px' src={getChain(chain.name).logo} />
                                    </button>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>}
        </div>
    </div>
};

export default ChainSelect;

