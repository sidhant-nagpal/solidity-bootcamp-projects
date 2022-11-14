import { ethers } from "ethers";
import * as dotenv from 'dotenv'
import { Ballot, Ballot__factory } from "../typechain-types";
dotenv.config()

async function main() {
    const provider = ethers.getDefaultProvider("goerli", {
        infura: process.env.INFURA_API_KEY, 
        alchemy: process.env.ALCHEMY_API_KEY, 
        etherscan: process.env.ETHERSCAN_API_KEY
    });
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(
        `Connected to the account of address ${
            signer.address
        }\nThis account has a balance of ${balanceBN.toString()} Wei`
    );

    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    const targetAccount = params[1];

    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = ballotContractFactory.attach(contractAddress);
    const tx = await ballotContract.giveRightToVote(targetAccount);
    const receipt = await tx.wait();
    console.log(receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});