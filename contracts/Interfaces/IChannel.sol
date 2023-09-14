pragma solidity ^0.8.0;

interface IChannel {
    function getChannel(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory dynamicBackground,
            string memory dynamicDial,
            string memory locationParameter
        );
}
