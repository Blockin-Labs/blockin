import { SupportedChain } from "./SignInWithBlockinButton/SignInWithBlockinButton.types";

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
export const getChain = (chainName: string, currentChainInfo?: SupportedChain): SupportedChain => {
    // console.log("CHAIN NAME", chainName)
    if (currentChainInfo) return currentChainInfo;
    else if (SUPPORTED_CHAIN_MAP[chainName]) return SUPPORTED_CHAIN_MAP[chainName];
    else return {
        name: chainName,
        logo: 'https://cdn-icons-png.flaticon.com/512/2091/2091665.png',
        getAddressExplorerUrl: (address: string) => ``,
        getAssetExplorerUrl: (asset: string) => ``,
    }
}

const SUPPORTED_CHAIN_MAP: any = {
    'Ethereum': {
        name: 'Ethereum',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        getAddressExplorerUrl: (address: string) => ``,
        getAssetExplorerUrl: (asset: string) => ``
    },
    'Algorand Mainnet': {
        name: 'Algorand',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png',
        getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
    },
    'Algorand Testnet': {
        name: 'Algorand Testnet',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png',
        getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
    },
}