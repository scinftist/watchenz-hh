// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ITokenSetting.sol";

interface IWatchenzDB is ITokenSetting {
    event tokenContractSet(address);
    event channelContract(address);

    function getSetting(
        uint256 tokenId
    ) external view returns (TokenSetting memory);

    function setTimeZone(uint256 tokenId, uint24 timeZone) external payable;

    function setHtmlWrapper(
        uint256 tokenId,
        bool _htmlWrapper
    ) external payable;

    function setDynamicBackground(
        uint256 tokenId,
        string memory _dynamicBackground
    ) external payable;

    function setDynamicDial(
        uint256 tokenId,
        string memory _dynamicDial
    ) external payable;

    function setLocation(
        uint256 tokenId,
        string memory location
    ) external payable;

    function setSetting(
        uint256 tokenId,
        uint24 timeZone,
        bool htmlWrapper,
        string memory dynamicBackground,
        string memory dynamicDial,
        string memory location
    ) external payable;

    function setSetting0(
        uint256 tokenId,
        TokenSetting memory tokenSetting,
        TokenSettingFlags memory tokenSettingFlag
    ) external payable;

    function setTokenContract(address newAddress) external;

    function getTokenContract() external view returns (address);

    function setChannelContract(address newAddress) external;

    function getChannelContract() external view returns (address);
}
