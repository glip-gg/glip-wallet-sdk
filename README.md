# Glip Wallet JS Docs
Guide for installation and usage of Glip's Web3 walllet.

## Installation

NPM
```
npm i glip-wallet-sdk
```
Yarn
```
yarn add glip-wallet-sdk
```
## Usage

### Initialization
First we need to ensure a div with id `glip-wallet` in the html body.
 
```<div id="glip-wallet"></div>```

```js
import { glipWalletSDK } from 'glip-wallet-sdk/wallet';
let initializedGlipWallet = false;

const getGlipWallet = async () => {
    if(initializedGlipWallet) {
        return initializedGlipWallet;
    }
    await glipWalletSDK.init({
        chainId: 80001,
        authNetwork: 'cyan',
        clientIdentifier: '63020e1ef81e3742a278846a'
    });
    initializedGlipWallet = glipWalletSDK;
    return glipWalletSDK;
};

export default getGlipWallet;

```

Now you can import glip wallet anywhere you need in your app and no need to re re-initialize it.
```js
  let glipWallet = await getGlipWallet()
```


## Login/Logout

To login or logout a user, you can use croak's prebuilt UI or build your own and call SDK methods.
To use prebuilt UI

### showConnectModal

```glipWallet.showConnectModal(['google'])```

This will show a modal with a login with google button.
If you are building your own UI you can directly call the login methods
### login

```js
  glipWallet.login('google')
```


### isConnected

```js
let isConnected = await glipWallet.isConnected();
console.log(isConnected); // will be a boolean.
```

## logout
```await glipWallet.logout()```


## User Details
Methods to fetch user details

### getUserInfo
Get details about the logged in user.
```js
let userInfo = await glipWallet.getUserInfo();
console.log(userInfo.email);
console.log(userInfo.name);
console.log(userInfo.profileImage);
console.log(userInfo.publicAddress);
```
<!---
### getWalletId
Get the Glip walletID of the logged in user, You can use this to transfer NFT to some other user.
```
let walletId = glipWallet.getWalletId()
```
--->
## Wallet/Signer Operations
### signTransaction
Sign a transaction using the user's private key. This will redirect the user to glipgg in mobile.
```js
let signer = await glipWallet.getSigner();
let displayMessage = "This transaction transfers 0 value";
let signedTx = signer.signTransaction({
    to: '0x0000000000000000000000000000000000000000',
    value: '0x0',
    data: '0x0',
    chainId: 137,
    nonce: 0,
    gasPrice: 0,
    gasLimit: 0,
    from: '0x0000000000000000000000000000000000000000'
}, displayMessage);
console.log(signedTx);
```
## Wallet UI
### Show the wallet UI
```js
glipWallet.showWallet();
```

### Hide the wallet UI
```js
glipWallet.hideWallet();
```

<!---
## NFT Fetch/Transfer Methods

Methods to manage user's NFTs

### fetchNFTs
Get list of user's NFTs

```
let nfts = glipWallet.fetchNFTs()
```


### transferNFT
Transfer a NFT from the wallet of one user to another user.
```
glipWallet.transferNFT(walletIdTo,  nftId,  amount);
```
### createSellOrder

Start a sell order for token from the wallet. P2P sale.
```
glipWallet.createSellOrder(nftId,  amount,  currencyId,  currencyAmount);
```
### createBuyOrder
Make a buy order from the wallet

```
glipWallet.createBuyOrder(nftId, nftAmount, currencyId, currencyAmount);
```
-->
