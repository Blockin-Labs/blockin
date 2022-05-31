import { ChainProps, SupportedChain } from "../SignInWithBlockinButton/SignInWithBlockinButton.types";

// Generated with util/create-component.js
export interface ChainSelectProps {
    /**
     * Valid CSS style JSON. Will be applied as an inline style to the button.
     */
    buttonStyle?: any,
    /**
     * Valid CSS style JSON. Will be applied as an inline style to the modal.
     */
    modalStyle?: any,
    /**
    *  Array of chain props inputted to SignInWithBlockinButton. See ChainProps type. Default selected chain will be chains[0].
    */
    chains: SupportedChain[],
    /**
     * Update function that is called when the user selects a new chain. This function should handle all the functionality
     * such as updating all backend and dApp functionality for the new chain, updating props to SignInWithBlockinButton, or updating 
     * anything else that needs to for a chain update.
     */
    updateChain: (chainProps: SupportedChain) => void
}
