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

    function max(uint a, uint b) returns (uint) {
        if (a > b) return a;
        else return b;
    }


    function reverseString(string s) constant returns (string){
        bytes memory b = bytes(s);
        bytes memory r = new bytes(b.length);

        uint i;
        for(i=0; i<b.length; i++){
            r[b.length-i-1] = b[i];
        }
        return string(r);
    }

    function mult(string A, string B) constant returns (string /*uint128[16]*/){

        uint128[16] memory a = stringToUintArray(reverseString(A));
        uint128[16] memory b = stringToUintArray(reverseString(B));

        string memory C = uintArrayToString(mulbig(a,b));

        //string C =
        //return reverseString(C);

        return reverseString(C);
        //return a;
        //return mulbig(a,b);

    }

    function mulbig(uint128[16] a, uint128[16] b) constant returns (uint128[32]) {

        uint128[32] memory total;
        uint128[32] memory r;
        //uint16 debug;
        uint256 basesq = uint256(16**32);

        uint i;
        for(i=0; i < a.length; i++){
            //initiaze row to 0
            for(uint k=0; k < 32; k++){
                r[k] = 0;
            }

            uint j;
            uint256 p = 0;
            uint128 carry = 0;

            //multiply row
            for(j=0; j < b.length; j++){
                p = uint256(a[i]) * uint256(b[j]) + uint256(carry);    //this is the previous carry
                carry = uint128(p / basesq);                  //calculating new carry here
                r[j+i] = uint128(p % basesq);
            }
            r[j+i] = carry;

            //add row to total
            carry = 0;
            p = 0;
            for(uint l=0; l < 32; l++) {
                p = uint256(r[l]) + uint256(total[l]) + uint256(carry);
                carry = uint128(p / basesq);
                total[l] = uint128(p % basesq);
                //if(l == 1) debug = p;
            }
        }
        //return (total, debug);

        return (total);
    }



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
        // else if(n >= 65 && n <= 70){
        //     x = n - 65 + 10;
        // }
        else{
            throw;
        }

        return byte(x);
    }

    function stringToUintArray(string a) constant returns (uint128[16] t){
        bytes memory b = bytes(a);

        for(uint i = 0; i < 16 && i < b.length; i++){
            uint x = 0;
            uint n = 0;
            for(uint j = 0; j < 32 && i*32 + j < b.length; j++){
                n = hextoint(b[j+i*32]);
                x = x + n*(16**j);
            }

            t[i] = uint128(x);
        }
        return (t);
    }

    function test(string a) constant returns (uint8){
        bytes memory b = bytes(a);
        return hextoint(b[0]);
    }

    function stringToUintArray8(string a) constant returns (uint8[8] t){
        bytes memory b = bytes(a);

        //TODO: input validation, check length of a

        //uint8[8] memory t;

        for(uint i = 0; i < b.length; i++){
            t[i] = uint8(b[i]) - 48;
        }

        return t;
    }

    // function testt(string a) constant returns (string str){
    //     uint128[16] memory b;
    //     b[0] = stringHexToUint(a);
    //     return uintArrayToString(b);

    // }

    function uintArrayToString(uint128[32] t) constant returns (string str){
        //bytes memory b = new bytes(512);
        bytes memory b = new bytes(1024);
        uint256 debug;

        for(uint i = 0; i < 32; i++){
            uint256 x = t[i];
            uint256 n;
            uint256 m;
            for(uint j = 0; j < 32; j++){
                m = (16**(32-j-1));
                n = x/m;
                x = x - n*m;

                b[i*32+32-j-1] = inttohex(uint8(n));

            }
            //b[i] = bytes(x);
        }

        str = string(b);

        return (str);
    }


    function uintArrayToString2048(uint8[2048] t) constant returns (string str){
        bytes memory b = new bytes(2048);

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
