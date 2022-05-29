import sdk from './1-initialize-sdk.js';

//deployed at : 0x6F6EE232514D4f725f7d73Bcb58cDA3eEE529a2f

const vote = async () => {
    try{
        const voteContractAddress = await sdk.deployer.deployVote({
            name : 'Twitter DAO' ,
            voting_token_address : "0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6" ,
            voting_delay_in_blocks : 0 ,
            voting_period_in_blocks : 6570 , 
            voting_quorum_fraction : 0 ,
            proposal_token_threshold : 0 ,
        })

        console.log("✅ Voting Contract successfully deployed at : " , voteContractAddress);
    }
    catch(err){
        console.log("Couldn't deploy the voting Contract " , err);
    }
}

vote()