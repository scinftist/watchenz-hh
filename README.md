# Watchenz on Base

watchenz is a genereative onchain watch NFT collection, that tries to push onchain boundries forward. with user modifiable metadata.

## contracts

you can find the samrt contracts and the interfaces that used in this project, [here in contracts](./contracts)

## deply

you can find the deploying scripts that used for deploying these smart ccontract and initializing the project, [here in deploy](./deploy)

## test

you can find the scripts that is used for testing functionality of the smartcontracts, [here in tests](./test)

## rarity_finalized

collection of jupyter notebooks that used to clean the SVG data for smartcontract and examining the non-fungibility and creating a generative [**genes**](rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json) and [**SVG data strings**](rarity_finalized/RAW_DATA/Unified_json/SVG_DATA.json) and [**Exceptional token numbers**](rarity_finalized/Rarity-check/target_folder/exceptionalTokenNumbers.json) for collection, you can fnd out more [here in rarity_finalized](./rarity_finalized)

# Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
yarn hardhat help
yarn hardhat test
REPORT_GAS=true yarn hardhat test
yarn hardhat node
yarn hardhat run scripts/deploy.js
```
