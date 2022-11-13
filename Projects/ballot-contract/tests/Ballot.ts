import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types"

const PROPOSALS = ["Raspberry","Pistacchio","Vanilla"];

// function convertStringArrayToBytes32(array: string[]) {
//     const bytes32Array = [];
//     for (let index = 0; index < array.length; index++) {
//       bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
//     }
//     return bytes32Array;
// }

describe("Ballot", async () => {
    let ballotContract: Ballot;
    let accounts: SignerWithAddress[];
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(PROPOSALS.map(x => ethers.utils.formatBytes32String(x)));
        await ballotContract.deployed();        
    });
    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async () => {
            for(let i = 0; i<PROPOSALS.length; i++){
                const proposal = await ballotContract.proposals(i);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.equal(PROPOSALS[i]);
            }
        });
        it("sets the deployer address as chairperson", async () => {
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.equal(accounts[0].address);
        })

        it("sets the voting weight for the chairperson as 1", async function () {
            const chairpersonVoter = await ballotContract.voters(accounts[0].address);
            expect(chairpersonVoter.weight).to.equal(1);
        });
    })
})