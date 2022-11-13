import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";

describe("Hello World", async () => {

    let helloWorldContract: HelloWorld;
    let signers: SignerWithAddress[];

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        helloWorldContract = await helloWorldFactory.deploy();
        await helloWorldContract.deployed();
    });

    it("Should give a Hello World", async () => {
        const text = await helloWorldContract.helloWorld();
        expect(text).to.equal("Hello World");
    })

    it("Should set owner to deployer account", async () => {
        const contractOwner = await helloWorldContract.owner();
        expect(contractOwner).to.equal(signers[0].address);
    })

    it("Should change text correctly", async () => {
        const newText = "New Text";
        const tx = await helloWorldContract.setText(newText);
        await tx.wait();
        const text = await helloWorldContract.helloWorld();
        expect(text).to.equal(newText);
    })

    it("Should not allow anyone other than owner to change text", async function () {
        const newText = "New Text";
        await expect(helloWorldContract.connect(signers[1]).setText(newText)).to.be.reverted;
    });
});
