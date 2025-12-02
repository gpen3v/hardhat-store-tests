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

## Defects
| Defect ID | Test scenario                                                                  | Description |
|-----------|------------------------------------------------------------------------|---------------------|
| DEF-01    | Store Contract - Full workflow - Add, See, Buy, Update quantity, Refund. | Product quantity is not updated after product refund. |
| DEF-02    | Testing with Buyers - Products Buying - Buyer can Not buy non-existent product: | After attempt to buy non-existent product, transaction is reverted with panic code 0x32, not with reason 'This product does not exist!'. |

### Suggestion
- The "You've already returned your product or didn't even bought it." message to be configured to appear for the cases when a buyer tries to refund a product he already refunded or didn't buy. Now for those cases the message "Sorry, your request for refund has been denied." is configured as a first one, but it is not so descriptive.

## Gas usage report

···················································································································
|  Solidity and Network Configuration                                                                             │
······························|·················|···············|·················|································
|  Solidity: 0.8.28           ·  Optim: false   ·  Runs: 200    ·  viaIR: false   ·     Block: 30,000,000 gas     │
······························|·················|···············|·················|································
|  Methods                                                                                                        │
······························|·················|···············|·················|················|···············
|  Contracts / Methods        ·  Min            ·  Max          ·  Avg            ·  # calls       ·  usd (avg)   │
······························|·················|···············|·················|················|···············
|  Store                      ·                                                                                   │
······························|·················|···············|·················|················|···············
|      addProduct             ·         43,340  ·      148,077  ·        143,880  ·            41  ·           -  │
······························|·················|···············|·················|················|···············
|      buyProduct             ·         81,245  ·       98,357  ·         94,280  ·            18  ·           -  │
······························|·················|···············|·················|················|···············
|      refundProduct          ·              -  ·            -  ·         28,593  ·             7  ·           -  │
······························|·················|···············|·················|················|···············
|      setRefundPolicyNumber  ·              -  ·            -  ·         27,085  ·             1  ·           -  │
······························|·················|···············|·················|················|···············
|      updateProductQuantity  ·              -  ·            -  ·         36,973  ·             2  ·           -  │
······························|·················|···············|·················|················|···············
|  Deployments                                  ·                                 ·  % of limit    ·              │
······························|·················|···············|·················|················|···············
|  Store                      ·              -  ·            -  ·      2,115,110  ·         7.1 %  ·           -  │
······························|·················|···············|·················|················|···············
|  Key                                                                                                            │
···················································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                       │
···················································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)                    │
···················································································································
|  Toolchain:  hardhat                                                                                            │
···················································································································

- Most expensive operation: addProduct (avg 143,880 gas)
- Cheapest operations: Administrative functions like setRefundPolicyNumber (27,085 gas)