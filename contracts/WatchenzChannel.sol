// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interfaces/IChannel.sol";

contract WatchenzChannel is Ownable, IChannel {
    string private _defaultDynamicBackground;

    string private _defaultDynamicDial;

    string private _defaultLocationParameter;

    function getChannel(
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
        return (
            _defaultDynamicBackground,
            _defaultDynamicDial,
            _defaultLocationParameter
        );
    }

    function setDynamicBackGround(
        string memory _dynamicBackground
    ) public onlyOwner {
        _defaultDynamicBackground = _dynamicBackground;
    }

    function setDynamicDial(string memory _dynamicDial) public onlyOwner {
        _defaultDynamicDial = _dynamicDial;
    }

    function setLocationParameter(
        string memory _LocationParameter
    ) public onlyOwner {
        _defaultLocationParameter = _LocationParameter;
    }
}
