import sdk from './1-initialize-sdk.js';

const vote = sdk.getVote("0x6F6EE232514D4f725f7d73Bcb58cDA3eEE529a2f")

const token = sdk.getToken("0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6")

const transfer = async () => {
    try{
        await token.roles.grant("minter" , vote.getAddress());
        console.log("Successfully gave Voting Contract permission to act on token contract");
    }catch(error){
        console.log("Couldn't give Voting Contract permission to act on token contract " , error);
        process.exit(1);
    }
    try{
        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS)

        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = ownedAmount* 0.9

        await token.transfer(vote.getAddress() , percent90)

        console.log("✅ Succesfully transferred " + percent90 + " tokens to Voting Contract");
    }catch(err){
        console.log("Couldn't transfer tokens to Voting Contract " , err);
    }
}

transfer()