import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./Store", // <- point Hardhat to your Store/ folder
    tests: "./test"
  }
};

export default config;
