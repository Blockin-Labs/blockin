# Blockin

Welcome to Blockin! 

Blockin is a universal, multi-chain sign-in interface for Web 3.0. The Blockin interface supports all of the following features:

* Multi-Chain: Previous solutions, such as EIP-4361 Sign-In with Ethereum, are limited to a single blockchain. The Blockin interface supports any blockchain!
  * This allows a neutral website, such as a university website, to not be limited to a single blockchain for their authorization flow.
* Time-Based Authorization: The interface natively supports 'Expiration' and 'Not Before' timestamps which are checked when verifying a sign-in attempt.
* Authorization Assets: For any chain that supports the creation of digital assets such as NFTs, Blockin allows resource providers to specify the ID of an  asset, and Blockin will query the blockchain to verify the user actually owns the asset. 
  * The metadata of these assets can also be used for custom privileges.
* Dynamic Role-Based Access: Through specifying authorization assets (explained above) and URIs, resource providers can differentiate between sign-in requests from different users and grant different role-based privileges accordingly.
  * Note that this is optional. The Blockin interface can be used without dynamic role-based access.

# How Blockin Works
For a visual demo, visit the [`Blockin Demo`](https://blockin.vercel.app/).

The Blockin interface can be split into the following categories:
* Asset Creation: If an asset is to be used while signing in, the asset must be created on-chain before being used for signing in. 
  * The asset can be created by the user, the resource provider, or via a smart contract. Each method has its own pros and cons which are explained on the [`Blockin Demo Site`](https://blockin.vercel.app/).
  * This library provides the necessary tools to create an asset via any of the methods.
* Sign-In Verification: Each time a user would like to sign-in, they will use their private key to cryptographically sign a challenge which specifies all the details about their sign-in attempt such as expiration date, statement, URIs, chain IDs, etc. Blockin will then verify the challenge was signed correctly, the challenge is valid, and the user owns all requested assets by querying the public blockchain.
  * The challenge interface used is the EIP-4361 Sign-In With Ethereum interface with the addition of specifying assets as resources with the prefix of 'Asset ID: '.

This library supports all the needed tools you may need at any stage of the process. 

Note that the Blockin library does not handle signing the challenges and will never ask for your private key. It only uses public data and cryptographic signatures to verify.
# Using the Library
For using the Blockin library on either a backend or frontend codebase, all you will have to do is run ```npm install blockin```.

Then, you can import any function via ```import { ... } from 'blockin/ui';'```. Visit the [`Blockin Docs`](https://github.com/kking935/Blockin-Demo) for more documentation.

Blockin should be used with both a frontend and a backend. 
* Frontend: The frontend is responsible for sending the sign-in challenge to the user for them to sign with their private key. The challenge can either be generated client-side or server-side. Blockin does not handle anything that deals with the signing the challenge.
  * This library provides two easily integratable React UI components: ChainSelect and SignInWithBlockinButton. They can be imported by ```import { ChainSelect, SignInWithBlockinButton } from 'blockin/ui';```. Visit the [`Blockin Docs`](https://github.com/kking935/Blockin-Demo) to view the documentation for these components.
  * The above components are implemented using the createChallenge() function exported by Blockin, so if you would like to custom implement your own buttons and challenges, all you need to do is to call createChallenge().
* Backend: The backend is responsible for the verification. The frontend should send a request to the backend to verify a (challenge, signature) pair. The backend will first call Blockin's verifyChallenge() function. This will check if challenge is well-formed and valid. Next, the backend will perform any additional validity checks. If everything is valid, the backend can grant access via any method that one chooses (JWTs, session tokens, cookies, etc).
  * To import functions on the backend you will call: ```import { setChainDriver, ... } from 'blockin';```
  * Before calling any function, you must specify a valid ChainDriver by: ```setChainDriver(new AlgoDriver(..., API_KEY, ...));```
    * AlgoDriver is the ChainDriver for Algorand. Replace accordingly with the ChainDriver for your blockchain.
    * Some ChainDrivers are already implemented and exported for your convenience. However, you may also implement your own ChainDriver for a new blockchain by implementing the ChainDriver interface that is defined. If you do this, it would greatly be appreciated if it is shared with us, so we can add it to this library for others to use!


An example frontend and backend using Blockin can be found at [`Blockin Sample Integration Site`](https://github.com/trevormil/Blockin-Sample-Integration). 
* The pages folder shows how to use it in the frontend. The api folder shows how to use it via a backend API.




# Example Sites Using Blockin
* [`Netflix Proof of Concept`](https://github.com/trevormil/Blockin-Sample-Integration)

# Contributing to the Library
To develop and contribute to this library directly, all you should need to do is ```npm install```. 

The library has a few separate parts to it:
* Smart Contracts: These live in the smart_contracts folder. This is where example smart contracts for the creation of assets can be found.
* Blockin Library Functions: These live in the src folder (excluding the src/ui folder). This is for all the asset creation and verification functions.
  * If contributing to this part of the library, it is important that you become familiar with the ChainDriver interface and how it used. More information can be found at [`Blockin Docs`](https://github.com/kking935/Blockin-Demo).
* UI Components: These importable UI components can be found in the src/ui folder. This, in theory, should be able to become its own library in the future.
  * View the README in src/ui for more information.


Everything is built using ```npm run build``` which creates a build folder in the ```dist``` directory. The build command first rolls up the UI components using rollup.js, and then it builds everything else.

# Documentation
For more in-depth documentation, visit the [`Blockin Docs`](https://github.com/kking935/Blockin-Demo) or the [`Blockin Paper`](https://github.com/kking935/Blockin-Demo).