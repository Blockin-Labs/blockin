import { useEffect, useState } from "react";
/**
 * chains - Array of chain props inputted to SignInWithBlockinButton. See ChainProps type. Default selected chain will be chains[0].
 * updateChain - Update function that is called when the user selects a new chain. This function should handle all the functionality
 * such as updating all backend and dApp functionality for the new chain, updating props to SignInWithBlockinButton, or updating
 * anything else that needs to for a chain update.
 */
export const ChainSelect = ({ chains, updateChain }) => {
    const [chain, setChain] = useState();
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    useEffect(() => {
        if (chains[0]) {
            handleChainChange(chains[0]);
        }
    }, []);
    const handleChainChange = (chain) => {
        setChain(chain.name);
        updateChain(chain);
    };
    return <>
        <b>Current Chain: {chain}</b> <button onClick={() => setMenuIsVisible(!menuIsVisible)}>{menuIsVisible ? 'Hide' : 'Show'}</button>
        <div>
            {menuIsVisible && <>
                {chains.map(chain => {
                return <div key={chain.name}><button onClick={() => handleChainChange(chain)}>Switch to Chain: {chain.name}</button></div>;
            })}
            </>}
        </div>
    </>;
};
