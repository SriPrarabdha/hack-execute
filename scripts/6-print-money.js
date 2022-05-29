import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6");

const money = async () => {
  try {
    
    const amount = "1000000";
   
    await token.mintTo("0x13B1921864239E3313e035deE67Daa182f470A02" , amount);
    const totalSupply = await token.totalSupply();

    
    console.log("✅ There now is", totalSupply.displayValue, "$TWEET in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
}
}

money();