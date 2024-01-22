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
  if (selectedChainInfo && selectedChainInfo.name === chainName && SUPPORTED_CHAIN_MAP[chainName]) {
    chainInfo = {
      ...SUPPORTED_CHAIN_MAP[chainName],
      ...safeCopyOfCurrentChainInfo
    }
  }
  else if (selectedChainInfo && selectedChainInfo.name === chainName) {
    chainInfo = safeCopyOfCurrentChainInfo
  }
  else if (SUPPORTED_CHAIN_MAP[chainName]) {
    chainInfo = SUPPORTED_CHAIN_MAP[chainName];
  }

  let chainInfoWithDefaults = {
    name: chainName,
    abbreviation: 'DEF',
    logo: 'https://cdn-icons-png.flaticon.com/512/5261/5261918.png',
    getAddressExplorerUrl: (address: string) => ``,
    getCollectionExplorerUrl: (asset: string) => ``,
    getNameForAddress: async (address: string) => undefined,
    ...chainInfo
  }

  return chainInfoWithDefaults;
}

const SUPPORTED_CHAIN_MAP: any = {
  'BitBadges': {
    name: 'BitBadges',
    abbreviation: 'BADGE',
    logo: 'https://bitbadges.io/_next/image?url=%2Fimages%2Fbitbadgeslogo.png&w=384&q=60',
    getAddressExplorerUrl: (address: string) => `https://bitbadges.io/account/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://bitbadges.io/collections/${asset}`,
    getTokenExplorerUrl: (collectionId: string, tokenId: string) => `https://bitbadges.io/collections/${collectionId}/${tokenId}`,
  },
  'Ethereum': {
    name: 'Ethereum',
    abbreviation: 'ETH',
    logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
    getAddressExplorerUrl: (address: string) => `https://etherscan.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://etherscan.io/token/${asset}`,
    getTokenExplorerUrl: (collectionId: string, tokenId: string) => `https://opensea.io/assets/ethereum/${collectionId}/${tokenId}`,
  },
  'Polygon': {
    name: 'Polygon',
    abbreviation: 'POLY',
    logo: 'https://polygonscan.com/images/svg/brands/polygon.svg',
    getAddressExplorerUrl: (address: string) => `https://polygonscan.com/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://polygonscan.com/token/${asset}`,
  },
  'Avalanche': {
    name: 'Avalanche',
    abbreviation: 'AVAX',
    logo: 'https://assets-global.website-files.com/6059b554e81c705f9dd2dd32/60ec6a944b52e3e96e16af68_Avalanche_Square_Red_Circle.png',
    getAddressExplorerUrl: (address: string) => `https://snowtrace.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://snowtrace.io/token/${asset}`,
  },
  'BSC': {
    name: 'Binance Smart Chain',
    abbreviation: 'BSC',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/bnb-chain-binance-smart-chain-logo.png',
    getAddressExplorerUrl: (address: string) => `https://bscscan.com/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://bscscan.com/token/${asset}`,
  },
  'Binance Smart Chain': {
    name: 'Binance Smart Chain',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/bnb-chain-binance-smart-chain-logo.png',
    getAddressExplorerUrl: (address: string) => `https://bscscan.com/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://bscscan.com/token/${asset}`,
  },
  'Ethereum Rinkeby': {
    name: 'Rinkeby',
    abbreviation: 'ETH',
    logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
    getAddressExplorerUrl: (address: string) => `https://rinkeby.etherscan.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://rinkeby.etherscan.io/token/${asset}`,
  },
  'Ethereum Localhost': {
    name: 'Localhost',
    abbreviation: 'ETH',
    logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
    getAddressExplorerUrl: (address: string) => `https://etherscan.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://etherscan.io/token/${asset}`,
  },
  'Ethereum Mainnet': {
    name: 'Ethereum',
    abbreviation: 'ETH',
    logo: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
    getAddressExplorerUrl: (address: string) => `https://etherscan.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://etherscan.io/token/${asset}`,
  },
  'Algorand': {
    name: 'Algorand',
    abbreviation: 'ALGO',
    logo: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
  },
  'Algorand Mainnet': {
    name: 'Algorand',
    abbreviation: 'ALGO',
    logo: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
  },
  'Algorand Testnet': {
    name: 'Algorand Testnet',
    abbreviation: 'ALGO',
    logo: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    getAddressExplorerUrl: (address: string) => `https://testnet.algoexplorer.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://testnet.algoexplorer.io/asset/${asset}`,
  },
  'Algorand Localhost': {
    name: 'Localhost',
    abbreviation: 'ALGO',
    logo: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    getAddressExplorerUrl: (address: string) => `https://algoexplorer.io/address/${address}`,
    getCollectionExplorerUrl: (asset: string) => `https://algoexplorer.io/asset/${asset}`,
  },
  'Cosmos': {
    name: 'Cosmos',
    abbreviation: 'COSM',
    logo: 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
    getAddressExplorerUrl: (address: string) => `https://mintscan.io/cosmos/account/${address}`,
    // getCollectionExplorerUrl: (asset: string) => `https://mintscan.io/asset/${asset}`,
  },
  'Solana': {
    name: 'Solana',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
    abbreviation: 'SOL',
    getAddressExplorerUrl: (address: string) => `https://explorer.solana.com/address/${address}`,
  }
};