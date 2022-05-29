import React, { useMemo } from "react";
import {useAddress , useMetamask , useEditionDrop , useToken , useVote , useNetwork } from '@thirdweb-dev/react'
import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from "@thirdweb-dev/sdk";

const App = () => {

  const adress = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("address : " , adress);

  const editionDrop = useEditionDrop("0x8a01d6CB6767649904Deb8f6282187D14C138EB2")
  const token = useToken("0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6")
  const vote = useVote("0x6F6EE232514D4f725f7d73Bcb58cDA3eEE529a2f")


  const [hasClaimedNFT , setHasClaimedNFT] = useState(false)
  const [isClaiming , setIsClaiming] = useState(false)

  const [memberTokenAmount , setMemberTokenAmount] = useState([])
  const [memberAddress , setMemberAddress] = useState([])

  const [proposals , setProposals] = useState([])
  const [isVoting , setIsVoting] = useState(false)
  const [hasVoted , setHasVoted] = useState(false)

  const shortenAddress = (str) => {
    return str.substring(0,6) + "....." + str.substring(str.length-4)
  }

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllProposals = async () => {
      try{
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 All Proposals : " , proposals);
      }catch(error){
        console.log("Failed to get Proposals");
      }
    }
    getAllProposals()
  } , [vote , hasClaimedNFT])

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    if(!proposals.length){
      return
    }

    const checkIfUserHasVoted  =async () => {
      try{
        const hasVoted  = await vote.hasVoted(proposals[0].proposalId , adress)
        setHasVoted(hasVoted);
        if(hasVoted){
          console.log("🥵 User has already voted");
        }else{
          console.log("🙂 User have not voted yet");
        }
      }catch(error){
        console.log("Failed to check if wallet has voted " , error);
      }
    }
    checkIfUserHasVoted();
  } , [vote  ,hasClaimedNFT , proposals , adress])

  useEffect(() =>{
    if(!adress){
      return;
    }

    const checkBalance = async ()=> {
      try{
        const balance = await editionDrop.balanceOf(adress , 0)

        if(balance.gt(0)){
          setHasClaimedNFT(true)
          console.log("🌟 This User has the membership NFT");
        }
        else{
          setHasClaimedNFT(false);
          console.log("😭 This User does'nt have the membership NFT");
        }
      }
      catch(error){
        setHasClaimedNFT(false);
        console.error("Failed to get the balance " , error);
      }
    };

    checkBalance();
  } , [adress , editionDrop]);

  useEffect(() => {
    if(!adress){
      return;
    }

    const getAllAddress = async () => {
      try{
        const memberAddress = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddress(memberAddress)
        console.log("🚀 Members Addresses " , memberAddress);
      }
      catch(err){
        console.log("There was an error in logging meber's address : " , err);
      }
    } ;
    getAllAddress()
  } , [editionDrop.history , hasClaimedNFT])

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllBalances = async ()=> {
      try{
        const amounts = await token.history.getAllHolderBalances()
        setMemberTokenAmount(amounts)
        console.log("👜 Token Amounts : " , amounts);
      }
      catch(err){
        console.log("Couldn't get token amounts : " , err);
      }
    };
    getAllBalances()
  } , [token.history , hasClaimedNFT]);

  const memberList = useMemo(() =>{
    return memberAddress.map((address)=>{
      const member = memberTokenAmount?.find(({holder}) => holder === address)

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    })
  },[memberAddress , memberTokenAmount] )

  const mintNFT = async ()=> {
    try{
      setIsClaiming(true)
      await editionDrop.claim("0" , 1)
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true)

    }catch(error){
      setHasClaimedNFT(false)
      console.log("Couldn't mint the membership NFT : " , error);
    }finally{
      setIsClaiming(false)
    }
  }

  if (adress && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }

  if(!adress){
    return(
      <div className="landing">
        <h1>Welcome to Twitter DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">Connect Your Wallet</button>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <img src="../scripts/assets/DTU.jpg" />
        <h1>Twitter DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                try {
                 
                  const delegation = await token.getDelegationOf(adress);
                  
                  if (delegation === AddressZero) {
                   
                    await token.delegateTo(adress);
                  }
                
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        
                        const proposal = await vote.get(proposalId);
                       
                        if (proposal.state === 1) {
                          
                          return vote.vote(proposalId, _vote);
                        }
                        
                        return;
                      })
                    );
                    try {
    
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          
                          const proposal = await vote.get(proposalId);
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      
                      setHasVoted(true);
                     
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                       
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪 Twitter DAO Membership NFT</h1>
      <button onClick={mintNFT} disabled={isClaiming}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
      
    </div>
  );
};

export default App;

