contract paillierBalance2 {  
    uint nSquared;
    uint public encryptedBalance = 0x36ebd0ea004ad60ba760edc9f7c320d77d3bb24b4ac34244c0ed13a85a493380;
    uint public g = 0x943a4a978f2b454574ae1dcd16d4d928;   
    address public controller;
    uint public n = 0x943a4a978f2b454574ae1dcd16d4d927;

    function paillierBalance2() {                                      
        controller = msg.sender;
        uint nSquaredTemp;
        uint nInner = n;
        assembly {
            let _n := nInner
            nSquaredTemp := exp(_n, 2)
        }
        nSquared = nSquaredTemp;
    }

    modifier onlyController {
        if (msg.sender != controller) throw;  
        _;
    }

    function homomorphicAdd(uint encryptedChange) onlyController {
        uint encryptedBalanceInner = encryptedBalance;              
        uint nSquaredInner = nSquared;              
        uint encryptedBalanceTemp;                                          
        assembly {
            let _encryptedBalance := encryptedBalanceInner                  
            let _encryptedChange := encryptedChange             
            let _nSquared := nSquaredInner                  
            encryptedBalanceTemp := mulmod(_encryptedBalance, _encryptedChange,_nSquared)
        }
        encryptedBalance = encryptedBalanceTemp;                            
    }
}
