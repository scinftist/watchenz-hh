pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract WatchenzDataHandler is Ownable {
    bool public svgOpen = true;
    mapping(uint8 => mapping(uint8 => string)) private mode2index2string;
    mapping(uint8 => mapping(uint8 => string)) private mode2index2title;

    // mapping(uint8 => uint8) private modeCounter;
    event svgSet(uint8 indexed mode, uint8 indexed index);

    // event svgReset(uint8 indexed mode, uint8 indexed index);

    constructor() {}

    // element title?// ownalbe
    function set_svg(
        uint8 _mode,
        uint8 _index,
        string memory _data,
        string memory _title
    ) public returns (bool) {
        require(svgOpen, "svg has been finalized");
        // uint8 _c = modeCounter[_mode];
        // require(_c < 256, "it's full");
        mode2index2string[_mode][_index] = _data;
        mode2index2title[_mode][_index] = _title;
        emit svgSet(_mode, _index);
        return true;
        // modeCounter[_mode] = _c + 1;
    }

    //title?
    function get_svg(
        uint8 _mode,
        uint8 _index
    ) public view returns (string memory) {
        // uint8 _c = modeCounter[_mode];
        // require(_index < _c, "index out of range");
        return mode2index2string[_mode][_index];
    }

    function get_title(
        uint8 _mode,
        uint8 _index
    ) public view returns (string memory) {
        // uint8 _c = modeCounter[_mode];
        // require(_index < _c, "index out of range");
        return mode2index2title[_mode][_index];
    }

    function finalizeSVG() public onlyOwner {
        require(svgOpen, "svg has been finalized");
        svgOpen = false;
    }
}
