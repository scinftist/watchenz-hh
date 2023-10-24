// SPDX-License-Identifier: MIT
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
    uint256 public _price = 0.0024 ether;
    uint256 public _duration = 30 days;
    uint256 public constant _whitelistPrevilagedTime = 3 days;
    uint256 public _startTime;
    uint256 public maxSupply = 24000;
    uint256 private constant mintPerTransation = 25;
    uint256 private _payabaleMintCounter = 0;

    bool public finalizeMaxSUpply = false;

    // set before deploy
    uint256 public constant numberOfTokenInWhiteList = 1300;

    // start sale function?
    constructor() ERC721A("Watchenz", "WTC") {
        _startTime = block.timestamp;
    }

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

    //implments as onlyOwner
    function setPrice(uint256 newPrice) public onlyOwner {
        _price = newPrice;
    }

    function getPrice() public view returns (uint256) {
        return _price;
    }

    //implments as onlyOwner
    function setMaxSupply(uint256 newMaxSupply) public onlyOwner {
        require(!finalizeMaxSUpply, "maxSupply has been finalized");
        require(newMaxSupply <= 24000, "hard limit of 24k");
        maxSupply = newMaxSupply;
    }

    function freeze() public onlyOwner {
        finalizeMaxSUpply = true;
    }

    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    //implments as onlyOwner
    function setStartTime(uint256 newStartTime) public onlyOwner {
        _startTime = newStartTime;
    }

    function getExpirationTime() public view returns (uint256) {
        return _startTime + _duration;
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
    ) public view override(ERC721A, IERC721A) returns (string memory) {
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
        require(
            amountRemaining != 0,
            "you are not whitelisted or you have claimed your tokens"
        );
        setWhiteListToZero(msg.sender);
        while (amountRemaining > mintPerTransation) {
            amountRemaining -= mintPerTransation;
            _safeMint(msg.sender, mintPerTransation);
        }
        if (amountRemaining != 0) {
            _safeMint(msg.sender, amountRemaining);
        }
    }

    function mintWatchenz(uint256 quantity) public payable {
        if (
            _payabaleMintCounter + quantity >
            maxSupply - numberOfTokenInWhiteList
        ) {
            require(
                _startTime + _whitelistPrevilagedTime < block.timestamp,
                "wait for next Phase"
            );
        }
        require(totalSupply() + quantity < maxSupply, "it's finishesd");

        require(_startTime < block.timestamp, "it's not the time");
        require(
            block.timestamp < _startTime + _duration,
            "mint duration has finished"
        );
        require(msg.value == _price * quantity, "wrong value of ETH send");
        _payabaleMintCounter += quantity;
        while (quantity > mintPerTransation) {
            quantity -= mintPerTransation;
            _safeMint(msg.sender, mintPerTransation);
        }
        if (quantity != 0) {
            _safeMint(msg.sender, quantity);
        }
        // _safeMint(msg.sender, quantity);
    }

    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable virtual {}
}
