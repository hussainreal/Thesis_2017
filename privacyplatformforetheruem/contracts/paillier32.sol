pragma solidity ^0.4.4;
contract paillierBalancev7 {  
  
    address public controller;
    uint256 public g = 0x850ddc4e;
    uint256 public n = 0x850ddc4d;
    uint256 public nSquared;
    uint256 public encryptedBalance;
    uint256 public t = 0x34a5c9ac3b992c7; // 3
    uint256 public f = 0x1ab4861fde9bf2f8; // 5
    uint256 public m;
    
    uint256 public mm;

    function paillierBalance() {                                      
        controller = msg.sender;
    }

    modifier onlyController {
        if (msg.sender != controller) throw;  
        _;
    }

    function encnum() {
        nSquared = n * n;
        m = t * f;
        encryptedBalance = m % nSquared;
    }
    function h_add(uint256 tt, uint256 ff) {
        nSquared = n * n;
        mm = tt * ff;
        encryptedBalance = mm % nSquared;
    }
    function reset() {
        encryptedBalance = 0;
    }
}
