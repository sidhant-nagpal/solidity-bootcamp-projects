import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Ballot, Ballot__factory } from "../typechain-types";
dotenv.config()

// const proposals = ["Raspberry","Pistacchio","Vanilla"];

async function main() { 
    const provider = ethers.getDefaultProvider("goerli", {infura: process.env.INFURA_API_KEY, alchemy: process.env.ALCHEMY_API_KEY, etherscan: process.env.ETHERSCAN_API_KEY});
    // const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(
        `Connected to the account of address ${
            signer.address
        }\nThis account has a balance of ${balanceBN.toString()} Wei`
    );

    const args = process.argv;
    const proposals = args.slice(2);
    if(proposals.length <= 0) throw new Error("Not enough arguments");
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N.${index + 1}: ${element}`);
    });
    let ballotContract: Ballot;
    // let accounts: SignerWithAddress[];
    // accounts = await ethers.getSigners();
    // const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = await ballotContractFactory.deploy(proposals.map(x => ethers.utils.formatBytes32String(x)));
    await ballotContract.deployed();
    console.log(
        `The contract was deployed at the address ${ballotContract.address}`
    );
    const chairperson = await ballotContract.chairperson();
    console.log(`The address of the chairperson is ${chairperson}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});