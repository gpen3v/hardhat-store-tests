import { expect } from "chai";
import { ethers } from "hardhat";

// Helping class with reusable test assertions and utilities for the Store contract
export class testingStore {
  /**
   * Assert that the store has the expected number of products.
   * @param store - Contract instance of the Store
   * @param expectedCount - Expected number of products in the store
   */
  async expectProductsCount(store: any, expectedCount: number) {
    const all = await store.getAllProducts();
    expect(all.length).to.equal(expectedCount);
  }

  /**
   * Assert that a product has the expected number of buyers.
   * @param store - Contract instance of the Store
   * @param productId - ID of the product to check
   * @param buyersCount - Expected number of buyers for the product
   */
  async expectBuyersCount(store: any, productId: number, buyersCount: number) {
    const buyers = await store.getProductBuyersById(productId);
    expect(buyers.length).to.equal(buyersCount);
  }

  /**
   * Assert that a specific buyer is the (single) buyer of a product.
   * Useful when expecting exactly one buyer for a product.
   * @param store - Contract instance of the Store
   * @param expectedBuyer - Signer object expected to have bought the product
   * @param expectedProductId - ID of the product
   */
  async expectBuyerOfProduct(store: any, expectedBuyer: any, expectedProductId: number) {
    const buyers = await store.getProductBuyersById(expectedProductId);
    expect(buyers.length).to.equal(1);
    expect(buyers[0]).to.equal(expectedBuyer.address);
  }
  
  /**
   * Validate that a product by name exists and has the expected quantity.
   * @param store - Contract instance of the Store
   * @param productName - Name of the product to validate
   * @param expectedQuantity - Expected quantity of the product
   */
  async validateProductByName(store: any, productName: string, expectedQuantity: number) {
    const product = await store.getProductByName(productName);
    expect(product.name).to.equal(productName);
    expect(product.quantity).to.equal(expectedQuantity);
  }

  /**
   * Validate the quantity of a product by its ID.
   * @param store - Contract instance of the Store
   * @param productId - ID of the product
   * @param expectedQuantity - Expected quantity value
   */
  async validateQuantity(store: any, productId: number, expectedQuantity: number ) {
    const product = await store.getProductById(productId);
    expect(product.quantity).to.equal(expectedQuantity);
  }

  /**
   * Retrieve the quantity of a product by its name as a Number.
   * Note: Converts the returned BigInt to Number - only safe for reasonable sizes.
   * @param store - Contract instance of the Store
   * @param productName - Name of the product
   * @returns quantity as number
   */
  async getQuantity(store: any, productName: string ) {
    const product = await store.getProductByName(productName);
    const quantity = Number(product.quantity);

    return quantity;
  }

  /**
   * Mine `n` blocks on the Hardhat network.
   * Useful to advance block.number for time-window/refund tests.
   * @param n - Number of blocks to mine
   */
  async mineBlocks(n: number) {
    // Mine n blocks for setting a refund window
    for (let i = 0; i < n; i++) {
      await ethers.provider.send("hardhat_mine", ["0x1"]);
    }
  }
}

