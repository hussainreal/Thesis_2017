pragma solidity ^0.4.2;
contract Movie_<contractid> {
	string description
	address Theatre;
	address[] CustomerList;
	uint NumTickets;
	uint Collections;
	uint StartDate;
	uint EndDate;

	function Movie_<contractid>(string desc, numtickets, startdate, enddate) {
		description = desc;
		Theatre = msg.sender;	//FIXME: check this
		NumTickets = numtickets;
		Startdate = startdate;
		EndDate = enddate;
	}

	function buyTicket(uint ticketPrice, uint currentDate) {
		if (NumTickets > 0){
			throw;
		}

		if (currentDate > StartDate && currentDate < endDate) {	//FIXME: how to interact with time server
			throw;
		}
		Collections = Collections + ticketPrice;
		CustomerList.append(msg.sender) //FIXME: check this
	}

	function getCollections() {
		return Collections;
	}

}
