pragma solidity ^0.8.17;

import "./Interfaces/IWatchenzToken.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/Whitelist.sol";

contract WatchenzToekn is IWatchenzToken, Ownable, ERC721A, Whitelist {
    address private _metadataRenderer;

    constructor() ERC721A("Watchenz", "Wtc") {}

    function setMetadateRenderer(address newAddress) public onlyOwner {
        _metadataRenderer = newAddress;
    }

    function getMetadataRenderer() public view returns (address) {
        return _metadataRenderer;
    }
}
