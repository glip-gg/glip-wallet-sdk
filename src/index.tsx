import React from "react";
import { createRoot } from "react-dom/client";

import { io } from 'socket.io-client';
import MainComponent from './components/Main';
import GlipSigner from './sub_modules/Signer';
import GlipProvider from './sub_modules/Provider';
import { providers } from "ethers";
import { v4 as uuidv4 } from 'uuid';

const WEB_SOCKET_URI = 'https://be.namasteapis.com/wallet';

function createLoginModal(glipWallet:any){
    const root = createRoot((document as any).getElementById("glip-wallet"));
    root.render(
        <React.StrictMode>
            <MainComponent glipWallet={glipWallet} />
        </React.StrictMode>
    );
}


const GLIP_WALLET_BASE_URL = `https://glip.gg/wallet-host/`;
const GLIP_WALLET_IFRAME_URL = `https://glip.gg/wallet-host/`;

const GLIP_WALLET_LOGIN_URL = `https://glip.gg/wallet-login/`;

//const GLIP_WALLET_BASE_URL = `http://localhost:3000/wallet-host/`;
//const GLIP_WALLET_IFRAME_URL = `http://localhost:3000/wallet-host/`;
//const GLIP_WALLET_LOGIN_URL = `http://localhost:3000/`;

type onLoginChangeCBTYpe = (isLoggedIn:boolean) => void;

interface GlipWalletInitParams {
    chainId: number;
    authNetwork:string;
    clientIdentifier:string
}

class GlipWallet {
    chainId:number = 1;
    authNetwork:string = '';
    clientIdentifier:string = '';
    onLoginChange:onLoginChangeCBTYpe = ()=>{};
    iWin:any = false;
    iframeInitialized = false;
    initOngoing = false;
    globalInitPromise:any;
    connectedSocket:any;
    socketUUID:string = '';
    walletDiv:any;
    walletIframe:any;

    private glipSigner:GlipSigner|null;
    
    constructor(){
        this.createWalletDiv();
        window.onmessage = (e:MessageEvent<any>)=> {
            this.handleMessage(e)
        };
        this.initializeWebSocket();
        // first just set to null
        // initialize when signer first requested and only
        // if user is loggedin.
        this.glipSigner = null;
    }

    initializeWebSocket(){
        // create a new uuid
        const uuid = uuidv4();
        this.socketUUID = uuid;
        console.log('socket uuid', uuid);
        const socket = io(WEB_SOCKET_URI, {
            transports: ['websocket'],
            query: {roomId: uuid}
        });
        this.connectedSocket = socket;
        console.log('socket initializing');
        socket.on('connect', () => {
            socket.on('message', async (data: any) => {
                console.log('data', data);
                let parsedData = JSON.parse(data.data);
                if(parsedData.type === "signedTransactionRetVal"){
                    console.log('parsedData', parsedData);
                    (await this.getSigner()).handleTransactionResponse(parsedData);
                }
            });
            socket.on('data', (data:any) => {
                console.log('data', data);
            });
            socket.on('error', function(data){
                console.log('socket error',data);
            });
            
            socket.on('close', function(data){
                console.log('socket close',data);
            });
            socket.on('connect_error', function(err) {
                console.log("socket connect_error: ", err);
            });
            
            socket.on('connect_timeout', function(err) {
                console.log("socket connect_timeout: ", err);
            });
        });
    }

    
    private initCB:any;
    private initRejectCB:any;
    init({chainId, authNetwork, clientIdentifier}:GlipWalletInitParams){
        //init could be called before iframe has full loaded
        if(this.initOngoing){
            return this.globalInitPromise;
        }
        this.chainId = chainId;
        this.authNetwork = authNetwork;
        this.clientIdentifier = clientIdentifier;
        this.initOngoing = true;
        const that = this;
        let initPromise = new Promise(function(resolve:any, reject:any){
            that.initCB = resolve;
            that.initRejectCB = reject;
            that.initInternal();
        });
        this.globalInitPromise = initPromise;
        return this.globalInitPromise;
    }

    private initInternal(){
        if(this.iframeInitialized){
            this.iWin.postMessage(
                {call: 'init', params: {
                    chain: this.chainId,
                    authNetwork: this.authNetwork,
                    clientIdentifier: this.clientIdentifier
                }}, '*');
        }
    }
    
    _createIframe(iframeContainerDiv:any){
        this.walletIframe = document.createElement('iframe');
        this.walletIframe.style.display = "none";
        this.walletIframe.style.display = "relative";
        this.walletIframe.src = GLIP_WALLET_IFRAME_URL;
        const that = this;
        this.walletIframe.onload = () => {
            that.iWin = this.walletIframe.contentWindow || this.walletIframe;
            that.iframeInitialized = true;
            if(that.initOngoing){
                that.initInternal();
            }
        };
        iframeContainerDiv.appendChild(this.walletIframe);
    }
    
    createWalletDiv(){
        //create a fixed div into html but keep it hidden initially
        const walletDiv = document.createElement('div');
        walletDiv.id = "glip-wallet-container";
        walletDiv.style.display = "none";
        walletDiv.style.position = "fixed";
        walletDiv.style.top = "0";
        walletDiv.style.right = "0";
        walletDiv.style.zIndex = "2323123";
        this.walletDiv = walletDiv;
        // insert div into top of body.
        document.body.insertBefore(walletDiv, document.body.firstChild);
        this.walletDiv.innerHTML = "<img src='https://live-nft-hosted-assets.s3.ap-south-1.amazonaws.com/cancel_icon.svg' style='position:absolute;left: -20px;background: black;padding: 3px;border-radius:50%' onclick='window.glipWalletSDK.hideWallet()'/>"
        this._createIframe(walletDiv);
    }

