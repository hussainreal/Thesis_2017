pragma solidity ^0.4.2;
contract Conference {  // can be killed, so the owner gets sent the money in the end

	address public organizer;
	uint256 public g = 2869930398;
	uint256 public n = 2869930397;
	uint256 public nSq = 8236500483624577609;

	uint256 public balance;
	uint256 temp;

	event Deposit(address _from, uint _amount); // so you can log the event
	event Refund(address _to, uint _amount); // so you can log the event

	function Conference(uint256 _balance) {
		organizer = msg.sender;		
		balance = _balance;
	}

	function getBalance() constant returns (uint256) {
		return balance;
	}
	

/*
	// basic add - no encryption
	function addToBalance(uint change) returns (uint) {
		balance = balance + change;
		return balance;
	}
*/

	function addToBalance(uint256 change) {
		temp = balance * change;
		balance = temp % nSq;
	}




	function destroy() {
		if (msg.sender == organizer) { // without this funds could be locked in the contract forever!
			suicide(organizer);
		}
	}
}
