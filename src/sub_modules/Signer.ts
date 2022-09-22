"use strict";

import {Signer, providers, Bytes, utils as ethersUtils} from "ethers";

const SIGNER_EXTENSION_URL = 'wallet-confirmation/'

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
        this.provider = provider;
        this.address = address;
        this.walletURI = walletURI + SIGNER_EXTENSION_URL;
        this.isMobile = isMobile;
        this.chainId = chainId;
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
    async signMessage(message: Bytes | string): Promise<string>{
        console.log('Currently not implemented');
        return Promise.resolve('Not implemented');
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
        overviewMessage?:string
        
    ): Promise<string>{
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
        let finalURL = this.walletURI + `?signTransaction=${stringifyied_tx}&chainId=${chainId}&lastLocation=${window.location.href}&socketUUID=${this.socketUUID}`;
        if(overviewMessage){
            finalURL += `&overviewMessage=${overviewMessage}`;
        }
        //open a new tab if mobile and popup window if desktop with finalURL
        if(!this.mobileSDK){
            return new Promise(function(resolve:any, reject:any){
                that.signedTransactionCB = resolve;
                that.signedTransactionRejectCB = reject;
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

}
export default ExtendedSigner;
