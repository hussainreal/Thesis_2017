contract paillierBalance {  
    uint nSquared;
    uint public encryptedBalance = 0x2a6a2efecccf5f09e883b87528104e505dedb63fee8de93ccc059116bf32ae5f;
    uint public g = 0xb033814c46b1c673d80ad171adbcf4bc;   
    address public controller;
    uint public n = 0xb033814c46b1c673d80ad171adbcf4bb;

    function paillierBalance() {                                      
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
        _
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
