import { expect } from "chai";
import { ethers } from "hardhat";
import { testingStore } from "./utils";

describe("Store Contract - Full workflow", function () {
  let store: any;
  let testStore: testingStore;
  let owner: any, buyer1: any, buyer2: any;

  it("Add, See, Buy, Update quantity, Refund", async function () {
    [owner, buyer1, buyer2] = await ethers.getSigners();
    const Store = await ethers.getContractFactory("Store");
    store = await Store.connect(owner).deploy();
    await store.waitForDeployment();
    testStore = new testingStore();

    // Owner adds product
    await store.connect(owner).addProduct("TestProduct", 5);
    // Validate quantity of the added product and save it for later
    await testStore.validateQuantity(store, 0, 5);
    const startQuantity = await testStore.getQuantity(store, "TestProduct");

    // Buyers can see the product
    await expect(
      store.connect(buyer1).getProductById(0),
    ).to.not.be.reverted;
    await expect(
      store.connect(buyer2).getProductByName("TestProduct"),
    ).to.not.be.reverted;
    
    // buyer1 buys
    await store.connect(buyer1).buyProduct(0);
    // Validate the buyer
    await testStore.expectBuyerOfProduct(store, buyer1, 0);
    // Validate quantity decrease
    await testStore.validateQuantity(store, 0, startQuantity - 1);

    // Owner updates quantity
    await store.connect(owner).updateProductQuantity(0, 10);
    await testStore.validateQuantity(store, 0, 10);
    const updatedQuantity = await testStore.getQuantity(store, "TestProduct");

    // buyer2 buys
    await store.connect(buyer2).buyProduct(0);
    // Validate the buyers are 2
    await testStore.expectBuyersCount(store, 0, 2);
    // Validate quantity decrease
    await testStore.validateQuantity(store, 0, updatedQuantity - 1);
  
    // buyer1 refunds
    await store.connect(buyer1).refundProduct(0);
    // Validate quantity increase
    await testStore.validateQuantity(store, 0, updatedQuantity); // There is a bug here
    
    // buyer1 buys again
    await store.connect(buyer1).buyProduct(0);
    await testStore.validateQuantity(store, 0, updatedQuantity - 1);
  });
});