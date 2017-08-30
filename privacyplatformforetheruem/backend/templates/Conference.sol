pragma solidity ^0.4.10;

contract Conference {  // can be killed, so the owner gets sent the money in the end

    //address public organizer;
    //uint256 public balance;
    string public balance;
	string public R;
	string public q;
	string public q_prime;
	uint public digitsinR;
	uint128[] public test;


    uint in_prec = 16;    //== 2048-bit number (happens when key of encryption is 1024-bit)
    uint out_prec = 32;
    uint base = 16;
    uint solprecused = 128;
    uint radix = 128;                // Size of uint
    uint half =     2**(radix/2);       // Half bitwidth
    uint low =      half - 1;           // Low mask
    uint high =     low << (radix/2);   // High mask
    uint max =      high | low;         // Max value
    uint[2] zero =  [0, 0];             // bigInt zero
    uint[2] one =   [1, 0];             // bigInt one


    function Conference(string _balance, string _R, string _q, string _q_prime, uint _digitsinR) payable {
        //organizer = msg.sender;
        balance = _balance;
		R = _R;
		q = _q;
		q_prime = _q_prime;
		digitsinR = _digitsinR;
    }

    function getBalance() constant returns (string) {
        
        return balance;
    }
    
    function setBalance(string value) {
        balance = value;
    }

    function addToBalance(string change) constant returns (string) {

        string memory bal1 = balance;
        string memory cha1 = change;
        uint128[] memory a = stringToUintArray(reverseString(bal1));
        uint128[] memory b = stringToUintArray(reverseString(cha1));
        uint128[] memory T = mulbig(a, b);

        uint128[] memory r = stringToUintArray(reverseString(R));
        uint128[] memory Q = stringToUintArray(reverseString(q));
        uint128[] memory Q_prime = stringToUintArray(reverseString(q_prime));
        
        uint128[] memory S = REDC(T, r, Q, Q_prime, digitsinR);
        
        string memory p = reverseString(uintArrayToString(S));
        return p;
    
    }
    
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
    
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function _max(uint a, uint b) constant returns(uint){
        if (a > b)
            return a;

        return b;
    }


    function addHelper(string A, string B) constant returns (string){

        uint128[] memory a = stringToUintArray(reverseString(A));
        uint128[] memory b = stringToUintArray(reverseString(B));

        string memory C = uintArrayToString16(add(a,b));
        return reverseString(C);
    }
    
    function add(uint128[] x, uint128[] y) constant returns(uint128[])
    {
        uint256 carry = 0;
        uint outputSize = _max(x.length, y.length);// + 1;
        uint128[] memory sum = new uint128[](outputSize);
        uint256 MAX = 2**128;


        for(uint i = 0; i < outputSize-1; i++){
            uint256 sol = uint256(x[i]) + uint256(y[i]) + carry;

            carry = sol / MAX;
            sum[i] = uint128(sol % MAX);
        }

        sum[outputSize-1] = uint128((uint256(x[outputSize-1]) + uint256(y[outputSize-1]) + carry) % MAX);

        return sum;

    }

    function subHelper(string A, string B) constant returns (string){

        uint128[] memory a = stringToUintArray(reverseString(A));
        uint128[] memory b = stringToUintArray(reverseString(B));

        string memory C = uintArrayToString16(sub(a,b));
        return reverseString(C);
    }
    
    function sub(uint128[] x, uint128[] y) constant returns(uint128[])
    {
        uint128[] memory diff = new uint128[](out_prec);
        uint128 borrow;
        uint256 MAX = 2**128;

        // Start from the least significant bits
        uint i;
        for (i = 0; i < x.length; ++i)
        {
            diff[i] =  x[i] - y[i] - borrow;
            if (x[i] < y[i] - borrow || (y[i] == MAX && borrow == 1))   // Check for underflow
                borrow = 1;
            else
                borrow = 0;

        }

        return (diff);
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

        for(i=0; i < a.length; i++) {
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
    
    function stringToUintArray32(string a) constant returns (uint128[]){
        bytes memory b = bytes(a);
        uint128[] memory t = new uint128[](32);

        for(uint i = 0; i < 32 && i < b.length; i++){
            uint x = 0;
            uint n = 0;
            for(uint j = 0; j < out_prec && i*out_prec + j < b.length; j++){
                n = hextoint(b[j+i*out_prec]);
                x = x + n*(base**j);
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
    
    function uintArrayToString16(uint128[] t) constant returns (string str){
        bytes memory b = new bytes(solprecused*16/4); // {128 * 32 / 4} (4 because each hex represents 4bits)

        for(uint i = 0; i < 16; i++){
            uint256 x = t[i];
            uint256 n;
            uint256 m;
            for(uint j = 0; j < 32; j++){
                m = (base**(32-j-1));
                n = x/m;
                x = x - n*m;
                b[i*32+32-j-1] = inttohex(uint8(n));
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

    function maximum(uint a, uint b) returns (uint) {
        if (a > b) return a;
        else return b;
    }

    function precisionCompa(uint128[] x, uint start) constant returns(int8){
        for(uint i = start; i < x.length; i++){
            if (x[i] != 0)
                return 1;
        }

        return -1;
    }


    function compHelper(string A, string B) constant returns (int8){

        uint128[] memory a = stringToUintArray(reverseString(A));
        uint128[] memory b = stringToUintArray(reverseString(B));

        int8 C = compa(a, b);
        return C;
    }
    
    function compa(uint128[]x, uint128[]y) constant returns(int8)
    {
        uint len = x.length > y.length ? y.length : x.length;

        if(x.length > y.length && precisionCompa(x, y.length) == 1)
            return 1;
        else if(x.length < y.length && precisionCompa(y, x.length) == 1)
            return -1;

        // Compare the most significant bits first
        for (uint k = 0; k < len; ++k)
        {
            //If x > y: return 1
            if (x[len-k-1] > y[len-k-1])
                return 1;
            //If y > x: return -1
            else if (x[len-k-1] < y[len-k-1])
                return -1;
            //Else, keep looping
        }

        return 0;
    }

    function leftShift(uint128[] x, uint y) constant returns(uint128[])
    {
        if (y==0)  // no shift
            return x;

        uint128 carry;
        uint128 one = 1;

        uint128[] memory r = x;

        for (uint j = y; j > 0; j--)
        {
            for (uint i = 0; i < (x.length - 1) ; ++i)
            {
                r[i] =  (x[i] << 1) + carry;
                carry = x[i] >> uint128(radix - 1);
            }
        }
        //r[1] = one;

        return r;
    }

function rsHelper(string A, uint d) constant returns (string){

        uint128[] memory a = stringToUintArray(reverseString(A));

        string memory C = uintArrayToString16(rightShift(a, d));
        return reverseString(C);
    }
    
function rightShift(uint128[] x, uint y) constant returns(uint128[])
    {
        if (y==0)  // no shift
            return x;

        uint128 carry = 0;
        uint128 one = 1;

        uint128[] memory r;
        // = new uint128[](x.length);
        //uint128[] memory r = x;

        //uint128[] memory f = new uint128[](16);

        //2047 -> 0 5->0
        for (uint j = y; j > 0; j--)
        {
            //31->0   
            carry = 0;
            r = new uint128[](x.length);
            for (uint i = (x.length - 1); i > 0 ; --i)
            {
                r[i] =  (x[i] >> 1) + carry;
                carry = x[i] << uint128(radix - 1); //[10011] >> = [01001] [1]
                //carry = carry >> uint128(radix -1);
                //carry = x[i] & 1;
                
            }                                       // [10000]
            r[i] =  (x[i] >> 1) + carry;
            
            x = r;
        }
        //r[1] = one;

        return r;
    }


    function binModHelper(uint d, string A) constant returns (string){

        uint128[] memory a = stringToUintArray32(reverseString(A));

        uint128[] memory e = binaryMod(d,a);
        string memory f = uintArrayToString16(e);
        
        return reverseString(f);
    }
    
    function binaryMod(uint digitsInR, uint128[] T) constant returns(uint128[])
    {
    	uint numberOfKeptElements;
    	uint numberOfKeptRemainderBits;

    	uint128 maxFill = 340282366920938463463374607431768211455;

    	uint outputSize = T.length;

    	if(outputSize > 16)
    	    outputSize = 16;
    	    

    	uint128[] memory y = new uint128[](outputSize);
    	uint128[] memory c = new uint128[](outputSize);


    	if(digitsInR > radix)
    	{
    	    numberOfKeptElements = digitsInR/radix; //radix = 128; i.e. bits/element
    	    numberOfKeptRemainderBits = digitsInR - (radix*numberOfKeptElements); //2047-1920 = 127
    	}
    	else
    	{
    	    numberOfKeptElements = 0;
    	    numberOfKeptRemainderBits = radix - digitsInR;
    	}

    	uint j=0;

    	if(numberOfKeptElements == 0)
    	{
    	    y[0]  = uint128(2**(numberOfKeptRemainderBits)-1);
    	}
    	else
    	{
        	for(j; j < numberOfKeptElements; j++)
        	{
        	    y[j] = maxFill;
        	}
                            //128 - 127
        	y[numberOfKeptElements]= uint128(2**(numberOfKeptRemainderBits)-1);
    	}

        for(uint i = 0; i < outputSize; i++)
        {
            c[i] = uint128(T[i]&y[i]);
        }


        return c;
    }

    //Note this is done in binary. so you can just drop higher order bits for modulos
    function REDC(uint128[] T, uint128[] R, uint128[] q, uint128[] qprime, uint digitsInR) constant returns(uint128[])
    {
        //m = ((T mod R) · q') mod R
        
        uint128[] memory a = binaryMod(digitsInR, T); //TmodR

        uint128[] memory b = mulbig(a, qprime); //(TmodR)*q'

        uint128[] memory m = binaryMod(digitsInR, b); // m = ((TmodR)3*q')modR

        uint128[] memory c = mulbig(m, q); // m*q

        uint128[] memory d = add(c, T); // T+m*q

        uint128[] memory t = rightShift(d, digitsInR); //t = (T+m*q)/R

        uint128[] memory S = t;

        if (compa(t, q) != -1){
            S = sub(t, q);
        }
	
		return (S);
    }

}
