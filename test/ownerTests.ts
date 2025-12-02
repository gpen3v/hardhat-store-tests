import { expect } from "chai";
import { ethers } from "hardhat";
import { testingStore } from "./utils";

describe("Testing with Owner", function () {
  let store: any;
  let testStore: testingStore;
  let owner: any, buyer: any;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();
    const Store = await ethers.getContractFactory("Store");
    store = await Store.connect(owner).deploy();
    await store.waitForDeployment();
    testStore = new testingStore();
  });

  // ========== PRODUCT ADDITION TESTS ==========
  describe("Add Products", function () {
    it("Owner can add a new product with quantity", async function () {
      await store.connect(owner).addProduct("TestProduct", 10);
      await testStore.validateProductByName(store, "TestProduct", 10)
    });

    it("Owner can buy a product", async function () {
      await store.connect(owner).addProduct("TestProduct", 10);
      await store.connect(owner).buyProduct(0);
      await testStore.expectBuyerOfProduct(store, owner, 0);
    });

    it("Owner can add multiple different products", async function () {
      await store.connect(owner).addProduct("TestProduct1", 10);
      await store.connect(owner).addProduct("TestProduct2", 20);
      await store.connect(owner).addProduct("TestProduct3", 15);

      await testStore.expectProductsCount(store, 3);
    });

    it("Adding same product updates quantity instead of creating duplicate", async function () {
      await store.connect(owner).addProduct("TestProduct1", 10);
      await store.connect(owner).addProduct("TestProduct1", 5);

      const all = await store.getAllProducts();
      expect(all.length).to.equal(1);
      expect(all[0].quantity).to.equal(5);
    });

    it("Non-owner can Not add a product", async function () {
      await expect(store.connect(buyer).addProduct("TestProduct1", 10)).to.be.revertedWithCustomError(store, "OwnableUnauthorizedAccount");
      await expect(store.getProductByName("TestProduct1")).to.be.revertedWith("This product does not exist!");
      
      await testStore.expectProductsCount(store, 0);
    });

    it("Owner can Not add product with empty name", async function () {
      await expect(store.connect(owner).addProduct("", 10)).to.be.revertedWith("You have to enter a name!");
    });

    it("Owner can Not add product with zero quantity", async function () {
      await expect(store.connect(owner).addProduct("TestProduct1", 0)).to.be.revertedWith("Quantity can't be 0!");
      await expect(store.getProductByName("TestProduct1")).to.be.revertedWith("This product does not exist!");

      await testStore.expectProductsCount(store, 0);
    });
  });

  // ========== UPDATE QUANTITY TESTS ==========
  describe("Update Product Quantity", function () {
    beforeEach(async function () {
      await store.connect(owner).addProduct("TestProduct", 10);
    });

    it("Owner can update product quantity", async function () {
      await store.connect(owner).updateProductQuantity(0, 20);
      await testStore.validateQuantity(store, 0, 20);
    });

    it("Non-owner can Not update product quantity", async function () {
      await expect(store.connect(buyer).updateProductQuantity(0, 20)).to.be.revertedWithCustomError(store, "OwnableUnauthorizedAccount");
    });
  });
});