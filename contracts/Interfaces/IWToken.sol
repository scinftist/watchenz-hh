pragma solidity ^0.8.0;

interface IWToken {
    function ownerOf(uint256 tokenId) external view returns (address owner);

    function updateTokenMetadata(uint256 tokenId) external;
}
