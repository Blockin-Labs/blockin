// Generated with util/create-component.js
import React from "react";

import { ChainSelectProps } from "./ChainSelect.types";
import { useEffect, useState } from "react";
import "./ChainSelect.scss";
import { ChainProps } from "../SignInWithBlockinButton/SignInWithBlockinButton.types";

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
    }

    return <>
        <b>Current Chain: {chain}</b> <button onClick={() => setMenuIsVisible(!menuIsVisible)}>{menuIsVisible ? 'Hide' : 'Show'}</button>
        <div>
            {menuIsVisible && <>
                {
                    chains.map(chain => {
                        return <div key={chain.name}><button onClick={() => handleChainChange(chain)}  >Switch to Chain: {chain.name}</button></div>
                    })
                }
            </>}
        </div>
    </>
};

export default ChainSelect;

