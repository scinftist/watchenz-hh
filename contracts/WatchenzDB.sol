// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interfaces/IWToken.sol";
import "./Interfaces/IWatchenzDB.sol";
import "./Interfaces/IChannel.sol";

contract WatchenzDB is IWatchenzDB, Ownable {
    IWToken private _watchenzToken;
    IChannel private _channel;

    //
    mapping(uint256 => uint256) private priceMap;

    mapping(uint256 => TokenSetting) private TokenSettings;

    function setTokenContract(address tokenContractAddress) public onlyOwner {
        _watchenzToken = IWToken(tokenContractAddress);
        emit tokenContractSet(tokenContractAddress);
    }

    function getTokenContract() public view returns (address) {
        return address(_watchenzToken);
    }

    function setChannelContract(
        address _channelContractAddress
    ) public onlyOwner {
        _channel = IChannel(_channelContractAddress);
        emit channelContract(_channelContractAddress);
    }

    function getChannelContract() public view returns (address) {
        return address(_channel);
    }

    function setPrice(uint256 index, uint256 price) public onlyOwner {
        require(index < 4, "bad index: it must be less than 5");
        priceMap[index] = price;
    }

    function getPrice(uint256 index) public view returns (uint256) {
        require(index < 4, "bad index: it must be less than 5");
        return priceMap[index];
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(_watchenzToken.ownerOf(tokenId) == msg.sender, "not yours");
        _;
        _watchenzToken.updateTokenMetadata(tokenId);
    }

    function setSetting(
        uint256 tokenId,
        TokenSetting memory tokenSetting,
        TokenSettingFlags memory tokenSettingFlag
    ) external payable onlyTokenOwner(tokenId) {
        TokenSetting memory _nextSetting = TokenSettings[tokenId];
        uint256 _val = 0;
        require(tokenSetting.timeZone <= 86400, "days is 86400 sec");
        if (tokenSettingFlag.timeZoneFlag == true) {
            _val += priceMap[0];
            _nextSetting.timeZone = tokenSetting.timeZone;
        }

        if (tokenSettingFlag.dynamicBackgroundFlag == true) {
            _val += priceMap[1];
            _nextSetting.dynamicBackground = tokenSetting.dynamicBackground;
        }
        if (tokenSettingFlag.dynamicDialFlag == true) {
            _val += priceMap[2];
            _nextSetting.dynamicDial = tokenSetting.dynamicDial;
        }
        if (tokenSettingFlag.locationParameterFlag == true) {
            _val += priceMap[3];
            _nextSetting.locationParameter = tokenSetting.locationParameter;
        }
        require(_val <= msg.value, "wrong value of ETH");

        TokenSettings[tokenId] = _nextSetting;
    }

    function retriveChannel(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory dynamicBackground,
            string memory dynamicDial,
            string memory locationParameter
        )
    {
        return _channel.getChannel(tokenId);
    }

    function getSetting(
        uint256 tokenId
    ) public view returns (TokenSetting memory) {
        // if empty return defualt
        TokenSetting memory _returnSetting = TokenSettings[tokenId];
        string memory _defualtBackground;
        string memory _defualtDial;
        string memory _defualtLocation;
        (_defualtBackground, _defualtDial, _defualtLocation) = _channel
            .getChannel(tokenId);
        if (bytes(_returnSetting.dynamicBackground).length == 0) {
            _returnSetting.dynamicBackground = _defualtBackground;
        }
        if (bytes(_returnSetting.dynamicDial).length == 0) {
            _returnSetting.dynamicDial = _defualtDial;
        }
        if (bytes(_returnSetting.locationParameter).length == 0) {
            _returnSetting.locationParameter = _defualtLocation;
        }
        return _returnSetting;
    }

    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable virtual {}
}
