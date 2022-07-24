import { SupportedChainMetadata } from "./BlockinUIDisplay/BlockinUIDisplay.types";

/**
 * Gets metadata about the current chain. First, if selectedChainInfo is passed, we just return that. 
 * Next, we check the supported chains map and see if the name passed in matches. If nothing else was 
 * found, we return a default object.
 * @param chainName Name of the current blockchain you would like to get. See SUPPORTED_CHAIN_MAP for
 * the natively supported names.
 * @param selectedChainInfo Optional chain info. Must be of type SupportedChainMetadata. If this is defined, we
 * just return this
 * @returns SupportedChainMetadata object containing metadata about the chain.
 */
export const getChain = (chainName: string, selectedChainInfo?: SupportedChainMetadata): SupportedChainMetadata => {
    const safeCopyOfCurrentChainInfo = {
        ...selectedChainInfo
    }
    let chainInfo: any = {};
    if (selectedChainInfo && SUPPORTED_CHAIN_MAP[chainName]) {
        chainInfo = {
            ...SUPPORTED_CHAIN_MAP[chainName],
            ...safeCopyOfCurrentChainInfo
        }
    }
    else if (selectedChainInfo) {
        chainInfo = safeCopyOfCurrentChainInfo
    }
    else if (SUPPORTED_CHAIN_MAP[chainName]) {
        chainInfo = SUPPORTED_CHAIN_MAP[chainName];
    }

    let chainInfoWithDefaults = {
        name: chainName,
        logo: 'https://cdn-icons-png.flaticon.com/512/2091/2091665.png',
        getAddressExplorerUrl: (address: string) => ``,
        getAssetExplorerUrl: (asset: string) => ``,
        getNameForAddress: async (address: string) => undefined,
        ...chainInfo
    }

    return chainInfoWithDefaults;
}

const SUPPORTED_CHAIN_MAP: any = {
    'Ethereum': {
        name: 'Ethereum',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        getAddressExplorerUrl: (address: string) => `https://etherscan.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://etherscan.io/token/${asset}`,
    },
    'Polygon': {
        name: 'Ethereum',
        logo: 'https://polygonscan.com/images/svg/brands/polygon.svg',
        getAddressExplorerUrl: (address: string) => `https://polygonscan.com/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://polygonscan.com/token/${asset}`,
    },
    'Avalanche': {
        name: 'Avalanche',
        logo: 'https://assets-global.website-files.com/6059b554e81c705f9dd2dd32/60ec6a944b52e3e96e16af68_Avalanche_Square_Red_Circle.png',
        getAddressExplorerUrl: (address: string) => `https://snowtrace.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://snowtrace.io/token/${asset}`,
    },
    'BSC': {
        name: 'Binance Smart Chain',
        logo: 'https://bscxplorer.com/static/favicon/BSC/logo.svg',
        getAddressExplorerUrl: (address: string) => `https://bscscan.com/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://bscscan.com/token/${asset}`,
    },
    'Ethereum Rinkeby': {
        name: 'Rinkeby',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        getAddressExplorerUrl: (address: string) => `https://rinkeby.etherscan.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://rinkeby.etherscan.io/token/${asset}`,
    },
    'Ethereum Localhost': {
        name: 'Localhost',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        getAddressExplorerUrl: (address: string) => `https://etherscan.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://etherscan.io/token/${asset}`,
    },
    'Ethereum Mainnet': {
        name: 'Ethereum',
        logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        getAddressExplorerUrl: (address: string) => `https://etherscan.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://etherscan.io/token/${asset}`,
    },
    'Algorand': {
        name: 'Algorand',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png',
        getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
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
        getAddressExplorerUrl: (address: string) => `https://testnet.algoexplorer.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://testnet.algoexplorer.io/asset/${asset}`,
    },
    'Algorand Localhost': {
        name: 'Localhost',
        logo: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-algorand/contentbuilder/C_Algorand-Event-Thumbnail-400x400_EjNd7dj.png',
        getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
        getAssetExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
    },
}