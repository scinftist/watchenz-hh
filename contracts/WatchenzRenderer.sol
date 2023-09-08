pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/WatchenzDataHandler.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract WatchenzRenderer is WatchenzDataHandler {
    using Strings for uint256;

    //---- non fungibility
    //--- tokenURI
    string private constant svgGC = "</g>";
    string private constant svgPart0 =
        '<svg id="thewatch" width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><defs id="defs">';
    string private constant svgPart1 =
        '</defs><defs><filter id="f1"><feDropShadow dx="-5" dy="-2" stdDeviation="0.5" flood-opacity="0.2"></feDropShadow></filter><filter id="innerShadow" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="-4" dx="-5"></feOffset><feGaussianBlur stdDeviation="2.5"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1.5" k3="1.5"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect_innerShadow"></feBlend></filter><filter id="blur" height="300%" width="300%" x="-75%" y="-75%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="#000" result="glowColor" flood-opacity="0.9"></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored"></feComposite><feMerge><feMergeNode in="softGlow_colored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path id="datePath" d="M159.568 98.1748C172.334 92.523 186.143 89.6104 200.105 89.6251C214.066 89.6397 227.869 92.5811 240.623 98.2596" stroke="black"></path></defs><rect x="0" y="0" width="400" height="400" fill="white" fill-opacity="0.1"></rect>';
    string private constant svgPart2 = "";

    function generateSVG(uint256 tokenId) public view returns (string memory) {}
    //def color a b c d
    //def
    //crown
    //crown gaurd
    //strap 1
    //day date
    //dial/body 2
    //TV
    //dial/indiactor / mciro indicator 2 3
    //widget
    //hands 4
    //bezel
    //bezel indicator 5
    //lens
    //script
    //setting
}
