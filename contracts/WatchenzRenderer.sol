pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils/WatchenzDataHandler.sol";

contract WatchenzRenderer is WatchenzDataHandler {
    function fff() public view onlyOwner returns (bool) {
        return true;
    }
}
