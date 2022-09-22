"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkadiWallet = exports.Greeter = void 0;
var Greeter = function (name) { return "Hello ".concat(name); };
exports.Greeter = Greeter;
var SkadiWallet = /** @class */ (function () {
    function SkadiWallet(_a) {
        var chain = _a.chain, authNetwork = _a.authNetwork, onLoginChange = _a.onLoginChange;
        this.chain = chain;
        this.authNetwork = authNetwork;
        this.onLoginChange = onLoginChange;
        this._createIframe();
    }
    SkadiWallet.prototype._createIframe = function () {
        var iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.src = "http://localhost:3000";
        var that = this;
        iframe.onload = function () {
            that._onIframeLoad();
        };
        document.body.appendChild(iframe);
    };
    SkadiWallet.prototype._onIframeLoad = function () {
        window.skadiGlobalSDK.init(this.chain, this.authNetwork, this.onLoginChange);
    };
    SkadiWallet.prototype._checkIfLoaded = function () {
        var aman = 2 + 2;
        return aman;
    };
    return SkadiWallet;
}());
exports.SkadiWallet = SkadiWallet;
