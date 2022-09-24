# Glip Wallet JS Docs

Guide for installation and usage of Glip's Web3 Wallet.\
Glip Wallet through its SDK provides a signer using which a user's transaction can be signed.\
It also contains a iframe based UI element which can be embedded into any webpage.\
The UI contains features to check balance, change currency, transfer and swap tokens.\

Demo app link:

[Demo App](https://glip-gg.github.io/glip-js-wallet-sdk-example/)

Demo app code link:

[Demo App Code](https://github.com/glip-gg/wallet-test)


## Installation

### NPM
```
npm i glip-wallet-sdk
```
### Yarn
```
yarn add glip-wallet-sdk
```

### Add to HTML
You can only directly add to HTML page.

This will add the variable ```glipWalletSDK``` to ```window```. You can access it using ```window.glipWalletSDK```

```
<script src='https://cdn.jsdelivr.net/npm/glip-wallet-sdk@1.0.109/dist/bundle.js'></script>
```
## Usage

### Initialization
First we need to ensure a div with id `glip-wallet` in the html body.
 
```<div id="glip-wallet"></div>```

```js

It is best to create a method to get the client id. This method will require you
to use your client identifier.
```js
import { getGlipWallet } from 'glip-wallet-sdk/wallet';
let initializedGlipWallet = false;

const getInitializedGlipWallet = async () => {
    return await getGlipWallet({
        chainId: 80001,
        authNetwork: 'cyan',
        clientIdentifier: '63020e1ef81e3742a278846a'
    });
    return glipWalletSDK;
};

export default getInitializedGlipWallet;
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

### logout
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

## Example Usage using ethers library to transfer erc20 token
### Show the wallet UI
```js
    
    import { ethers } from "ethers";
    import { abiERC20 } from '@metamask/metamask-eth-abis';
     
    const transferNFT = async () => {
        let toAddress = "0x6203A4a2c3c58bEA165b72012303Dbd8FF938B1b";
        let glipWallet = await getGlipWallet();
        let myAddress = (await glipWallet.getUserInfo()).publicAddress;
        console.log('myAddress', myAddress);
        const quantity = 1;
        const contractAddress = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
        const erc20_rw = new ethers.Contract(address, abiERC20);
        const tx = await erc20_rw.populateTransaction['transfer'](
            myAddress,
            toAddress,
            quantity
        );
        let signer = await glipWallet.getSigner();
        let signedTransaction;
        try{
            signedTransaction = await signer.signTransaction(tx);
        }
        catch(e){
            console.log('error', e);
        }
        return signedTransaction;
    }
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
