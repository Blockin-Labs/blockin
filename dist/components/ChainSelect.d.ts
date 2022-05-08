/// <reference types="react" />
import { ChainProps } from "../@types/SignInWithBlockinButton";
/**
 * chains - Array of chain props inputted to SignInWithBlockinButton. See ChainProps type. Default selected chain will be chains[0].
 * updateChain - Update function that is called when the user selects a new chain. This function should handle all the functionality
 * such as updating all backend and dApp functionality for the new chain, updating props to SignInWithBlockinButton, or updating
 * anything else that needs to for a chain update.
 */
export declare const ChainSelect: ({ chains, updateChain }: {
    chains: ChainProps[];
    updateChain: (chainProps: ChainProps) => void;
}) => JSX.Element;
