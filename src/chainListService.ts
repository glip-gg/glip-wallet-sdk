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

export {getChainDetails};
