# Blockin

Welcome to the Blockin Library! Blockin is a JavaScript library built to provide a flexible foundation for resource providers to implement role-based access control, dynamic resource owner privileges, and expiration tokens on-chain through a two-step process. The first step, authorization, creates an on-chain asset which is to be presented as an access token when interacting with a resource. The second step, authentication, verifies ownership of an asset through querying the blockchain and cryptographic digital signatures.

# Getting Started
You will have to npm install if you clone this repository. However, it is intended to be used as an imported library module, such as a git submodule. A sample dApp demo that uses Blockin can be found here [`Blockin Demo`](https://github.com/kking935/Blockin-Demo).

# Asset Creation Part of the Library
The library can be categorized into two parts: asset creation and asset verification. The asset creation part involves creating an asset in three separate ways: user creates, smart contract creates, and resource creates. For more info on what each of these means, visit the Blockin official paper. All files (excluding verification.ts) are part of the asset creation part of the library.

# Verification Part of Library
The verification part of the library can be found in verification.ts. Exported from here are two functions: createChallenge() and verifyChallenge(). The signing of the created challenge is not handled in this library and should be implemented separately. 
