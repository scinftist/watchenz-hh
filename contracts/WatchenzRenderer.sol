// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/WatchenzDataHandler.sol";
import "./Interfaces/IMetadataRenderer.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

import "./Interfaces/IWatchenzDB.sol";

// import

contract WatchenzRenderer is WatchenzDataHandler, IMetadataRenderer {
    using Strings for uint256;

    IWatchenzDB private iwatchenzDB;

    //---- non fungibility
    //APIS
    string private _timeAPI = "https://worldtimeapi.org/api/timezone/Etc/UTC";
    string private _weatherAPI =
        "https://watchenz.xyz/api/currentweather?city=";
    // day
    string private constant _day =
        '<g id="day"><path d="M199.35 79.375L196.752 74.875C196.464 74.375 196.825 73.75 197.402 73.75H202.598C203.175 73.75 203.536 74.375 203.248 74.875L200.65 79.375C200.361 79.875 199.639 79.875 199.35 79.375Z" fill="url(#a)" stroke="url(#c)" stroke-width="1"></path><path d="M247.792 92.1584C232.787 85.4778 216.548 82.0173 200.123 82.0001C183.698 81.9829 167.452 85.4094 152.433 92.0586L159.568 108.175C172.334 102.523 186.143 99.6104 200.105 99.6251C214.066 99.6397 227.869 102.581 240.623 108.26L247.792 92.1584Z" fill="white" stroke-width="1" stroke="#1c1c1c" filter="url(#innerShadow)"></path><text textLength="81" lengthAdjust="spacing"><textPath id="dayu" textLength="81" lengthAdjust="spacing" href="#datePath" font-family="Arial" font-size="10" font-weight="bold" dominant-baseline="central" text-anchor="start" fill="black">MONDAY</textPath></text></g>';
    string private constant _date =
        '<g id="date"><rect x="269" y="190" width="28" height="20" fill="white" stroke-width="1" stroke="#1c1c1c" filter="url(#innerShadow)"></rect><text x="283" y="200" id="dateu" textLength="14" lengthAdjust="spacing" font-family="Arial" font-size="12" font-weight="bold" dominant-baseline="central" text-anchor="middle" fill="black">11</text></g>';
    //
    string private constant crownGaurdSVG =
        '<path d="M381 232.671V220.934C381 218.209 378.862 216 376.224 216H361.694C359.624 216 357.789 217.377 357.148 219.411L349.247 244.52C347.892 248.822 352.384 252.583 356.176 250.321L378.608 236.949C380.088 236.067 381 234.436 381 232.671Z" fill="url(#a)"></path><path d="M381 166.8L380.998 178.202C380.998 180.849 378.859 182.996 376.221 182.997L361.69 183C359.619 183.001 357.785 181.662 357.144 179.686L349.246 155.296C347.893 151.117 352.385 147.463 356.178 149.659L378.609 162.644C380.089 163.501 381 165.085 381 166.8Z" fill="url(#a)"></path>';
    string private constant _hourMask = 'mask="url(#hourMarkerMask)"';
    //--- tokenURI U+00b0 \u00b0
    string private constant svgEnd = "</svg>";
    string private constant svgHead =
        '<svg id="thewatch" width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">';

    string private constant _newHtmlSVGHead =
        '<svg id="thewatch" width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">';

    //
    string private constant svgScript0 = "<script> var apiTime,_offSet=";
    string private constant svgScript1 = ',_location="';
    string private constant svgScript2 =
        '",userOffset=0,crownOut=!1;const weekdays=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];async function getUTC(){await fetch("';
    // timeAPI
    string private constant svgScript3 =
        '").then((response=>response.json())).then((data=>{apiTime=data.unixtime}))}const hourHand=document.getElementById("houru"),minHand=document.getElementById("minu"),secHand=document.getElementById("secondu"),dayText=document.getElementById("dayu"),dateText=document.getElementById("dateu"),weatherIcon=document.getElementById("w-icon"),weatherCity=document.getElementById("w-city"),weatherTemp=document.getElementById("w-temp");async function getWeather(){fetch("';
    // weatherAPI \u00b0 + space?
    string private constant svgScript4 =
        '"+_location).then((resp=>resp.json())).then((w=>{w.ok?(weatherIcon.setAttribute("href","https:"+w.data.current.condition.icon),weatherCity.innerHTML=w.data.location.name,weatherTemp.innerHTML=w.data.current.temp_c+"\\u00b0C/"+w.data.current.temp_f+"\\u00b0F"):console.log(w.msg)})).catch(console.error)}const crown=document.getElementById("crown");function actual(){if(crownOut)return;const d=function(dt){return new Date(dt.getTime()+6e4*dt.getTimezoneOffset()+userOffset)}(function(){var userNow=new Date;userOffset=Math.floor(userNow.getTime())-1e3*apiTime;var dt=new Date(0);return dt.setUTCSeconds(apiTime+_offSet),dt}());!function(d){var angleSecond=6*d.getSeconds()+6*d.getMilliseconds()/1e3,angleMin=6*d.getMinutes()+.1*d.getSeconds(),angleHour=30*d.getHours()+.5*d.getMinutes();minHand.setAttribute("transform",`rotate(${angleMin},200,200)`),hourHand.setAttribute("transform",`rotate(${angleHour},200,200)`),secHand.setAttribute("transform",`rotate(${angleSecond},200,200)`)}(d);if(document.getElementById("day")){dayText.innerHTML=weekdays[d.getDay()]}if(document.getElementById("date")){dateText.innerHTML=d.getDate()}}crown.addEventListener("click",(async()=>{if(crownOut=!crownOut,!crownOut)return await getUTC(),void crown.setAttribute("transform","translate(0 0)");crown.setAttribute("transform","translate(10 0)")})),async function(){getUTC().catch(console.error),getWeather().catch(console.error),setInterval(actual,200),setInterval(getWeather,15e3)}();</script>';

    // centigerad ? api adjustable okayed by farzadex // # \\u00b0C/

    function renderTokenById(
        uint256 tokenId
    ) public view returns (string memory) {
        TokenSetting memory _tokenSetting = iwatchenzDB.getSetting(tokenId);
        return _renderToken(tokenId, _tokenSetting);
    }

    function renderTokenByIdWithNoHref(
        uint256 tokenId
    ) public view returns (string memory) {
        TokenSetting memory _tokenSetting; // = iwatchenzDB.getSetting(tokenId);
        return _renderToken(tokenId, _tokenSetting);
    }

    function _renderSVG1(
        Genome memory _genome,
        TokenSetting memory _setting
    ) private view returns (string memory) {
        string memory _crownGaurd;
        if (_genome.crownGaurd == 1) {
            _crownGaurd = crownGaurdSVG;
        } else {
            _crownGaurd = "";
        }
        string memory _svg10 = string(
            abi.encodePacked(
                getSVGParts(0),
                get_svg(0, _genome.color_a),
                get_svg(1, _genome.color_b),
                get_svg(2, _genome.color_c),
                getSVGParts(1),
                _setting.dynamicBackground,
                getSVGParts(2),
                get_svg(3, _genome.strap), //strap
                getSVGParts(3)
            )
        );
        string memory _svg11 = string(
            abi.encodePacked(
                _crownGaurd,
                getSVGParts(4),
                _setting.dynamicDial,
                getSVGParts(5),
                get_svg(5, _genome.minute_marker), //min marker//5
                getSVGParts(6)
            )
        );
        return string(abi.encodePacked(_svg10, _svg11));
    }

    function _renderSVG2(
        Genome memory _genome
    ) private view returns (string memory) {
        string memory _dd;
        string memory _hmask;
        if (_genome.ref == 0) {
            _hmask = "";
            _dd = "";
        }
        if (_genome.ref == 1) {
            _hmask = "";

            _dd = _day;
        }
        if (_genome.ref == 2) {
            _hmask = _hourMask;
            _dd = string(abi.encodePacked(_day, _date));
        }
        string memory _svg2 = string(
            abi.encodePacked(
                _hmask,
                getSVGParts(7),
                get_svg(4, _genome.hour_marker), //hour marker//4,
                getSVGParts(8),
                _dd,
                get_svg(6, _genome.hands), // hands//6
                getSVGParts(9),
                get_svg(7, _genome.bezel_marker), //bezel marker//7
                getSVGParts(10)
            )
        );
        return _svg2;
    }

    function _renderToken(
        uint256 tokenId,
        TokenSetting memory _setting
    ) private view returns (string memory) {
        Genome memory _genome = getGenome(tokenId);

        string memory _svg1 = _renderSVG1(_genome, _setting);

        string memory _svg2 = _renderSVG2(_genome);

        return
            string(
                abi.encodePacked(
                    _svg1,
                    _svg2,
                    getScript(_setting.timeZone, _setting.locationParameter)
                )
            );
    }

    function previewTokenURI(
        uint256 tokenId,
        TokenSetting memory _tokenSetting,
        TokenSettingFlags memory _tokenSettingFlag
    ) external view returns (string memory) {
        TokenSetting memory _returnSetting = iwatchenzDB.getSetting(tokenId);
        string memory _defualtBackground;
        string memory _defualtDial;
        string memory _defualtLocation;
        (_defualtBackground, _defualtDial, _defualtLocation) = iwatchenzDB
            .retriveChannel(tokenId);

        require(_tokenSetting.timeZone <= 86400, "days is 86400 sec");
        if (_tokenSettingFlag.timeZoneFlag == true) {
            _returnSetting.timeZone = _tokenSetting.timeZone;
        }

        if (_tokenSettingFlag.dynamicBackgroundFlag == true) {
            if (bytes(_tokenSetting.dynamicBackground).length == 0) {
                _returnSetting.dynamicBackground = _defualtBackground;
            } else {
                _returnSetting.dynamicBackground = _tokenSetting
                    .dynamicBackground;
            }
        }
        if (_tokenSettingFlag.dynamicDialFlag == true) {
            if (bytes(_tokenSetting.dynamicDial).length == 0) {
                _returnSetting.dynamicDial = _defualtDial;
            } else {
                _returnSetting.dynamicDial = _tokenSetting.dynamicDial;
            }
        }
        if (_tokenSettingFlag.locationParameterFlag == true) {
            if (bytes(_tokenSetting.locationParameter).length == 0) {
                _returnSetting.locationParameter = _defualtLocation;
            } else {
                _returnSetting.locationParameter = _tokenSetting
                    .locationParameter;
            }
        }
        return _renderToken(tokenId, _returnSetting);
    }

    function getScript(
        uint256 timeZone,
        string memory location
    ) private view returns (string memory) {
        uint256 _offSet = timeZone % 86400;
        string memory _script = string(
            abi.encodePacked(
                svgScript0,
                _offSet.toString(),
                svgScript1,
                location,
                svgScript2,
                _timeAPI,
                svgScript3,
                _weatherAPI,
                svgScript4
            )
        );
        return _script;
    }

    //attributes
    function generateAttributes(
        uint256 tokenId
    ) private view returns (string memory) {
        Genome memory _genome = getGenome(tokenId);

        string memory _attributes = '"attributes": [';
        string memory _temp0 = string(
            abi.encodePacked(
                '{"trait_type": "Body", "value": "',
                get_title(0, _genome.color_a),
                '"},',
                '{"trait_type": "Dial", "value": "',
                get_title(1, _genome.color_b),
                '"},',
                '{"trait_type": "Bezel material", "value": "',
                get_title(2, _genome.color_c),
                '"},'
            )
        );
        string memory _temp1 = string(
            abi.encodePacked(
                '{"trait_type": "Strap", "value": "',
                get_title(3, _genome.strap),
                '"},',
                '{"trait_type": "Hour Marker", "value": "',
                get_title(4, _genome.hour_marker),
                '"},',
                '{"trait_type": "Minute Marker", "value": "',
                get_title(5, _genome.minute_marker),
                '"},'
            )
        );
        string memory _temp2 = string(
            abi.encodePacked(
                '{"trait_type": "Hands", "value": "',
                get_title(6, _genome.hands),
                '"},',
                '{"trait_type": "Bezel Type", "value": "',
                get_title(7, _genome.bezel_marker),
                '"},',
                '{"trait_type": "Crown", "value": "',
                get_title(8, _genome.crownGaurd),
                '"},'
                '{"trait_type": "Reference", "value": "',
                get_title(9, _genome.ref)
            )
        );
        _attributes = string(
            abi.encodePacked(_attributes, _temp0, _temp1, _temp2, '"}]')
        );
        return _attributes;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        string
            memory _htmlHead = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Watchenz</title></head><body>';
        string memory _htmlEnd = "</body></html>";
        string
            memory _metadata = '{ "description" : "Customizable OnChain Watch with endless possibilities.","image": "';
        // string memory _temp = '", "animation_url": "';
        string memory metaByteString;
        // string memory attributes = generateAttributes(tokenId);
        // string memory _rawSVG = renderTokenById(tokenId);
        // string memory _noHrefSVG = renderTokenByIdWithNoHref(tokenId);

        // = string(abi.encodePacked(svgHead, _noHrefSVG, svgEnd));
        string memory img = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(
                    bytes(
                        (
                            abi.encodePacked(
                                svgHead,
                                renderTokenByIdWithNoHref(tokenId),
                                svgEnd
                            )
                        )
                    )
                )
            )
        );
        // string memory animation = string(
        //     abi.encodePacked(_htmlHead, svgHead, _rawSVG, svgEnd, _htmlEnd)
        // );
        string memory animation = string(
            abi.encodePacked(
                _htmlHead,
                _newHtmlSVGHead,
                renderTokenById(tokenId),
                svgEnd,
                _htmlEnd
            )
        );
        // mime type html
        animation = string(
            abi.encodePacked(
                "data:text/html;base64,",
                Base64.encode(bytes(animation))
            )
        );
        metaByteString = Base64.encode(
            bytes(
                abi.encodePacked(
                    _metadata,
                    img,
                    '", "animation_url": "',
                    animation,
                    '",',
                    generateAttributes(tokenId),
                    "}"
                )
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    metaByteString
                )
            );
        // return str
        // return "metadate-renderer-placeholder";
    }

    //settings for Owner
    function setWatchenzDB(address _watchenzDB) public onlyOwner {
        iwatchenzDB = IWatchenzDB(_watchenzDB);
    }

    function getWatchenzDB() external view returns (address) {
        return address(iwatchenzDB);
    }

    function setTimeAPI(string memory _time) public onlyOwner {
        _timeAPI = _time;
    }

    function getTimeAPI() public view returns (string memory) {
        return _timeAPI;
    }

    function setWeatherAPI(string memory _weather) public onlyOwner {
        _weatherAPI = _weather;
    }

    function getWeatherAPI() external view returns (string memory) {
        return _weatherAPI;
    }
}
