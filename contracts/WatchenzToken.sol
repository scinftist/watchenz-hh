pragma solidity ^0.8.17;

import "./Interfaces/IWatchenzToken.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/Whitelist.sol";
import "./Interfaces/IERC4906.sol";

contract WatchenzToekn is
    IWatchenzToken,
    Ownable,
    ERC721A,
    Whitelist,
    IERC4906
{
    address private _metadataRenderer;
    address private _WatchenzDB;

    //
    uint256 public constant _price = 0.001 ether;
    uint256 public constant _duration = 14 days;
    uint256 public _startTime;
    uint256 public constant _maxSupply = 20000;

    constructor() ERC721A("Watchenz", "WTC") {}

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(IERC721A, ERC721A) returns (bool) {
        return
            interfaceId == bytes4(0x49064906) ||
            super.supportsInterface(interfaceId);
    }

    function setMetadateRenderer(address newAddress) public onlyOwner {
        _metadataRenderer = newAddress;
        emit MetadataRendereChanged(newAddress);
    }

    function getMetadataRenderer() public view returns (address) {
        return _metadataRenderer;
    }

    function setDB(address newAddress) public onlyOwner {
        _WatchenzDB = newAddress;
        emit DBChanged(newAddress);
    }

    function getDB() public view returns (address) {
        return _WatchenzDB;
    }

    function updateTokenMetadata(uint256 tokenId) external {
        require(msg.sender == getDB(), "callable by watchenzDB");
        emit MetadataUpdate(tokenId);
    }

    function updateAllMetadata() public onlyOwner {
        require(_nextTokenId() > 0, "no token to update"); // prevents underflow;
        emit BatchMetadataUpdate(_startTokenId(), _nextTokenId() - 1);
    }
}
