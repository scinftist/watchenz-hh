// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWatchenzDB {
    event tokenContractSet(address);

    function getSetting(
        uint256 tokenId
    )
        external
        view
        returns (uint256 timeZone, string memory url, string memory location);

    function setTimeZone(uint256 tokenId, uint256 timeZone) external;

    function seturl(uint256 tokenId, string memory url) external;

    function setLocation(uint256 tokenId, string memory location) external;

    function setSetting(
        uint256 tokenId,
        uint256 timeZone,
        string memory url,
        string memory location
    ) external;

    function setTokenContract(address newAddress) external;

    function getTokenContract() external view returns (address);
}
