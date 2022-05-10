import { SupportedChain } from "../@types/SignInWithBlockinButton";
/**
 * Gets metadata about the current chain. First, if currentChainInfo is passed, we just return that.
 * Next, we check the supported chains map and see if the name passed in matches. If nothing else was
 * found, we return a default object.
 * @param chainName Name of the current blockchain you would like to get. See SUPPORTED_CHAIN_MAP for
 * the natively supported names.
 * @param currentChainInfo Optional chain info. Must be of type SupportedChain. If this is defined, we
 * just return this
 * @returns SupportedChain object containing metadata about the chain.
 */
export declare const getChain: (chainName: string, currentChainInfo?: SupportedChain | undefined) => SupportedChain;
