import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x8a01d6CB6767649904Deb8f6282187D14C138EB2");

const config = async ()=>{
    try{
        await editionDrop.createBatch([
            {
                name:"Twitter Free" ,
                description : "This NFT will give you access to twitter DAO" ,
                image : readFileSync("scripts/assets/twitter.jpg") ,
            } ,
        ])
        console.log("✅ Successfully created a new NFT in the drop!");
    }
    catch(error){
        console.log("Failed to create a new NFT " , error);
    }
}

config()