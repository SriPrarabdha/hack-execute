import sdk from "./1-initialize-sdk.js";
import { AddressZero } from "@ethersproject/constants";

//token address : 0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6

const token = async () => {
    try{
        const tokenAddress = await sdk.deployer.deployToken({
            name : "Twitter DAO Governance Token" ,
            symbol : "TWEET",
            primary_sale_recipient : AddressZero
        });

        console.log("✅ Successfully deployed token module, address: " , tokenAddress);
    }
    catch(error){
        console.log("Could'nt deploy governance token " , error);
    }
}

token()