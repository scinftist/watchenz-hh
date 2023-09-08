pragma solidity ^0.8.0;

interface IMetadataRender {
    function tokenURI(uint256 tokenId) external view returns (string memory);

    function previewTokenURI(
        uint256 tokenId,
        uint256 timeZone,
        string memory url,
        string memory location
    ) external view returns (string memory);

    function getSetting(
        uint256 tokenId
    )
        external
        view
        returns (uint256 timezone, string memory url, string memory location);

    function getWatchenzDB() external view returns (address);
}
