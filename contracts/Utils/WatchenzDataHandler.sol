pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract WatchenzDataHandler is Ownable {
    bool public svgOpen = true;
    // data of the svg string
    mapping(uint8 => mapping(uint8 => string)) private mode2index2string;
    //title of the svg
    mapping(uint8 => mapping(uint8 => string)) private mode2index2title;

    //gene for ech part
    mapping(uint8 => bytes) private mode2gene;
    //---- non fungibility
    mapping(uint256 => uint256) private ExceptionTokens;

    // mapping(uint8 => uint8) private modeCounter;
    event svgSet(uint8 indexed mode, uint8 indexed index);

    event geneSet(uint8 indexed mode);

    struct Genome {
        uint8 color_a; //0
        uint8 color_b; //1
        uint8 color_c; //2
        uint8 strap; //3
        uint8 hour_marker; //4
        uint8 minute_marker; //5
        uint8 hands; //6
        uint8 bezel_marker; //7
        uint8 crownGaurd; //8
        uint8 ref; //9
    }

    constructor() {}

    function setExceptionTokens() public onlyOwner {}

    function getSafeId(uint256 tokenId) public view returns (uint256) {
        uint256 Id4Genome = 0;
        uint256 ExceptionId = ExceptionTokens[tokenId];
        if (ExceptionId == 0) {
            Id4Genome = tokenId;
        } else {
            Id4Genome = ExceptionId;
        }
        return Id4Genome;
    }

    // element title?// ownalbe
    function set_svg(
        uint8 _mode,
        uint8 _index,
        string memory _data,
        string memory _title
    ) public onlyOwner returns (bool) {
        require(svgOpen, "svg has been finalized");

        mode2index2string[_mode][_index] = _data;
        mode2index2title[_mode][_index] = _title;
        emit svgSet(_mode, _index);
        return true;
    }

    //title?
    function get_svg(
        uint8 _mode,
        uint8 _index
    ) public view returns (string memory) {
        return mode2index2string[_mode][_index];
    }

    function get_title(
        uint8 _mode,
        uint8 _index
    ) public view returns (string memory) {
        return mode2index2title[_mode][_index];
    }

    function finalizeSVG() public onlyOwner {
        require(svgOpen, "svg has been finalized");
        svgOpen = false;
    }

    function setGene(uint8 _mode, bytes memory _gene) public onlyOwner {
        require(svgOpen, "svg has been finalized");

        mode2gene[_mode] = _gene;
        emit geneSet(_mode);
    }

    function getGene(uint8 _mode) public view returns (bytes memory) {
        return mode2gene[_mode];
    }

    // the Id is not neccesarily equal to token Id it might be an exception tokenId to avoid
    // attribute duplication and it make sure that tokens are non-fungible
    function getGenome(uint256 tokenId) public view returns (Genome memory) {
        uint256 Id = getSafeId(tokenId);
        Genome memory _genome;
        bytes memory _tempGene;

        //"color_a", //0
        _tempGene = mode2gene[0];
        _genome.color_a = uint8(_tempGene[Id % _tempGene.length]);
        //"color_b",//1
        _tempGene = mode2gene[1];
        _genome.color_b = uint8(_tempGene[Id % _tempGene.length]);
        // "color_c",//2
        _tempGene = mode2gene[2];
        _genome.color_c = uint8(_tempGene[Id % _tempGene.length]);
        // "strap", //3
        _tempGene = mode2gene[3];
        _genome.strap = uint8(_tempGene[Id % _tempGene.length]);
        //"hour_marker",//4
        _tempGene = mode2gene[4];
        _genome.hour_marker = uint8(_tempGene[Id % _tempGene.length]);
        //"minute_marker",//5
        _tempGene = mode2gene[5];
        _genome.minute_marker = uint8(_tempGene[Id % _tempGene.length]);
        // "hands", //6
        _tempGene = mode2gene[6];
        _genome.hands = uint8(_tempGene[Id % _tempGene.length]);
        // "bezel_marker",//7
        _tempGene = mode2gene[7];
        _genome.bezel_marker = uint8(_tempGene[Id % _tempGene.length]);
        //"crown_gaurd", //8
        _tempGene = mode2gene[8];
        _genome.crownGaurd = uint8(_tempGene[Id % _tempGene.length]);
        //"ref", //9
        _tempGene = mode2gene[9];
        _genome.ref = uint8(_tempGene[Id % _tempGene.length]);
        //return Genome

        return _genome;
    }
}
