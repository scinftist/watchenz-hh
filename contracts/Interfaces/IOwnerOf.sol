pragma solidity ^0.8.0;

interface IOwnerOd {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}
