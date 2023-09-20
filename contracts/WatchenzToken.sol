pragma solidity ^0.8.17;

import "./Interfaces/IWatchenzToken.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/Whitelist.sol";
import "./Interfaces/IERC4906.sol";
import "./Interfaces/IMetadataRenderer.sol";

contract WatchenzToken is
    IWatchenzToken,
    Ownable,
    ERC721AQueryable,
    Whitelist,
    IERC4906
{
    IMetadataRenderer private _metadataRenderer;
    address private _WatchenzDB;

    //
    uint256 public constant _price = 0.001 ether;
    uint256 public constant _duration = 14 days;
    uint256 public constant _whitelistPrevilagedTime = 1 days;
    uint256 public _startTime;
    uint256 public constant maxSupply = 20000;
    uint256 private constant mintPerTransation = 25;
    uint256 private _payabaleMintCounter = 0;

    // set before deploy
    uint256 private constant _numberOfTokenInWhiteList = 100;

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
    //     mint and stuff
    //---------------------

    function whitelistMint() public {
        // _tokenId = _nextTokenId();
        require(_startTime < block.timestamp, "it's not the time");
        require(totalSupply() < maxSupply, "it's finishesd");
        require(
            block.timestamp < _startTime + _duration,
            "mint duration has finished"
        );
        // mint in batches of 25 or less
        uint256 amountRemaining = getWhitelistQuantity(msg.sender);
        while (amountRemaining < mintPerTransation) {
            amountRemaining -= mintPerTransation;
            _safeMint(msg.sender, mintPerTransation);
        }
        if (amountRemaining != 0) {
            _safeMint(msg.sender, amountRemaining);
        }
    }

    function mintWatchenz(uint256 quantity) public payable {
        if (_payabaleMintCounter > maxSupply - _numberOfTokenInWhiteList) {
            require(
                _startTime < block.timestamp + _whitelistPrevilagedTime,
                "wait for next Phase"
            );
        }
        require(totalSupply() < maxSupply, "it's finishesd");
        require(
            quantity <= mintPerTransation,
            "quantity should be less than 26"
        );
        require(_startTime < block.timestamp, "it's not the time");
        require(
            block.timestamp < _startTime + _duration,
            "mint duration has finished"
        );
        require(msg.value == _price * quantity, "wrong value of ETH send");
        _payabaleMintCounter += quantity;
        _safeMint(msg.sender, quantity);
    }
}
