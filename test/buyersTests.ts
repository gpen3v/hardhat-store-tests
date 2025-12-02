import { expect } from "chai";
import { ethers } from "hardhat";
import { testingStore } from "./utils";

describe("Testing with Buyers", function () {
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

  // ========== PRODUCT BUYING TESTS ==========
  describe("Products Buying", function () {
    beforeEach(async function () {
      await store.connect(owner).addProduct("TestProduct1", 10);
      await store.connect(owner).addProduct("TestProduct2", 5);
    });

    it("Buyer can buy available products", async function () {
      await store.connect(buyer1).buyProduct(0);
      await store.connect(buyer1).buyProduct(1);

      await testStore.expectBuyerOfProduct(store, buyer1, 0);
      await testStore.expectBuyerOfProduct(store, buyer1, 1);
    });

    it("Different buyers can buy the same product", async function () {
      await store.connect(buyer1).buyProduct(0);
      await store.connect(buyer2).buyProduct(0);
      
      const buyers = await store.connect(owner).getProductBuyersById(0);
      expect(buyers.length).to.equal(2);
      expect(buyers[0]).to.equal(buyer1.address);
      expect(buyers[1]).to.equal(buyer2.address);
    });

    it("Buyer can Not buy the same product twice", async function () {
      await store.connect(buyer1).buyProduct(0);
      
      await expect(
        store.connect(buyer1).buyProduct(0)
      ).to.be.revertedWith("You cannot buy the same product more than once!");
    });

    it("Buyer can Not buy product with insufficient quantity", async function () {
      await store.connect(owner).addProduct("TestProduct3", 1);
      await testStore.expectProductsCount(store, 3);

      await store.connect(buyer1).buyProduct(2);
      await expect(store.connect(buyer2).buyProduct(2)).to.be.revertedWith("Quantity can't be 0!");
    });

    it("Buyer can Not buy non-existent product", async function () {
      await expect(
        store.connect(buyer1).buyProduct(5)
      ).to.be.revertedWith("This product does not exist!");
    });
  });

  // ========== PRODUCT VIEWING TESTS ==========
  describe("Product Viewing", function () {
    beforeEach(async function () {
      await store.connect(owner).addProduct("TestProduct1", 10);
      await store.connect(owner).addProduct("TestProduct2", 20);
      await store.connect(owner).addProduct("TestProduct3", 15);
    });

    it("Any user can view all products", async function () {
      const all = await store.connect(buyer1).getAllProducts();
      expect(all.length).to.equal(3);
    });

    it("Any user can get product by name", async function () {
      await testStore.validateProductByName(store, "TestProduct1", 10);
    });

    it("Any user can get product by id", async function () {
      const product = await store.connect(buyer1).getProductById(0);
      expect(product.name).to.equal("TestProduct1");
    });

    it("Getting non-existent product by name throws error", async function () {
      await expect(
        store.connect(buyer1).getProductByName("NonExistentProduct")
      ).to.be.revertedWith("This product does not exist!");
    });
  });
});