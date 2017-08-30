contract People{
	
	Person[] public people;

	struct Person{
		//bytes32 is used over string, since we need a fixed length
		//for each element in arrays
		bytes32 firstName;
		bytes32 lastName;
		uint age;
	}

	//Setter
	function addPerson(bytes32 _firstName, bytes32 _lastName, uint _age) returns(bool _success){

		Person memory newPerson;
		newPerson.firstName = _firstName;
		newPerson.lastName = _lastName;
		newPerson.age = _age;

		people.push(newPerson);
		return true;

	}

	//Getter
	function getPeople() constant returns(bytes32[], bytes32[], uint[]){

		uint length = people.length;

		//Initialize storage in memory
		bytes32[] memory firstNames = new bytes32[](length);
		bytes32[] memory lastNames = new bytes32[](length);
		uint[] memory ages = new uint[](length);

		for (uint i = 0; i < length; i++){
			Person memory currentPerson;
			currentPerson = people[i];

			// foo.push(bar) only works for storage
			// in memory must use index
			firstNames[i] = currentPerson.firstName;
			lastNames[i] = currentPerson.lastName;
			ages[i] = currentPerson.age;
		}

		//Returns a tuple
		return (firstNames, lastNames, ages);

	}
}
