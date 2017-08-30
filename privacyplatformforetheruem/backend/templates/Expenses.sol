pragma solidity ^0.4.2;

contract Expenses {  // can be killed, so the owner gets sent the money in the end

    address public organizer;
    uint256 public balance;
    uint in_prec = 16;    //== 2048-bit number (happens when key of encryption is 1024-bit)
    uint out_prec = 32;
    uint base = 16;
    uint solprecused = 128;
    
    function Expenses(uint256 _balance) {
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
    
    //Input is a hex string, eg: "ffff", "1234" (max 512 characters)
    //Output is a hex string, eg: "ffe01394" (1024 characters if in_prec = 16)
    function multiply(string A, string B) constant returns (string){
        
        uint128[] memory a = stringToUintArray(reverseString(A));
        uint128[] memory b = stringToUintArray(reverseString(B));
        
        string memory C = uintArrayToString(mulbig(a,b));
        return reverseString(C);
    }

    function mulbig(uint128[] a, uint128[] b) constant returns (uint128[]) {
        
        uint128[] memory total = new uint128[](out_prec);
        uint128[] memory r = new uint128[](out_prec);
        uint256 mask = uint256(base**out_prec);

        uint i;
        for(i=0; i < a.length; i++){
            //initiaze row to 0
            for(uint k=0; k < out_prec; k++){
                r[k] = 0;
            }   
            
            uint j;
            uint256 p = 0;
            uint128 carry = 0;

            //multiply row
            for(j=0; j < b.length; j++){
                p = uint256(a[i]) * uint256(b[j]) + uint256(carry);    //this is the previous carry
                carry = uint128(p / mask);                            //calculating new carry here
                r[j+i] = uint128(p % mask);    
            }
            r[j+i] = carry;
            
            //add row to total
            carry = 0;
            p = 0;
            for(uint l=0; l < out_prec; l++) {
                p = uint256(r[l]) + uint256(total[l]) + uint256(carry);
                carry = uint128(p / mask);
                total[l] = uint128(p % mask);
            }            
        }   

        return (total);
    }

    // Utility functions that support the multiply function
    function reverseString(string s) constant returns (string){
        bytes memory b = bytes(s);
        bytes memory r = new bytes(b.length);

        uint i;
        for(i=0; i<b.length; i++){
            r[b.length-i-1] = b[i];
        }
        return string(r);
    }
    
    function stringToUintArray(string a) constant returns (uint128[]){
        bytes memory b = bytes(a);
        uint128[] memory t = new uint128[](in_prec);

        for(uint i = 0; i < in_prec && i < b.length; i++){
            uint x = 0;
            uint n = 0;
            for(uint j = 0; j < out_prec && i*out_prec + j < b.length; j++){
                n = hextoint(b[j+i*out_prec]);
                x = x + n*(in_prec**j);
            }
            
            t[i] = uint128(x);
        }
        return (t);
    }

    function uintArrayToString(uint128[] t) constant returns (string str){
        bytes memory b = new bytes(solprecused*out_prec/4); // {128 * 32 / 4} (4 because each hex represents 4bits)

        for(uint i = 0; i < out_prec; i++){
            uint256 x = t[i];
            uint256 n;
            uint256 m;
            for(uint j = 0; j < out_prec; j++){
                m = (base**(out_prec-j-1));
                n = x/m;
                x = x - n*m;
                
                b[i*out_prec+out_prec-j-1] = inttohex(uint8(n));
            }
        }

        str = string(b);

        return (str);
    }

    function hextoint(byte a) constant returns (uint8){
        uint8 n = uint8(a);
        uint8 x;
        if(n >= 48 && n <=57){
            x = n - 48;
        }
        else if(n >= 97 && n <= 102){
            x = n - 97 + 10;
        }
        else if(n >= 65 && n <= 70){
            x = n - 65 + 10;
        }
        else{
            throw;
        }
        return x;
    } 
    
    function inttohex(uint8 n) constant returns (byte){
        uint8 x;
        if(n >= 0 && n <= 9){
            x = n + 48;
        }
        else if(n >= 10 && n <= 15){
            x = n - 10 + 97;
        }
        else{
            throw;
        }
        return byte(x);
    }
    


    // EXTRA functions used for debugging. NOT USED in the multiply function above
    function stringToUint(string a) constant returns (uint128) {
        bytes memory b = bytes(a);
        uint i;
        uint result = 0;
        for(i=0; i<b.length; i++){
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return uint128(result);
    }
    
    function stringHexToUint(string a) constant returns (uint128) {
        bytes memory b = bytes(a);
        uint i;
        uint result = 0;
        for(i=0; i<b.length; i++){
            uint c = hextoint(b[i]);
            result = result * 16 + c;
        }
        return uint128(result);
    }
    

    
    function stringToUintArray8(string a) constant returns (uint8[8] t){
        bytes memory b = bytes(a);

        for(uint i = 0; i < b.length; i++){
            t[i] = uint8(b[i]) - 48;
        }

        return t;
    }
    
    function uintArrayToString2048(uint8[2048] t) constant returns (string str){
        bytes memory b = new bytes(2048);

        for(uint i = 0; i < t.length; i++){
            b[i] = byte(t[i] + 48);
        }

        str = string(b);

        return str;
    }
    
    function max(uint a, uint b) returns (uint) {
        if (a > b) return a;
        else return b;
    }
    
    function destroy() {
        if (msg.sender == organizer) { // without this funds could be locked in the contract forever!
            suicide(organizer);
        }
    }
}

