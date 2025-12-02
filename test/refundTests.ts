import { expect } from "chai";
import { ethers } from "hardhat";
import { testingStore } from "./utils";

describe("Product Refund Tests", function () {
  let store: any;
  let testStore: testingStore;
  let owner: any, buyer1: any, buyer2: any;

  beforeEach(async function () {
    [owner, buyer1, buyer2] = await ethers.getSigners();
    const Store = await ethers.getContractFactory("Store");
    store = await Store.connect(owner).deploy();
    await store.waitForDeployment();
    testStore = new testingStore();
  });
  
  // ========== PRODUCT REFUND TESTS ==========
  describe("Product Refunds", function () {
    beforeEach(async function () {
      await store.connect(owner).addProduct("TestProduct", 10);
    });

    it("Buyer can refund a product", async function () {
      // Buy the product
      await store.connect(buyer1).buyProduct(0);

      // Refund should succeed (within 100 blocks)
      await expect(
        store.connect(buyer1).refundProduct(0),
      ).to.not.be.reverted;
    });

    it("Owner can refund a product", async function () {
      // Buy the product as an owner
      await store.connect(owner).buyProduct(0);

      // Refund as an owner
      await expect(
        store.connect(owner).refundProduct(0),
      ).to.not.be.reverted;
    });

    it("Buyer can Not refund product after refund policy expires", async function () {
      await store.connect(buyer1).buyProduct(0);
      
      // Mine 101 blocks to exceed the 100-block refund window
      await testStore.mineBlocks(101);
      
      await expect(
        store.connect(buyer1).refundProduct(0)
      ).to.be.revertedWith("Sorry, your request for refund has been denied.");
    });

    it("Buyer can Not refund product he didn't buy", async function () {
      await store.connect(buyer1).buyProduct(0);
      
      await expect(
        store.connect(buyer2).refundProduct(0)
      ).to.be.reverted;
    });

    it("Buyer can Not refund same product twice", async function () {
      await store.connect(buyer1).buyProduct(0);
      await store.connect(buyer1).refundProduct(0);
      
      await expect(
        store.connect(buyer1).refundProduct(0)
      ).to.be.reverted;
    });

    it("Refunded product can be purchased again by same buyer", async function () {
      await store.connect(buyer1).buyProduct(0);
      await store.connect(buyer1).refundProduct(0);
      
      await expect(
        store.connect(buyer1).buyProduct(0)
      ).to.not.be.reverted;
    });
  });

  // ========== REFUND POLICY CONFIGURATION TESTS ==========
  describe("Refund Policy Configuration", function () {
    beforeEach(async function () {
      await store.connect(owner).addProduct("TestProduct", 10);
    });

    it("Owner can set blocktime for refunds", async function () {
      await store.connect(owner).setRefundPolicyNumber(50);
      
      await store.connect(buyer1).buyProduct(0);
      
      // Mine 51 blocks to exceed the new 50-block window
      await testStore.mineBlocks(51);
      
      await expect(
        store.connect(buyer1).refundProduct(0)
      ).to.be.revertedWith("Sorry, your request for refund has been denied.");
    });

    it("Non-owner can Not set blocktime for refunds", async function () {
      await expect(
        store.connect(buyer1).setRefundPolicyNumber(50)
      ).to.be.revertedWithCustomError(store, "OwnableUnauthorizedAccount");
    });
  });
});