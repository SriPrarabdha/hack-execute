import { log } from 'util';
import sdk from './1-initialize-sdk.js'

const editionDrop = sdk.getEditionDrop("0x8a01d6CB6767649904Deb8f6282187D14C138EB2");

const token = sdk.getToken("0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6")

const airdrop = async () =>{
    try{
        const walletAddress =  await editionDrop.history.getAllClaimerAddresses(0);
        if(walletAddress===0){
            console.log("✅ No NFTs claimed yet . Maybe get some friends to claim free NFT");
            process.exit(0);
        }

        const airDropTargets = walletAddress.map((address) => {
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
            console.log("Going to airdrop " , randomAmount , "token to " , address);

            const airDropTarget = {
                toAddress : address ,
                amount : randomAmount
            }

            return airDropTarget
        } )

        console.log("🌈 Starting the airdrop...");
        await token.transferBatch(airDropTargets)
        console.log("Token transferred to all the DAO members");
        

    }
    catch(err){
        console.log("Coluldn't airdrop tokens : " , err);
    }
}

airdrop()