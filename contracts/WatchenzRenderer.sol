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
        "https://watchenzonbase.vercel.app/api/currentweather?city=";
    // day
    string private constant _day =
        '<g id="day"><path d="M247.792 92.1584C232.787 85.4778 216.548 82.0173 200.123 82.0001C183.698 81.9829 167.452 85.4094 152.433 92.0586L159.568 108.175C172.334 102.523 186.143 99.6104 200.105 99.6251C214.066 99.6397 227.869 102.581 240.623 108.26L247.792 92.1584Z" fill="white" stroke-width="1" stroke="#1c1c1c" filter="url(#innerShadow)"></path><text textLength="81" lengthAdjust="spacing"><textPath id="dayu" textLength="81" lengthAdjust="spacing" href="#datePath" font-family="Arial" font-size="10" font-weight="bold" dominant-baseline="central" text-anchor="start" fill="black">MONDAY</textPath></text></g>';
    string private constant _date =
        '<g id="date"><rect x="269" y="190" width="28" height="20" fill="white" stroke-width="1" stroke="#1c1c1c" filter="url(#innerShadow)"></rect><text x="283" y="200" id="dateu" textLength="14" lengthAdjust="spacing" font-family="Arial" font-size="12" font-weight="bold" dominant-baseline="central" text-anchor="middle" fill="black">11</text></g>';
    //
    string private constant crownGaurdSVG =
        '<path d="M381 232.671V220.934C381 218.209 378.862 216 376.224 216H361.694C359.624 216 357.789 217.377 357.148 219.411L349.247 244.52C347.892 248.822 352.384 252.583 356.176 250.321L378.608 236.949C380.088 236.067 381 234.436 381 232.671Z" fill="url(#a)"></path><path d="M381 166.8L380.998 178.202C380.998 180.849 378.859 182.996 376.221 182.997L361.69 183C359.619 183.001 357.785 181.662 357.144 179.686L349.246 155.296C347.893 151.117 352.385 147.463 356.178 149.659L378.609 162.644C380.089 163.501 381 165.085 381 166.8Z" fill="url(#a)"></path>';

    //--- tokenURI U+00b0 \u00b0
    string private constant svgEnd = "</svg>";
    string private constant svgHead =
        '<svg id="thewatch" width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">';
    string private constant svgPart0 = '<defs id="defs">';
    // colorURLS
    string private constant svgPart1 =
        '</defs><defs><filter id="f1"><feDropShadow dx="-5" dy="-2" stdDeviation="0.5" flood-opacity="0.2"></feDropShadow></filter><filter id="innerShadow" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="-4" dx="-5"></feOffset><feGaussianBlur stdDeviation="2.5"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1.5" k3="1.5"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect_innerShadow"></feBlend></filter><filter id="blur" height="300%" width="300%" x="-75%" y="-75%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="#000" result="glowColor" flood-opacity="0.9"></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored"></feComposite><feMerge><feMergeNode in="softGlow_colored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path id="datePath" d="M159.568 98.1748C172.334 92.523 186.143 89.6104 200.105 89.6251C214.066 89.6397 227.869 92.5811 240.623 98.2596" stroke="black"></path></defs><rect x="0" y="0" width="400" height="400" fill="white" fill-opacity="0.1"></rect><g id="strap">';
    //strap
    string private constant svgPart2 =
        '</g><g id="crown" transform="translate(0 0)"><rect x="350" y="191" width="22" height="18" fill="url(#c)" stroke="url(#a)"></rect><rect x="360" y="182" width="22" height="36" rx="5" fill="url(#c)"></rect><rect x="360" y="182.5" width="21" height="35" rx="4.5" stroke="url(#a)"></rect><path d="M370 185.481V215.215" stroke="white" stroke-opacity="0.4" stroke-width="20" stroke-dasharray="3 3"></path></g><g id="bodyDial">';
    //crowngaurd?
    string private constant svgPart3 =
        '<path d="M270 21H290.483L310 96H270V21Z" fill="url(#a)"></path><path d="M130 21H109.517L90 96H130V21Z" fill="url(#a)"></path><path d="M270 379H290.483L310 304H270V379Z" fill="url(#a)"></path><path d="M130 379H109.517L90 304H130V379Z" fill="url(#a)"></path><path d="M200 345C280.081 345 345 280.081 345 200C345 119.919 280.081 55 200 55C119.919 55 55 119.919 55 200C55 280.081 119.919 345 200 345Z" fill="url(#b)" stroke="url(#a)" stroke-width="34"></path></g><g id="lcd"><mask id="bg-mask"><circle cx="200" cy="200" r="130" fill="white" stroke="black" stroke-width="2"></circle></mask><image id="bg-image" href="';
    // _lcd
    string private constant svgPart4 =
        '" x="70" y="70" width="260" height="260" mask="url(#bg-mask)" preserveAspectRatio="xMidYMid slice"></image></g><g id="indicators"><g id="minuteMarker">';
    //minIndicator

    string private constant svgPart5 = '</g><g id="hourMarker">';
    //hourIndicator
    string private constant svgPart6 =
        '</g></g><g id="weather"><image filter="url(#blur)" id="w-icon" href="https://cdn.weatherapi.com/weather/64x64/day/116.png" x="90.5" y="200.5" width="64" height="64" opacity="1"></image><text filter="url(#blur)" id="w-city" x="101.5" y="264.5" font-family="Arial" font-size="16" font-weight="bold" dominant-baseline="central" text-anchor="start" fill="white" stroke="black" stroke-width="0.8">';
    // _location
    string private constant svgPart7 =
        '</text><text filter="url(#blur)" id="w-temp" x="122.5" y="282.5" font-family="Arial" font-size="12" font-weight="bold" dominant-baseline="central" text-anchor="start" fill="white" stroke="black" stroke-width="0.6" style="background-color:red">24C/75.2F</text></g>';
    // day? date?
    //hands

    string private constant svgPart8 =
        '<g id="bezelCrystal"><path d="M200 344C279.529 344 344 279.529 344 200C344 120.471 279.529 56 200 56C120.471 56 56 120.471 56 200C56 279.529 120.471 344 200 344Z" stroke="url(#c)" stroke-width="28"></path></g><g id="bezelIndicator">';
    // bezelIndicator
    string private constant svgPart9 = "</g>";

    //
    string private constant svgScript0 = "<script> var apiTime,_offSet=";
    string private constant svgScript1 = ',_location="';
    string private constant svgScript2 =
        '",userOffset=0,crownOut=!1;const weekdays=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY",];async function getUTC(){await fetch("';
    // timeAPI
    string private constant svgScript3 =
        '").then(e=>e.json()).then(e=>{apiTime=e.unixtime})}const hourHand=document.getElementById("houru"),minHand=document.getElementById("minu"),secHand=document.getElementById("secondu"),dayText=document.getElementById("dayu"),dateText=document.getElementById("dateu"),weatherIcon=document.getElementById("w-icon"),weatherCity=document.getElementById("w-city"),weatherTemp=document.getElementById("w-temp");async function getWeather(){fetch("';
    // weatherAPI \u00b0 + space?
    string private constant svgScript4 =
        '"+_location).then(e=>e.json()).then(e=>{if(!e.ok){console.log(e.msg);return}weatherIcon.setAttribute("href","https:"+e.data.current.condition.icon),weatherCity.innerHTML=e.data.location.name,weatherTemp.innerHTML=e.data.current.temp_c+"\\u00b0C/"+e.data.current.temp_f+"\\u00b0F"}).catch(console.error)}function baseDateObj(){userOffset=Math.floor(new Date().getTime())-1e3*apiTime;var e=new Date(0);return e.setUTCSeconds(apiTime+_offSet),e}function generateCurrentTime(e){return new Date(e.getTime()+6e4*e.getTimezoneOffset()+userOffset)}function generateCurrentAngles(e){var t=6*e.getSeconds()+6*e.getMilliseconds()/1e3,n=6*e.getMinutes()+.1*e.getSeconds(),r=30*e.getHours()+.5*e.getMinutes();minHand.setAttribute("transform",`rotate(${n},200,200)`),hourHand.setAttribute("transform",`rotate(${r},200,200)`),secHand.setAttribute("transform",`rotate(${t},200,200)`)}function generateDay(e){dayText.innerHTML=weekdays[e.getDay()]}function generateDate(e){dateText.innerHTML=e.getDate()}const crown=document.getElementById("crown");function actual(){if(crownOut)return;let e=baseDateObj(),t=generateCurrentTime(e);generateCurrentAngles(t),document.getElementById("day")&&generateDay(t),document.getElementById("date")&&generateDate(t)}async function run(){getUTC().catch(console.error),getWeather().catch(console.error),setInterval(actual,200),setInterval(getWeather,15e3)}crown.addEventListener("click",async()=>{if(crownOut=!crownOut,cX=crown.getAttribute("x"),console.log(cX),!crownOut){await getUTC(),crown.setAttribute("transform","translate(0 0)");return}crown.setAttribute("transform","translate(10 0)")}),run();</script>';
    string private constant svgPart10 = "<script>";

    // centigerad ? api adjustable ok dad farzad hardosh

    function renderTokenById(
        uint256 tokenId
    ) public view returns (string memory) {
        uint256 _timeZone;
        string memory _lcd;
        string memory _location;
        string memory _svg = "";
        string memory _crownGaurd = crownGaurdSVG;
        string memory _dd = string(abi.encodePacked(_day, _date));
        TokenSetting memory _setting = iwatchenzDB.getSetting(tokenId);
        // (_timeZone, _lcd, _location) = iwatchenzDB.getSetting(tokenId);
        _svg = string(
            abi.encodePacked(
                svgPart0,
                get_svg(0, 0),
                get_svg(1, 0),
                get_svg(2, 0),
                svgPart1,
                get_svg(3, 0), //strap
                svgPart2,
                _crownGaurd,
                svgPart3,
                _setting.dynamicDial,
                svgPart4,
                get_svg(4, 0) //minIndicator
            )
        );
        _svg = string(
            abi.encodePacked(
                _svg,
                svgPart5,
                get_svg(5, 0), //hour indicator
                svgPart6,
                _setting.locationParameter,
                svgPart7,
                _dd,
                get_svg(6, 0), // hands
                svgPart8,
                get_svg(7, 0),
                svgPart9
            )
        );
        return
            string(
                abi.encodePacked(
                    _svg,
                    getScript(_setting.timeZone, _setting.locationParameter)
                )
            );
    }

    function previewTokenURI(
        uint256 tokenId,
        uint256 timeZone,
        string memory url,
        string memory location
    ) external view returns (string memory) {}

    function getScript(
        uint256 timeZone,
        string memory location
    ) internal view returns (string memory) {
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

    //metadata
    function generateMetadata() internal view returns (string memory) {
        return "";
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        string memory img = string(
            abi.encodePacked(svgHead, renderTokenById(tokenId), svgEnd)
        );
        string memory _metadata = "";
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
