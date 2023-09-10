pragma solidity ^0.8.17;

import "./Interfaces/IWatchenzToken.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/Whitelist.sol";
import "./Interfaces/IERC4906.sol";
import "./Interfaces/IMetadataRenderer.sol";

contract WatchenzToken is
    IWatchenzToken,
    Ownable,
    ERC721A,
    Whitelist,
    IERC4906
{
    IMetadataRenderer private _metadataRenderer;
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
        _metadataRenderer = IMetadataRenderer(newAddress);
        emit MetadataRendereChanged(newAddress);
    }

    function getMetadataRenderer() public view returns (address) {
        return address(_metadataRenderer);
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

    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721A, IERC721A) returns (string memory) {
        require(_exists(tokenId), "token does not exist");

        return _metadataRenderer.tokenURI(tokenId);
    }

    //----------------------
    //     mint and stuf
    //---------------------

    function mintWatch() public returns (uint256 _tokenId) {
        _tokenId = _nextTokenId();
        _safeMint(msg.sender, 1);
    }

    function mintWatchenz(uint256 quantity) public payable {
        require(_startTime < block.timestamp, "it's not the time");
        require(block.timestamp < _startTime + _duration);
        require(msg.value == _price * quantity);
        _safeMint(msg.sender, quantity);
    }
}
