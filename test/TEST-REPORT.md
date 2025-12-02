# Report for the Hardhat test suite for the `Store` smart contract

## Structure
```
├── Store/                   # The Store smart contract
├── test/                    # Tests folder
│   └── buyersTests.ts       # Tests with buyers
│   ├── fullWorkflowTest.ts  # Full workflow test - Add, See, Buy, Update quantity, Refund
│   ├── ownerTests.ts        # Tests with owner
│   ├── refundTests.ts       # Tests for product refunds
│   ├── TEST-REPORT.md       # Test report
│   ├── utils.ts             # Helping methods
│ 
├── hardhat.config.ts        # Hardhat configuration. Store/ folder is set as a source there.
```

## Summary

 - The test suite contains 4 files with tests for all methods of the smart contract, testing with the two user roles - owner and buyer.
 - Test scenarios covered - 27.
 - Passing test scenarios - 25.
 - Failing test scenarios - 2. The 2 failing cases are listed in the following "Defects" section.
 - Tests are running on CI in GitHub Actions in a public repository - https://github.com/gpen3v/hardhat-store-tests/actions

## Defects
| Defect ID | Test scenario                                                                  | Description |
|-----------|------------------------------------------------------------------------|---------------------|
| DEF-01    | Store Contract - Full workflow - Add, See, Buy, Update quantity, Refund. | Product quantity is not updated after product refund. |
| DEF-02    | Testing with Buyers - Products Buying - Buyer can Not buy non-existent product: | After attempt to buy non-existent product, transaction is reverted with panic code 0x32, not with reason 'This product does not exist!'. |

### Suggestion
- The "You've already returned your product or didn't even bought it." message to be configured to appear for the cases when a buyer tries to refund a product he already refunded or didn't buy. Now for those cases the message "Sorry, your request for refund has been denied." is configured as a first one, but it is not so descriptive.

## Gas usage report

- addProduct: 43,340 (min) to 148,077 (max) gas, averaging 143,880 gas across 41 calls - Most expensive operation
- buyProduct: 81,245 to 98,357 gas, averaging 94,280 across 18 calls
- refundProduct: Fixed at 28,593 gas across 7 calls
- setRefundPolicyNumber: Fixed at 27,085 gas (1 call) - Cheapest operations
- updateProductQuantity: Fixed at 36,973 gas (2 calls)
####Store Contract Deployment:
- Gas Cost: 2,115,110 gas
- % of limit: 7.1% of the 30M gas block limit
This is the one-time cost to deploy the contract to the blockchain.