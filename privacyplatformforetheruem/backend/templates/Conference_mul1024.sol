pragma solidity ^0.4.2;

contract Conference {  // can be killed, so the owner gets sent the money in the end

    address public organizer;

    uint256 public balance;

    event Deposit(address _from, uint _amount); // so you can log the event
    event Refund(address _to, uint _amount); // so you can log the event

    function Conference(uint256 _balance) {
        organizer = msg.sender;
        balance = _balance;
    }

    function getBalance() constant returns (uint256) {
        return balance;
    }


    // basic add - no encryption
    function addToBalance(uint change) returns (uint) {
        balance = balance + change;
        return balance;
    }

    function mul(uint256 aa, uint256 bb) constant returns (uint256) {
        return aa*bb;
    }

    function mul8(string A, string B, uint iter) constant returns (string s) {
        
        uint8[8] memory a = stringToUintArray(A);
        uint8[8] memory b = stringToUintArray(B);
        
        //TODO: swap arrays if one of shorter in length than the other
        uint8[16] memory total;
        uint8[16] memory r;


        for(uint i=0; i < a.length; i++){

            //initiaze row to 0
            for(uint k=0; k < 16; k++){
                r[k] = 0;
            } 
            
            //multiply row
            for(uint j=0; j < b.length; j++){
                r[j+i] = a[i] * b[j];
            } 
            
            //add row to total
            uint8 cout = 0;
            uint8 cin = 0;
            for(uint l=0; l < 16; l++){
                cout = (total[l] & r[l]) | cin & (total[l] ^ r[l]);
                total[l] = (total[l] ^ r[l]) ^ cin;
                
                cin = cout;
                cout = 0;
            }
        }
        s = uintArrayToString(total);
        
        return (s);
    }
    
    
    function stringToUintArray(string a) constant returns (uint8[8] t){
        bytes memory b = bytes(a);
        
        //TODO: input validation, check length of a
        
        //uint8[8] memory t;
        
        for(uint i = 0; i < b.length; i++){
            t[i] = uint8(b[i]) - 48;
        }
        
        return t;
    }
 
    function uintArrayToString(uint8[16] t) constant returns (string str){
        bytes memory b = new bytes(16);
        
        //TODO: input validation, check length of a
        
        for(uint i = 0; i < t.length; i++){
            b[i] = byte(t[i] + 48);
        }
        
        str = string(b);
        
        return str;
    }   
    function destroy() {
        if (msg.sender == organizer) { // without this funds could be locked in the contract forever!
            suicide(organizer);
        }
    }
}

