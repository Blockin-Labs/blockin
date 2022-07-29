# Chain Drivers
The Chain Driver interface is where everything that is chain-specific is implemented. 

We provide a few already implemented ChainDrivers as NPM packages for convenience. For an example, visit the Blockin Demo site. (We are currently working on more convenient methods to import these files).

You can also choose to implement the ChainDriver interface on your own. If you do this, it would be greatly appreciated if it is published or shared with us, so we can add it to a library!

# Current Supported Chains
These are the chains that are natively supported by this library.
* **Algorand** (AlgoDriver) via the blockin-algo-driver NPM package ([`Source Code`](https://github.com/Blockin-Labs/blockin-algo-driver)).
  * Uses Purestake API and algosdk library
  * ```import AlgoDriver from 'blockin-algo-driver';```
  * Supports both mainnet and testnet
* **Ethereum** (EthDriver) via the blockin-eth-driver NPM package ([`Source Code`](https://github.com/Blockin-Labs/blockin-eth-driver)).
  * Uses Moralis API and ethers.js library
  * ```import EthDriver from 'blockin-eth-driver';```
  * Supports all Moralis EVM supported chains such as Ethereum, Polygon, Avalanche, Binance Smart Chain, Cronos
# How to Contribute a New Chain Implementation Template
Create a pull request with the following:
* This README file updated
* SupportedChains.ts updated
* The root directory README file updated
* Link to the new chain driver file and documentation

A brief description, links, and example demo repositories would also be greatly appreciated.
