export declare const Greeter: (name: string) => string;
declare type onLoginChangeCBTYpe = (isLoggedIn: boolean) => void;
interface SkadiWalletInitParams {
    chain: string;
    authNetwork: string;
    onLoginChange: onLoginChangeCBTYpe;
}
declare class SkadiWallet {
    chain: string;
    authNetwork: string;
    onLoginChange: onLoginChangeCBTYpe;
    constructor({ chain, authNetwork, onLoginChange }: SkadiWalletInitParams);
    _createIframe(): void;
    _onIframeLoad(): void;
    _checkIfLoaded(): number;
}
export { SkadiWallet };
