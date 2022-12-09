"use strict";

import {Signer, providers, Bytes, utils as ethersUtils} from "ethers";
import {ethers} from "ethers";
let chainDict:any = false;


// This funcion calls fetch only once
// once fetched, it stores the chainDict in a variable
async function getChainDict(){
    if(chainDict){
        return chainDict;
    }
    // Make a await call to fetch
    let chainList = await fetch('https://chainid.network/chains_mini.json');
    // Convert to json
    let chainListJSON = await chainList.json();
    // Create a dict
    chainDict = {};
    // convert chainList to dict with key chainId
    chainListJSON.forEach((chain:any) => {
        chainDict[chain.chainId] = chain;
    })
    return chainDict;
}


// Call getChainDict() to get the chainDict
// Then return the chain with chainId
async function getChainDetails(chainId:number){
    let chainValue;
    try{
        chainValue = (await getChainDict())[chainId];
    }
    catch(e){
        return false;
    }
    return chainValue;
}



const SIGNER_EXTENSION_URL = 'wallet-confirmation/'




const API_KEY_INFURA  = 'a0425606c7964da3a91be846c891fee7';

function getInfuraHttpRpcUrl(rpcValues:any){
    console.log('rpcValues', rpcValues);
    for(let rpcValue of rpcValues){
        // check if rpcvalue starts with https
        // and has infura in string
        if(rpcValue.startsWith('https') && rpcValue.includes('infura')){
            // replace ${INFURA_API_KEY} with apikey
            return rpcValue.replace('${INFURA_API_KEY}', API_KEY_INFURA);
        }
    }
    return false;
}

function getHttpRpcUrl(rpcValues:any){
    console.log('rpcValues', rpcValues);
    for(let rpcValue of rpcValues){
        // check if rpcvalue starts with https
        if(rpcValue.startsWith('https')){
            return rpcValue;
        }
    }
    return false;
}

async function getInternalProvider(chainId:number){
    console.log('chainId', chainId);
    let chainValue = await getChainDetails(chainId);
    if(!chainValue){
        throw new Error(`ChainId not found ${chainId}`);
    }
    console.log('chainValue', chainValue);
    let infuraRPC = getInfuraHttpRpcUrl(chainValue.rpc);
    let httpRPC = getHttpRpcUrl(chainValue.rpc);
    let rpcUrl = infuraRPC || httpRPC;
    let jsonRpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    return jsonRpcProvider;
}



class ExtendedSigner extends Signer {    
    provider?: providers.Provider;
    walletURI:string;
    address:string;
    isMobile:boolean = true;
    mobileSDK:boolean=false;
    chainId:number;
    socketUUID:string;
    openedWindow:Window|null=null;
    
    constructor(
        address:string,
        walletURI:string,
        isMobile:boolean,
        chainId:number,
        socketUUID:string,
        provider?: providers.Provider,
    ) {
        super();
        if (provider && !providers.Provider.isProvider(provider)) {
            throw (`invalid provider provided`);
        }
        console.log('this provider', this.provider);
        this.address = address;
        this.walletURI = walletURI + SIGNER_EXTENSION_URL;
        this.isMobile = isMobile;
        this.chainId = chainId;
        console.log('this.chainId', this.chainId)
        this.socketUUID = socketUUID;
    }
    
    connect(provider: providers.Provider): ExtendedSigner {
        this.provider = provider;
        if (provider && !providers.Provider.isProvider(provider)) {
            throw (`invalid provider provided`);
        }
        return this;
    }
    
    getAddress() : Promise<string>{
        return Promise.resolve(this.address);
    }

    private signedMessageCB:any;
    private signedMessageRejectCB:any;
    async signMessage(message: Bytes | string,
                      isMobileSDK?:boolean): Promise<string>{
        this.mobileSDK = isMobileSDK || false;
        //TODO: check if message is url encoded string
        let stringifyied_message = message;
        let chainId = this.chainId;
        console.log('chainId', chainId);
        let path = window.location.href.split('?')[0]
        path = encodeURIComponent(path);
        console.log('path', path);
        let finalURL = this.walletURI + `?signMessage=${stringifyied_message}&chainId=${chainId}&lastLocation=${path}&socketUUID=${this.socketUUID}&isMobileSDK=${this.mobileSDK}`;
        let that = this;
        return new Promise(function(resolve:any, reject:any){
            that.signedMessageCB = resolve;
            that.signedMessageRejectCB = reject;
            if(that.mobileSDK){
                (window as any).location = finalURL;
                return;
            }
            that.openedWindow = window.open(finalURL, '_blank', 'height=720,width=550');
        });
        // let message_stringify = JSON.stringify(message);
        // let that = this;
        // let finalURL = this.walletURI;
        // return new Promise(function(resolve:any, reject:any){
        //     that.signedMessageCB = resolve;
        //     that.signedMessageRejectCB = reject;
        //     window.open(finalURL, '_blank', 'height=720,width=550');
        // });        
    }

