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
        require(index < 5, "bad index: it must be less than 5");
        priceMap[index] = price;
    }

    function getPrice(uint256 index) public view returns (uint256) {
        require(index < 5, "bad index: it must be less than 5");
        return priceMap[index];
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(_watchenzToken.ownerOf(tokenId) == msg.sender, "not yours");
        _;
        _watchenzToken.updateTokenMetadata(tokenId);
    }

    /// token Setting
    //price index : 0
    function setTimeZone(
        uint256 tokenId,
        uint24 timeZone
    ) public payable onlyTokenOwner(tokenId) {
        require(priceMap[0] <= msg.value, "bad price0");
        require(timeZone <= 86400, "day is 86400 sec");
        TokenSettings[tokenId].timeZone = timeZone;
    }

    //price index : 1
    function setHtmlWrapper(
        uint256 tokenId,
        bool _hmlWrapper
    ) public payable onlyTokenOwner(tokenId) {
        require(priceMap[1] <= msg.value, "bad price1");
        TokenSettings[tokenId].htmlWrapper = _hmlWrapper;
    }

    //price index : 2
    function setDynamicBackground(
        uint256 tokenId,
        string memory url
    ) public payable onlyTokenOwner(tokenId) {
        require(priceMap[2] <= msg.value, "bad price2");
        TokenSettings[tokenId].dynamicBackground = url;
    }

    //price index : 3
    function setDynamicDial(
        uint256 tokenId,
        string memory url
    ) public payable onlyTokenOwner(tokenId) {
        require(priceMap[3] <= msg.value, "bad price3");
        TokenSettings[tokenId].dynamicBackground = url;
    }

    //price index : 4
    function setLocation(
        uint256 tokenId,
        string memory location
    ) public payable onlyTokenOwner(tokenId) {
        require(priceMap[4] <= msg.value, "bad price4");
        TokenSettings[tokenId].locationParameter = location;
    }

    function setSetting(
        uint256 tokenId,
        uint24 timeZone,
        bool htmlWrapper,
        string memory dynamicBackground,
        string memory dynamicDial,
        string memory location
    ) public payable onlyTokenOwner(tokenId) {
        require(timeZone <= 86400, "days is 86400 sec");
        uint256 _price;
        for (uint256 i = 0; i < 5; i++) {
            _price += priceMap[i];
        }
        require(_price <= msg.value, "bad price 5");
        TokenSettings[tokenId] = TokenSetting(
            timeZone,
            htmlWrapper,
            dynamicBackground,
            dynamicDial,
            location
        );
    }

    function setSetting0(
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
        if (tokenSettingFlag.htmlWrapperFlag == true) {
            _val += priceMap[1];
            _nextSetting.htmlWrapper = tokenSetting.htmlWrapper;
        }
        if (tokenSettingFlag.dynamicBackgroundFlag == true) {
            _val += priceMap[2];
            _nextSetting.dynamicBackground = tokenSetting.dynamicBackground;
        }
        if (tokenSettingFlag.dynamicDialFlag == true) {
            _val += priceMap[3];
            _nextSetting.dynamicDial = tokenSetting.dynamicDial;
        }
        if (tokenSettingFlag.locationParameterFlag == true) {
            _val += priceMap[4];
            _nextSetting.locationParameter = tokenSetting.locationParameter;
        }
        require(_val <= msg.value, "bad price 5");

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
}