    showWallet(){
        this.walletDiv.style.display = "block";
        this.walletIframe.style.display = "block";
        // Set height and width of the iframe to 600x341
        this.walletIframe.style.height = "600px";
        this.walletIframe.style.width = "341px";
        this.walletIframe.style.border = "0px";
        this.walletIframe.style.borderRadius  = "3%";
    };

    hideWallet(){
        console.log('hide wallet');
        this.walletDiv.style.display = "none";
        this.walletIframe.style.display = "none";
    };

    showConnectModal(){
        createLoginModal(this);
    }

    login(
        loginType:string,
        lastLocation:string,
        opts:any){
        if(loginType === 'google'){
            const glipRedirectURL = `https://glip.gg/wallet-login/`
            const glipGoogleOpts = {
                'scope': 'https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email',
                'redirect_uri': glipRedirectURL,
                client_id:'373196446500-ojt3ko1ghis9pritfhhogohlotut2hv6.apps.googleusercontent.com',
            }
            const currState = {
                lastLocation: lastLocation,
                clientIdentifier: this.clientIdentifier,

            }
            const currOpts = opts || glipGoogleOpts;
            const GOOGLE_OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=${currOpts['scope']}&response_type=code&redirect_uri=${currOpts.redirect_uri}&client_id=${glipGoogleOpts.client_id}&access_type=offline&state=${JSON.stringify(currState)}`
            window.location.href = GOOGLE_OAUTH_URL;
            //window.location.href](https://window.location.href/) = `${GLIP_WALLET_LOGIN_URL}?loginType=${loginType}&lastLocation=${lastLocation}`;
             
        }
        return;
        //(window as any).location = `${GLIP_WALLET_LOGIN_URL}?loginType=${loginType}&authNetwork=${this.authNetwork}&lastLocation=${lastLocation}&clientIdentifier=${this.clientIdentifier}&chain=${this.chainId}`;
    }
                


    private getUserInfoCB:any;
    private getUserInfoRejectCB:any;
    getUserInfo(){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.getUserInfoCB = resolve;
            that.getUserInfoRejectCB = reject;
            that.iWin.postMessage(
                {call: 'getUserInfo', params: {}}, '*');
        });
    }
    
    private isConnectedCB:any;
    private isConnectedRejectedCB:any;
    isConnected(){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.isConnectedCB = resolve;
            that.isConnectedRejectedCB = reject;
            that.iWin.postMessage(
                {call: 'isConnected', params: {}}, '*');
        });
    }
    
    private getWalletIDCB:any;
    private getWalletIdRejectCB:any;
    getWalletID(){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.getWalletIDCB = resolve;
            that.getWalletIdRejectCB = reject;
            that.iWin.postMessage(
                {call: 'getWalletID', params: {}}, '*');
        });
    }

    private logoutCB:any;
    private logoutRejectedCB:any;
    logout(){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.logoutCB = resolve;
            that.logoutRejectedCB = reject;
            that.iWin.postMessage(
                {call: 'logout', params: {}}, '*');
        });
    }
    
    _loginWithIdToken({loginType, userInfo, verifier}:any){
        let GLIP_WALLET_BASE_URL = 'http://127.0.0.1:8080/';
        (window as any).location = `${GLIP_WALLET_BASE_URL}#loginType=${loginType}&chain=${this.chainId}&verifier=${verifier}&id=${userInfo.id}&idToken=${userInfo.idToken}&clientIdentifier=${this.clientIdentifier}&accessToken=${userInfo.accessToken}`;
    }

    // handles messages from the iFrame
    handleMessage(event:MessageEvent<any>) {
        if (event.data.call === "getUserInfo") {
            if(event.data.errorVal){
                this.getUserInfoRejectCB(event.data.errorVal);
            }
            this.getUserInfoCB(event.data.retVal);
        }
        else if (event.data.call === "init") {
            // resetting initcalled
            this.initOngoing = false;
            this.initCB(event.data.retVal);
        }
        else if (event.data.call === "getWalletID") {
            this.getWalletIDCB(event.data.retVal);
        }
        else if (event.data.call === "isConnected") {
            this.isConnectedCB(event.data.retVal);
        }
        else if (event.data.call === "logout") {
            this.logoutCB(event.data.retVal);
        }
    }

    async getSigner(provider?: providers.Provider){
        if(this.glipSigner){
            return this.glipSigner;
        }
        let isConnected = await this.isConnected()
        if(isConnected){
            let userInfo:any = await this.getUserInfo()
            this.glipSigner = new GlipSigner(
                userInfo.publicAddress,
                GLIP_WALLET_BASE_URL,
                false,
                this.chainId,
                this.socketUUID,
                provider,                
            );
            return this.glipSigner;
        }
        else{
            throw ("Need to be signed in to get signer");
        }
    }
    
    async getSignedTransaction(){
        const urlParams = new URLSearchParams(window.location.search);
        let signedTransactionApproved = urlParams.get('action');
        if(signedTransactionApproved=== 'approve'){
            let signedTransaction = urlParams.get('signedTransaction');
            return signedTransaction;
        }
        else{
            return false;
        }
    }
    
}

let initializedGlipWallet: GlipWallet|boolean = false;
const getGlipWallet = async (
    chainId:number, authNetwork:string, clientIdentifier:string) => {
        if(initializedGlipWallet) {
        return initializedGlipWallet;
    }
    await glipWalletSDK.init({
        chainId: chainId,
        authNetwork: authNetwork,
        clientIdentifier: clientIdentifier,
    });
    initializedGlipWallet = glipWalletSDK;
    return glipWalletSDK;
};

let glipWalletSDK:GlipWallet = new GlipWallet();
(window as any).glipWalletSDK = glipWalletSDK;
export { glipWalletSDK, getGlipWallet };
