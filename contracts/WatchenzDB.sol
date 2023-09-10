pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interfaces/IWToken.sol";
import "./Interfaces/IWatchenzDB.sol";

contract WatchenzDB is IWatchenzDB, Ownable {
    IWToken private _watchenzToken;

    mapping(uint256 => uint256) private timeZones;
    mapping(uint256 => string) private urls;
    mapping(uint256 => string) private locations;

    function setTokenContract(address tokenContractAddress) public onlyOwner {
        _watchenzToken = IWToken(tokenContractAddress);
        emit tokenContractSet(tokenContractAddress);
    }

    function getTokenContract() public view returns (address) {
        return address(_watchenzToken);
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(_watchenzToken.ownerOf(tokenId) == msg.sender, "not yours");
        _;
        _watchenzToken.updateTokenMetadata(tokenId);
    }

    function setTimeZone(
        uint256 tokenId,
        uint256 timeZone
    ) public onlyTokenOwner(tokenId) {
        // require(IWToken.ownerOf(tokenId)==msg.sender,"not yours")
        timeZones[tokenId] = timeZone;
    }

    function seturl(
        uint256 tokenId,
        string memory url
    ) public onlyTokenOwner(tokenId) {
        urls[tokenId] = url;
    }

    function setLocation(
        uint256 tokenId,
        string memory location
    ) public onlyTokenOwner(tokenId) {
        locations[tokenId] = location;
    }

    function setSetting(
        uint256 tokenId,
        uint256 timeZone,
        string memory url,
        string memory location
    ) public onlyTokenOwner(tokenId) {
        timeZones[tokenId] = timeZone;
        urls[tokenId] = url;
        locations[tokenId] = location;
    }

    function getSetting(
        uint256 tokenId
    )
        public
        view
        returns (uint256 timeZone, string memory url, string memory location)
    {
        return (timeZones[tokenId], urls[tokenId], locations[tokenId]);
    }
    // function _ownerOF
}