    private signedPersonalMessageCB:any;
    private signedPersonalMessageRejectCB:any;
    async signPersonalMessage(message: Bytes | string,
                      isMobileSDK?:boolean): Promise<string>{
        this.mobileSDK = isMobileSDK || false;
        //TODO: check if message is url encoded string
        let stringifyied_message = message;
        let chainId = this.chainId;
        console.log('chainId', chainId);
        let path = window.location.href.split('?')[0]
        path = encodeURIComponent(path);
        console.log('path', path);
        let finalURL = this.walletURI + `?signPersonalMessage=${stringifyied_message}&chainId=${chainId}&lastLocation=${path}&socketUUID=${this.socketUUID}&isMobileSDK=${this.mobileSDK}`;
        let that = this;
        return new Promise(function(resolve:any, reject:any){
            that.signedMessageCB = resolve;
            that.signedMessageRejectCB = reject;
            if(that.mobileSDK){
                (window as any).location = finalURL;
                return;
            }
            that.openedWindow = window.open(finalURL, '_blank', 'height=720,width=550');
        });
        // let message_stringify = JSON.stringify(message);
        // let that = this;
        // let finalURL = this.walletURI;
        // return new Promise(function(resolve:any, reject:any){
        //     that.signedMessageCB = resolve;
        //     that.signedMessageRejectCB = reject;
        //     window.open(finalURL, '_blank', 'height=720,width=550');
        // });        
    }
    
    private signedTransactionCB:any;
    private signedTransactionRejectCB:any;
    async signTransaction(
        transaction: ethersUtils.Deferrable<providers.TransactionRequest>,
        overviewMessage?:string,
        mobileSDK?:boolean,
        
    ): Promise<string>{
        this.mobileSDK = mobileSDK || false;
        let tx = await ethersUtils.resolveProperties(transaction);
        if (tx.from != null) {
            if (ethersUtils.getAddress(tx.from) !== this.address) {
                delete tx.from;
                
                return Promise.reject('Tx from address does not match signer address');
            }
        }
        let stringifyied_tx = JSON.stringify(tx);
        let that = this;
        //Check if transaction has chainId
        // if it is not the same as the signer's chainId
        // send that chain in request
        let chainId = this.chainId;
        if(tx.chainId!= chainId && tx.chainId){
            console.log('tx.chainId', tx.chainId);
            chainId = <number>tx.chainId;
        }
        let path = window.location.href.split('?')[0]
        let finalURL = this.walletURI + `?signTransaction=${stringifyied_tx}&chainId=${chainId}&lastLocation=${path}&socketUUID=${this.socketUUID}&isMobileSDK=${this.mobileSDK}`;
        if(overviewMessage){
            finalURL += `&overviewMessage=${overviewMessage}`;
        }
        //open a new tab if mobile and popup window if desktop with finalURL
        if(!this.mobileSDK){
            return new Promise(function(resolve:any, reject:any){
                that.signedTransactionCB = resolve;
                that.signedTransactionRejectCB = reject;
                if(that.mobileSDK){
                    (window as any).location = finalURL;
                    return;
                }
                that.openedWindow = window.open(finalURL, '_blank', 'height=720,width=550');
            });
        }
        else{
            return new Promise(function(resolve:any, reject:any){
                that.signedTransactionCB = resolve;
                that.signedTransactionRejectCB = reject;
                (window as any).location = finalURL;
            });
        }
    }
    
    async sendTransaction(transaction: ethersUtils.Deferrable<providers.TransactionRequest>): Promise<providers.TransactionResponse> {
        console.log('sendTransaction');
        if(!this.provider) {
            this.provider = await getInternalProvider(this.chainId);
        }
        this._checkProvider("sendTransaction");
        console.log('transaction', transaction);
        const tx = await this.populateTransaction(transaction);
        const signedTx = await this.signTransaction(tx);
        console.log('signedTx', signedTx);
        let sendingTx = await (this.provider as providers.Provider).sendTransaction(signedTx);
        console.log('sendingTx', sendingTx);
        return sendingTx;        
    }


    async handleTransactionResponse(data:any){
        if(data.action === 'approve'){
            this?.openedWindow?.close();
            this.signedTransactionCB(data.signedTransaction);
        }
        else if(data.action === 'decline'){
            this?.openedWindow?.close()
            this.signedTransactionRejectCB(data.errorReason);
        }
    }

    async handleMessageResponse(data:any){
        if(data.action === 'approve'){
            this?.openedWindow?.close();
            this.signedMessageCB(data.signedMessage);
        }
        else if(data.action === 'decline'){
            this?.openedWindow?.close()
            this.signedMessageRejectCB(data.errorReason);
        }
    }

}
export default ExtendedSigner;
