pragma solidity ^0.8.0;
import "erc721a/contracts/IERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWatchenzToken is IERC721A {
    event MetadataRendereChanged(address indexed newAddress);

    // implement as onlywner
    function setMetadateRenderer(address newAddress) external;

    // implement as onlywner
    function getMetadataRenderer() external view returns (address);
}
