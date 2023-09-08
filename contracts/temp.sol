// // SPDX-License-Identifier: MIT

// import {Base64} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Base64.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
// // import {Base64} from "OpenZeppelin/openzeppelin-contracts@4.8.0/contracts/utils/Base64.sol";
// // import "OpenZeppelin/openzeppelin-contracts@4.8.0/contracts/access/Ownable.sol";

// pragma solidity ^0.8.0;

// interface IMetadataRenderer {
//     function tokenURI(uint256) external view returns (string memory);

//     function contractURI() external view returns (string memory);

//     function initializeWithData(bytes memory initData) external;
// }

// interface IWatchecksEngine {
//     function getTimeZone(uint256 id) external view returns (uint256);
// }

// contract WatchecksMetadata2 is IMetadataRenderer, Ownable {
//     // address private targetContract = 0xC3120F76424c21A4019A10Fbc90AF0481b267123;
//     string private _contractURI;
//     IWatchecksEngine private IWatchecks;

//     string private svgPart0 =
//         '<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="140" fill="#';
//     string private svgPart1 =
//         '" id="dial"/><circle cx="200" cy="200" r="135" fill="none" stroke="black" stroke-width="4" stroke-dasharray="2 12.1371" stroke-dashoffset="1"/><circle cx="200" cy="200" r="136" fill="none" stroke="black" stroke-width="2" stroke-dasharray=".4 1.9736" stroke-dashoffset="0.2"/><rect width="120" height="25" fill="#fff" fill-opacity="0.5" stroke="#000" stroke-opacity="0.5" stroke-width="2" x="140" y="280"/><text x="200" y="300" fill="#000" font-weight="bold" font-family="Courier New" font-size="24" text-anchor="middle" id="dig"/><g id="houru" transform="rotate(';
//     string private svgPart1b = ',200,200)" fill="#';
//     string private svgPart2 =
//         '"><rect x="196" y="110" width="8" height="120"/></g><g id="minu" transform="rotate(';
//     string private svgPart2b = ',200,200)" fill="#';
//     string svgPart3 =
//         '"><rect x="197" y="90" width="6" height="140"/></g><g id="secondCenter" transform="rotate(';
//     string private svgPart3b = ',200,200)" stroke="#';
//     string private svgPart3c = '" fill="#';
//     string private svgPart4 =
//         '"><rect x="198" y="81" width="4" height="120"/><circle cx="200" cy="200" r="4"/><path d="M200 71C200.4 78 202 81 202 81H198C198 81 199.6 78 200 71Z" fill="none" stroke-width="1.5"/></g><script>var update,apiTime,mainTaskInterval,_offSet= ';
//     string private svgPart5 =
//         ' , timeDelta=0,paused=!1;async function getUTC(){try{await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC",{}).then(e=>e.json()).then(e=>{apiTime=e.unixtime})}catch{apiTime=Math.floor((new Date).getTime()/1e3)}}document.getElementById("dial").addEventListener("click",async e=>{if(paused)return await run(),void(paused=!1);window.clearInterval(mainTaskInterval),paused=!0});const hourHand=document.getElementById("houru"),minHand=document.getElementById("minu"),secHand=document.getElementById("secondCenter"),digits=document.getElementById("dig");function baseDateObj(){timeDelta=Math.floor((new Date).getTime())-1e3*apiTime;var e=new Date(0);return e.setUTCSeconds(apiTime+_offSet),e}function generateCurrentTime(e){return new Date(e.getTime()+6e4*e.getTimezoneOffset()+timeDelta)}function generateCurrentAngles(e){var t=6*e.getSeconds()+6*Math.floor(e.getMilliseconds()/200)*200/1e3,n=6*e.getMinutes()+.1*e.getSeconds(),a=30*e.getHours()+.5*e.getMinutes();minHand.setAttribute("transform",`rotate(${n},200,200)`),hourHand.setAttribute("transform",`rotate(${a},200,200)`),secHand.setAttribute("transform",`rotate(${t},200,200)`),digits.innerHTML=`${e.getHours().toString().padStart(2,"0")}:${e.getMinutes().toString().padStart(2,"0")}:${e.getSeconds().toString().padStart(2,"0")}`}function actual(){generateCurrentAngles(generateCurrentTime(baseDateObj()))}async function run(){await getUTC(),mainTaskInterval=setInterval(update,200)}update=function(){actual()},run();</script></svg>';

//     string[2] private handColor = ["000000", "ffffff"];

//     string[23] private faceColor = [
//         "F39C12",
//         "e5a0c8",
//         "b5252d",
//         "8E44AD",
//         "ea392a",
//         "98d9f0",
//         "f36e6e",
//         "e22e2d",
//         "E74C3C",
//         "FFC300",
//         "3498DB",
//         "aada4a",
//         "e6444c",
//         "2d6485",
//         "9B59B6",
//         "edaa3e",
//         "2b5452",
//         "fad450",
//         "685620",
//         "d0f4e2",
//         "569e32",
//         "5fcd8c",
//         "2C3E50"
//     ];

//     constructor(address IAddress) {
//         IWatchecks = IWatchecksEngine(IAddress);
//     }

//     function setContractURI(string memory _uri) public onlyOwner {
//         _contractURI = _uri;
//     }

//     function getTime(uint256 id) public view returns (uint256) {
//         return IWatchecks.getTimeZone(id);
//     }

