pragma solidity ^0.8.0;

interface ITokenSetting {
    struct TokenSetting {
        uint24 timeZone;
        bool htmlWrapper;
        string dynamicBackground;
        string dynamicDial;
        string locationParameter;
    }
}
