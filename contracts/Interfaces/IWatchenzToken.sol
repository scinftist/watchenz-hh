pragma solidity ^0.8.0;
import "erc721a/contracts/IERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWatchenzToken is IERC721A {
    event MetadataRendereChanged(address indexed newAddress);
    event DBChanged(address indexed newAddress);

    // implement as onlywner
    function setMetadateRenderer(address newAddress) external;

    function getMetadataRenderer() external view returns (address);

    // implement as onlywner
    function setDB(address newAddress) external;

    function getDB() external view returns (address);

    // update the metadata of the token if setting is updated can called by the DB contaract
    function updateTokenMetadata(uint256 tokenId) external;

    // implement as onlywner
    function updateAllMetadata() external;
}
