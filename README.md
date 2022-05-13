<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/blockinlogo.PNG" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Blockin</h3>

  <p align="center">
    A multi-chain sign-in standard for Web 3.0!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://blockin.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/matt-davison/blockin/issues">Report Bug</a>
    ·
    <a href="https://github.com/matt-davison/blockin/issues">Request Feature</a>
  </p>
</div>

<img src="images/blockinbanner.PNG" />

<!-- ABOUT THE PROJECT -->
## About The Project




Blockin is a universal, multi-chain sign-in interface for Web 3.0. The Blockin interface supports all of the following features:

* **Multi-Chain**: Previous solutions, such as EIP-4361 Sign-In with Ethereum, are limited to a single blockchain. The Blockin interface supports any blockchain!
  * This allows a neutral website, such as a university website, to not be limited to a single blockchain for their authorization flow.
* **Time-Based Authorization**: The interface natively supports 'Expiration' and 'Not Before' timestamps which are checked when verifying a sign-in attempt.
* **Authorization Assets**: For any chain that supports the creation of digital assets such as NFTs, Blockin allows resource providers to specify the ID of an  asset, and Blockin will query the blockchain to verify the user actually owns the asset. 
  * The metadata of these assets can also be used for custom privileges.
* **Dynamic Role-Based Access**: Through specifying authorization assets (explained above) and URIs, resource providers can differentiate between sign-in requests from different users and grant different role-based privileges accordingly.
  * Note that this is optional. The Blockin interface can be used without dynamic role-based access.

# How Blockin Works
For a visual demo, visit the [`Blockin Demo`](https://blockin.vercel.app/).

The Blockin interface can be split into the following categories:
* **Asset Creation**: If an asset is to be used while signing in, the asset must be created on-chain before being used for signing in. 
  * The asset can be created by the user, the resource provider, or via a smart contract. Each method has its own pros and cons which are explained on the [`Blockin Demo Site`](https://blockin.vercel.app/).
  * This library provides the necessary tools to create an asset via any of the methods.
* **Sign-In Verification**: Each time a user would like to sign-in, they will use their private key to cryptographically sign a challenge which specifies all the details about their sign-in attempt such as expiration date, statement, URIs, chain IDs, etc. Blockin will then verify the challenge was signed correctly, the challenge is valid, and the user owns all requested assets by querying the public blockchain.
  * The challenge interface used is the [`EIP-4361 Sign-In With Ethereum`](https://eips.ethereum.org/EIPS/eip-4361) interface. We extend this interface with the addition of specifying assets as resources with the prefix of 'Asset ID: '.

This library supports all the needed tools you may need at any stage of the process. 

Note that the Blockin library does not handle signing the challenges and will never ask for your private key. It only uses public data and cryptographic signatures to verify.

<!-- USAGE EXAMPLES -->
## Usage

For using the Blockin library on either a backend or frontend codebase, all you will have to do is run 
```
npm install blockin
```

Then, you can import any function via 
```TSX
import { ... } from 'blockin/ui';'
```
Visit the [`Blockin Docs`](https://github.com/kking935/Blockin-Demo) for more documentation.

Blockin should be used with both a frontend and a backend. 
* Frontend: The frontend is responsible for sending the sign-in challenge to the user for them to sign with their private key. The challenge can either be generated client-side or server-side. Blockin does not handle anything that deals with the signing the challenge.
  * This library provides two easily integratable React UI components: ChainSelect and SignInWithBlockinButton. They can be imported by 
  ```import { ChainSelect, SignInWithBlockinButton } from 'blockin/ui';```. Visit the [`Blockin Docs`](https://github.com/kking935/Blockin-Demo) to view the documentation for these components.
  * The above components are implemented using the createChallenge() function exported by Blockin, so if you would like to custom implement your own buttons and challenges, all you need to do is to call createChallenge().
  * **Note that most functions exported from Blockin need an API key. These functions should not be called from any frontend because that will leak your API key. It is strongly recommended these are called from the backend.**
* Backend: The backend is responsible for the verification. The frontend should send a request to the backend to verify a (challenge, signature) pair. The backend should first call Blockin's verifyChallenge() function. Blockin will check if challenge is well-formed and valid. Next, the backend will perform any additional validity checks, not checked by Blockin. If everything is valid, the backend can grant access via any method that one chooses (JWTs, session tokens, cookies, etc).
  * To import functions on the backend you will call: ```import { setChainDriver, ... } from 'blockin';```
  * Before calling any function, you must specify a valid ChainDriver by: ```setChainDriver(new AlgoDriver(..., API_KEY, ...));```
    * AlgoDriver is the ChainDriver for Algorand. Replace accordingly with the ChainDriver for your blockchain.
    * Some ChainDrivers are already implemented and exported for your convenience in src/ChainDrivers. However, Blockin is flexible. You may implement your own ChainDriver for any blockchain by implementing the ChainDriver interface that is defined. If you do this, it would greatly be appreciated if it is shared with us, so we can add it to this library for others to use!
    * **Note that you will need to specify an API key for your specific ChainDriver because Blockin will call APIs to query the blockchain. More details can be found in the documentation of the ChainDriver you wish to use.**


An example frontend and backend using Blockin can be found at [`Blockin Sample Integration Site`](https://github.com/Blockin-Labs/Blockin-Sample-Integration). 
* The pages folder shows how to use it in the frontend. The api folder shows how to use it via a backend API.

## Current Supported Chains
These are the chains that are natively supported by this library.
* **Algorand** via AlgoDriver defined in the ChainDrivers folder
  * Uses Purestake API and algosdk npm library

To add support for a new blockchain, please visit the README in the ChainDrivers folder.

We are currently working on adding implementations for more blockchains.

## Example Sites Using Blockin
* [`Netflix Proof of Concept`](https://github.com/Blockin-Labs/Blockin-Sample-Integration)

## Contributing to the Library
To develop and contribute to this library directly, all you should need to do is ```npm install```. 

The library has a few separate parts to it:
* Smart Contracts: These live in the smart_contracts folder. This is where example smart contracts for the creation of assets can be found.
* Blockin Library Functions: These live in the src folder (excluding the src/ui folder). This is for all the asset creation and verification functions.
  * If contributing to this part of the library, it is important that you become familiar with the ChainDriver interface and how it used. More information can be found at [`Blockin Docs`](https://github.com/kking935/Blockin-Demo).
* UI Components: These importable UI components can be found in the src/ui folder. This, in theory, should be able to become its own library in the future.
  * View the README in src/ui for more information.


Everything is built using ```npm run build``` which creates a build folder in the ```dist``` directory. The build command first rolls up the UI components using rollup.js, and then it builds everything else.

## Documentation
For more in-depth documentation, visit the [`Blockin Docs`](https://github.com/kking935/Blockin-Demo) or the [`Blockin Paper`](https://github.com/kking935/Blockin-Demo).


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/matt-davison/blockin.svg?style=for-the-badge
[contributors-url]: https://github.com/matt-davison/blockin/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/matt-davison/blockin.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/matt-davison/blockin.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/matt-davison/blockin.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/matt-davison/blockin.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
