import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC20, MyERC20__factory } from "../typechain-types";

describe("Basic tests for understanding ERC20", async () => {
    let accounts: SignerWithAddress[];
    let erc20TokenContract: MyERC20;
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const erc20TokenFactory = new MyERC20__factory(accounts[0]);
        erc20TokenContract = await erc20TokenFactory.deploy();
        await erc20TokenContract.deployed();
    });

    it("should have zero total supply at deployment", async () => {
        const totalSupply = await erc20TokenContract.totalSupply();
        expect(totalSupply).to.eq(0);
    });

    it("triggers the Transfer event with the address of the sender when sending transactions", async () => {
        const mintTx = await erc20TokenContract.mint(accounts[0].address, 10);
        await mintTx.wait();
        await expect(erc20TokenContract.transfer(accounts[1].address, 1))
        .to.emit(erc20TokenContract, "Transfer")
        .withArgs(accounts[0].address, accounts[1].address, 1);
    });
});