import { AddressZero } from "@ethersproject/constants";
import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

//contrac deployed at 0x8a01d6CB6767649904Deb8f6282187D14C138EB2

const drop = async ()=>{
    try{
        const editionDropAddress = await sdk.deployer.deployEditionDrop({

            name : "Twitter DAO MEMBERSHIP" ,
            description : "A DAO for all twitter community members" ,
            image : readFileSync("scripts/assets/twitter.jpg") ,
            primary_sale_recipient : AddressZero
        });

        const editionDrop = sdk.getEditionDrop(editionDropAddress)

        const metadata = await editionDrop.metadata.get()

        console.log("✅ Successfully deployed editionDrop contract, address:",editionDropAddress);
        console.log("✅ editionDrop metadata:", metadata);
    }
    catch(error){
        console.log("Failed to deploy the editionDrop contract " , error);
    }
}

drop()
