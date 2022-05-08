import { useEffect, useState } from "react";
import { ChainProps } from "../@types/SignInWithBlockinButton";

export const ChainSelect = ({ chains, setChainProps }: { chains: ChainProps[], setChainProps: (chainProps: ChainProps) => void }) => {
    const [chain, setChain] = useState<string>();
    const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (chains[0]) {
            handleChainChange(chains[0]);
        }
    }, []);

    const handleChainChange = (chain: ChainProps) => {
        setChain(chain.name);
        setChainProps(chain);
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
}