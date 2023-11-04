# Deploying contracts to live network

the `deploy_and_bind.js` scripts found in this folder is the first step to deploy all 4 smart contracts and in the project and connect their interfaces. all of the addresses that are deployed are stored in [./DEPLOYED_ADDRESS](./DEPLOYED_ADDRESS) for other scripts.

```shell
yarn hardhat run deploy/deploy_and_bind.js --network MyBase
```

after the deployment of the contracts the other steps have no order in excecution and you can run them as you want.

- note that this script is uses [hardhat.config.js](../hardhat.config.js) to conncet to base blockchain stored as `MyBase`, if you want to change the network add networks in [hardhat.config.js](../hardhat.config.js).

---

- `set_genes.js` scripts connects to metadarenderer `WatchenzRenderer.sol` to store a gene pool for token attributes. for more indepth understanding take a look at `{setGene}` and `{getGene}` and `{getGenome}` in [WatchenzDataHandler.sol](contracts/Utils/WatchenzDataHandler.sol), also you can find the data in [GENE_SOURCE.json](../rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json)

```shell
yarn hardhat run deploy/set_genes.js --network MyBase
```

- `set_parts.js` scripts connects to metadarenderer `WatchenzRenderer.sol` to store the svg parts that are common among all toknes. for more indepth understanding take a look at `{setSVGParts}` and `{getSVGParts}` in [WatchenzDataHandler.sol](contracts/Utils/WatchenzDataHandler.sol) also you can find the data in [SVG_PARTS.json](../AuxData/SVG_PARTS.json)

```shell
yarn hardhat run deploy/set_parts.js --network MyBase
```

- `set_svg.js` scripts connects to metadarenderer `WatchenzRenderer.sol` to store the svg parts that are corresponding to a specific attribute. for more indepth understanding take a look at `{set_svg}` and `{get_svg}` in [WatchenzDataHandler.sol](contracts/Utils/WatchenzDataHandler.sol) also you can find the data in [SVG_DATA.json](../rarity_finalized/RAW_DATA/Unified_json/SVG_DATA.json)

```shell
yarn hardhat run deploy/set_svg.js --network MyBase
```

- `set_safeIds.js` scripts connects to metadarenderer `WatchenzRenderer.sol` to store the some tokenIds that are not non-fungible in the {getGenome} function and will be cast to a new tokenId that are non-fungible. for more indepth understanding take a look at `{setExceptionTokens}` and `{getSafeId}` in [WatchenzDataHandler.sol](contracts/Utils/WatchenzDataHandler.sol) also you can find the data in [exceptional_out.csv](../rarity_finalized/Rarity-check/target_folder/exceptional_out.csv)

```shell
yarn hardhat run deploy/set_safeIds.js --network MyBase
```

- `set_whitelist.js` scripts connects to token contract `WatchenzToken.sol` to store the list of address that had whitelisted form [Watchecks collection](https://opensea.io/collection/watchecks) for more indepth understanding take a look at `{addToWhitelist}` in[Whitelist.sol](../contracts/Utils/Whitelist.sol) also you can find the data in [WhiteListSnapShot.csv](../AuxData/WhiteListSnapShot.csv)

```shell
yarn hardhat run deploy/set_whitelist.js --network MyBase
```
