pragma solidity ^0.8.0;

contract Watchenz {
    bool public svgOpen = true;
    mapping(uint256 => mapping(uint8 => string)) private mode2index2string;
    mapping(uint256 => mapping(uint8 => string)) private mode2index2title;
    mapping(uint256 => uint8) private modeCounter;

    constructor() {}

    // element title?// ownalbe
    function set_svg(
        uint256 _mode,
        string memory _data,
        string memory _title
    ) public {
        require(svgOpen, "svg has been finalized");
        uint8 _c = modeCounter[_mode];
        require(_c < 256, "it's full");
        mode2index2string[_mode][_c] = _data;
        mode2index2title[_mode][_c] = _title;
        modeCounter[_mode] = _c + 1;
    }

    /// fualt tolerence? ownable
    function reset_svg(
        uint256 _mode,
        uint8 _index,
        string memory _data,
        string memory _title
    ) public {
        require(svgOpen, "svg has been finalized");
        uint8 _c = modeCounter[_mode];
        require(_index < _c, "it's full");
        mode2index2string[_mode][_index] = _data;
        mode2index2title[_mode][_index] = _title;
        // modeCounter[_mode] = _c + 1;
    }

    //title?
    function get_svg(
        uint256 _mode,
        uint8 _index
    ) public view returns (string memory) {
        uint8 _c = modeCounter[_mode];
        require(_index < _c, "index out of range");
        return mode2index2string[_mode][_index];
    }

    function get_title(
        uint256 _mode,
        uint8 _index
    ) public view returns (string memory) {
        uint8 _c = modeCounter[_mode];
        require(_index < _c, "index out of range");
        return mode2index2title[_mode][_index];
    }
}
