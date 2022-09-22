export class NFTMarketplaceUtils {
    
    private fetchNFTCB:any;
    private fetchNFTRejectCB:any;
    private iWin:any;

    constructor(iWin:any){
        this.iWin = iWin;
    }
    
    fetchNFTs(){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.fetchNFTCB = resolve;
            that.fetchNFTRejectCB = reject;
            that.iWin.postMessage(
                {call: 'fetchNFTs', params: {}}, '*');
        });
    }

    private transferNFTCB:any;
    private transferNFTRejectCB:any;
    
    transferNFT(walletId:string, tokenId:string, amount:number){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.transferNFTCB = resolve;
            that.transferNFTRejectCB = reject;
            that.iWin.postMessage(
                {call: 'transferNFT', params: {
                    walletId,
                    tokenId,
                    amount
                }}, '*');
        });
    }
    
    private sellNFTCB:any;
    private sellNFTRejectCB:any;
    sellNFT(tokenId:string, amount:number, currencyId:string, currencyAmount:number){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.sellNFTCB = resolve;
            that.sellNFTRejectCB = reject;
            that.iWin.postMessage(
                {call: 'sellNFT', params: {
                    tokenId,
                    amount,
                    currencyId,
                    currencyAmount
                }}, '*');
        });
    }
    
    private buyNFTCB:any;
    private buyNFTRejectCB:any;
    buyNFT(sellOrderId: string){
        const that = this;
        return new Promise(function(resolve:any, reject:any){
            that.buyNFTCB = resolve;
            that.buyNFTRejectCB = reject;
            that.iWin.postMessage(
                {call: 'buyNFT', params: {
                    sellOrderId
                }}, '*');
        });
    }

        // handles messages from the iFrame
    handleMessage(event:MessageEvent<any>) {
        if (event.data.call === "fetchNFTs") {
            this.fetchNFTCB(event.data.retVal);
        }
        else if (event.data.call === "transferNFT") {
            this.transferNFTCB(event.data.retVal);
        }
        else if (event.data.call === "sellNFT") {
            this.sellNFTCB(event.data.retVal);
        }
        else if (event.data.call === "buyNFT") {
            this.buyNFTCB(event.data.retVal);
        }
    }

}
