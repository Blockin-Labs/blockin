import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
/**
 * ChainSelect - Component to handle updating the chain for multi-chain dApps. This is to be used in conjunction
 * with the SignInWithBlockin button.
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
    return _jsxs(_Fragment, { children: [_jsxs("b", { children: ["Current Chain: ", chain] }), " ", _jsx("button", Object.assign({ onClick: () => setMenuIsVisible(!menuIsVisible) }, { children: menuIsVisible ? 'Hide' : 'Show' })), _jsx("div", { children: menuIsVisible && _jsx(_Fragment, { children: chains.map(chain => {
                        return _jsx("div", { children: _jsxs("button", Object.assign({ onClick: () => handleChainChange(chain) }, { children: ["Switch to Chain: ", chain.name] })) }, chain.name);
                    }) }) })] });
};
