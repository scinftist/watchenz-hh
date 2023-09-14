pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {
    mapping(address => uint8) private whitelist;

    // uint256 internal _quantityOfWhiteList;

    /**
     * @notice Add to whitelist
     */
    function addToWhitelist(
        address[] calldata toAddAddresses,
        uint8[] calldata quantities
    ) external onlyOwner {
        require(
            toAddAddresses.length == quantities.length,
            "length miss mathc"
        );
        for (uint i = 0; i < toAddAddresses.length; i++) {
            whitelist[toAddAddresses[i]] = quantities[i];
            // _quantityOfWhiteList += quantities[i];
        }
    }

    /**
     * @notice Remove from whitelist
     */
    function removeFromWhitelist(
        address[] calldata toRemoveAddresses
    ) external onlyOwner {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete whitelist[toRemoveAddresses[i]];
        }
    }

    function getWhitelistQuantity(
        address _address
    ) public view returns (uint8) {
        return whitelist[_address];
    }
}
