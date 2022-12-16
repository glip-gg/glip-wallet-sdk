import {ethers} from "ethers";
import {getChainDetails} from "./chainListService";

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


export {getInternalProvider, getChainDetails};
