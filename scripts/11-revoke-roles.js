import sdk from './1-initialize-sdk.js'

const token = sdk.getToken("0xEB9D90839E4d54916a7aC0b0ffbF82bBD2D617b6")

const revoke = async () => {
    try{
        const allRoles = await token.roles.getAll();
        console.log("👀 Roles that exist right now : " , allRoles);

        await token.roles.setAll({ admin : [] , minter : []})
        console.log("🎉 Roles after revoking ourself : " , await token.roles.getAll());
        console.error("Failed to revoke ourselves from the DAO trasury", error);

    }catch(err){
        console.log("Failed to revoke our role");
    }
}

revoke()