//     function renderTokenById(uint256 id) public view returns (string memory) {
//         uint256 _time = getTime(id);
//         if (_time == 0) {
//             _time = 36605;
//         } else {
//             _time = _time - 1;
//         }
//         string memory _svg0 = string(
//             abi.encodePacked(
//                 svgPart0,
//                 faceColor[id % 23],
//                 svgPart1,
//                 _toString((_time % 43200) / 120),
//                 svgPart1b,
//                 handColor[id % 2],
//                 svgPart2,
//                 _toString((_time % 3600) / 10),
//                 svgPart2b
//             )
//         );
//         string memory _svg1 = string(
//             abi.encodePacked(
//                 handColor[id % 2],
//                 svgPart3,
//                 _toString((_time % 60) * 6),
//                 svgPart3b,
//                 handColor[(id + 1) % 2],
//                 svgPart3c,
//                 handColor[(id + 1) % 2]
//             )
//         );
//         string memory _svg2 = string(
//             abi.encodePacked(svgPart4, _toString(_time), svgPart5)
//         );
//         return string(abi.encodePacked(_svg0, _svg1, _svg2));
//     }

//     function previewTokenById(
//         uint256 id,
//         uint256 time
//     ) public view returns (string memory) {
//         require(time > 0, "very bad");
//         require(time < 86401, "bad bad");
//         uint256 _time = time - 1;
//         string memory _svg0 = string(
//             abi.encodePacked(
//                 svgPart0,
//                 faceColor[id % 23],
//                 svgPart1,
//                 _toString((_time % 43200) / 120),
//                 svgPart1b,
//                 handColor[id % 2],
//                 svgPart2,
//                 _toString((_time % 3600) / 10),
//                 svgPart2b
//             )
//         );
//         string memory _svg1 = string(
//             abi.encodePacked(
//                 handColor[id % 2],
//                 svgPart3,
//                 _toString((_time % 60) * 6),
//                 svgPart3b,
//                 handColor[(id + 1) % 2],
//                 svgPart3c,
//                 handColor[(id + 1) % 2]
//             )
//         );
//         string memory _svg2 = string(
//             abi.encodePacked(svgPart4, _toString(_time), svgPart5)
//         );
//         return string(abi.encodePacked(_svg0, _svg1, _svg2));
//     }

//     function constructTokenURI(
//         uint256 id
//     ) internal view returns (string memory) {
//         uint256 _time = getTime(id);
//         string memory _cond;
//         if (_time == 0) {
//             _cond = "Unworn";
//         } else {
//             _cond = "Worn";
//         }
//         string memory _imageData = Base64.encode(bytes(renderTokenById(id)));
//         string memory _header = '{"name": "Watchecks ';
//         string memory _mid = '","description": "This Clockwork is Adjustable",';
//         string memory _attr = string(
//             abi.encodePacked(
//                 '"attributes": [{"trait_type": "Reference","value": "Ref#',
//                 _toString(id % 46),
//                 '"},{"display_type": "number","trait_type": "Number","value": ',
//                 _toString(id),
//                 '},{"trait_type": "Condition","value": "',
//                 _cond,
//                 '"}]}'
//             )
//         );
//         return
//             string(
//                 abi.encodePacked(
//                     "data:application/json;base64,",
//                     Base64.encode(
//                         bytes(
//                             abi.encodePacked(
//                                 _header,
//                                 _toString(id),
//                                 _mid,
//                                 '"image": "data:image/svg+xml;base64,',
//                                 _imageData,
//                                 '", "animation_url": "data:image/svg+xml;base64,',
//                                 _imageData,
//                                 '",',
//                                 _attr
//                             )
//                         )
//                     )
//                 )
//             );
//     }

//     function tokenURI(uint256 tokenId) public view returns (string memory) {
//         //zora proxy check the token existence
//         return constructTokenURI(tokenId);
//     }

//     function contractURI() public view returns (string memory) {
//         return _contractURI;
//     }

//     /**
//      * @dev Converts a uint256 to its ASCII string decimal representation.
//      */
//     function _toString(
//         uint256 value
//     ) internal pure virtual returns (string memory str) {
//         assembly {
//             // The maximum value of a uint256 contains 78 digits (1 byte per digit), but
//             // we allocate 0xa0 bytes to keep the free memory pointer 32-byte word aligned.
//             // We will need 1 word for the trailing zeros padding, 1 word for the length,
//             // and 3 words for a maximum of 78 digits. Total: 5 * 0x20 = 0xa0.
//             let m := add(mload(0x40), 0xa0)
//             // Update the free memory pointer to allocate.
//             mstore(0x40, m)
//             // Assign the `str` to the end.
//             str := sub(m, 0x20)
//             // Zeroize the slot after the string.
//             mstore(str, 0)

//             // Cache the end of the memory to calculate the length later.
//             let end := str

//             // We write the string from rightmost digit to leftmost digit.
//             // The following is essentially a do-while loop that also handles the zero case.
//             // prettier-ignore
//             for { let temp := value } 1 {} {
//                 str := sub(str, 1)
//                 // Write the character to the pointer.
//                 // The ASCII index of the '0' character is 48.
//                 mstore8(str, add(48, mod(temp, 10)))
//                 // Keep dividing `temp` until zero.
//                 temp := div(temp, 10)
//                 // prettier-ignore
//                 if iszero(temp) { break }
//             }

//             let length := sub(end, str)
//             // Move the pointer 32 bytes leftwards to make room for the length.
//             str := sub(str, 0x20)
//             // Store the length.
//             mstore(str, length)
//         }
//     }

//     function initializeWithData(bytes memory initData) external {
//         //pass
//     }
// }
