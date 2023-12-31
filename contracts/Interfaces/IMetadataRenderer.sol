// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ITokenSetting.sol";

interface IMetadataRenderer is ITokenSetting {
    function tokenURI(uint256 tokenId) external view returns (string memory);

    function previewTokenURI(
        uint256 tokenId,
        TokenSetting memory _tokenSetting,
        TokenSettingFlags memory _tokenSettingFlag
    ) external view returns (string memory);

    function setWatchenzDB(address _watchenzDB) external;

    function getWatchenzDB() external view returns (address);

    function setTimeAPI(string memory _timeAPI) external;

    function getTimeAPI() external view returns (string memory);

    function setWeatherAPI(string memory _timeAPI) external;

    function getWeatherAPI() external view returns (string memory);
}
