/// <reference types="react" />
import { ChainProps } from "../@types/SignInWithBlockinButton";
/**
 * ChainSelect - Component to handle updating the chain for multi-chain dApps. This is to be used in conjunction
 * with the SignInWithBlockin button.
 */
export declare const ChainSelect: ({ chains, updateChain }: {
    /**
     *  Array of chain props inputted to SignInWithBlockinButton. See ChainProps type. Default selected chain will be chains[0].
     */
    chains: ChainProps[];
    /**
     * Update function that is called when the user selects a new chain. This function should handle all the functionality
     * such as updating all backend and dApp functionality for the new chain, updating props to SignInWithBlockinButton, or updating
     * anything else that needs to for a chain update.
     */
    updateChain: (chainProps: ChainProps) => void;
}) => JSX.Element;
