import { SupportedChainMetadata } from "../BlockinUIDisplay/BlockinUIDisplay.types";

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
    * Current selected chain. If defined, this will be the selected chain. If not defined,
    * this component will maintain an internal state with the default selected chain being the first chain
    * specified in chains. 
    */
    selectedChain?: SupportedChainMetadata,
    /**
    *  Array of chain props inputted to BlockinUIDisplay. See ChainProps type. Default selected chain will be chains[0].
    */
    chains: SupportedChainMetadata[],
    /**
     * Update function that is called when the user selects a new chain. This function should handle all the functionality
     * such as updating all backend and dApp functionality for the new chain, updating props to BlockinUIDisplay, or updating 
     * anything else that needs to for a chain update.
     */
    updateChain: (chainProps: SupportedChainMetadata) => void
}
