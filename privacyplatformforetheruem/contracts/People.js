var peopleContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"_success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}]);
var people = peopleContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '606060405261053e806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634f995d0814610052578063773b82a3146101245780639e7a13ad146101695761004d565b610002565b346100025761006460048050506101b0565b604051808060200180602001806020018481038452878181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f1509050018481038352868181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f1509050018481038252858181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f150905001965050505050505060405180910390f35b346100025761015160048080359060200190919080359060200190919080359060200190919050506103d9565b60405180821515815260200191505060405180910390f35b346100025761018460048080359060200190919050506104fb565b604051808460001916815260200183600019168152602001828152602001935050505060405180910390f35b60206040519081016040528060008152602001506020604051908101604052806000815260200150602060405190810160405280600081526020015060006020604051908101604052806000815260200150602060405190810160405280600081526020015060206040519081016040528060008152602001506000606060405190810160405280600081526020016000815260200160008152602001506000600050805490509550856040518059106102675750595b90808252806020026020018201604052801561027e575b5094508560405180591061028f5750595b9080825280602002602001820160405280156102a6575b509350856040518059106102b75750595b9080825280602002602001820160405280156102ce575b509250600091505b858210156103c057600060005082815481101561000257906000526020600020906003020160005b5060606040519081016040529081600082016000505460001916815260200160018201600050546000191681526020016002820160005054815260200150509050805080600001518583815181101561000257906020019060200201906000191690818152602001505080602001518483815181101561000257906020019060200201906000191690818152602001505080604001518383815181101561000257906020019060200201909081815260200150505b81806001019250506102d6565b8484849850985098506103ce565b505050505050909192565b6000606060405190810160405280600081526020016000815260200160008152602001508481600001906000191690818152602001505083816020019060001916908181526020015050828160400190908181526020015050600060005080548060010182818154818355818115116104a4576003028160030283600052602060002091820191016104a3919061046b565b8082111561049f5760006000820160005060009055600182016000506000905560028201600050600090555060030161046b565b5090565b5b5050509190906000526020600020906003020160005b839091909150600082015181600001600050556020820151816001016000505560408201518160020160005055505050600191506104f3565b509392505050565b600060005081815481101561000257906000526020600020906003020160005b91509050806000016000505490806001016000505490806002016000505490508356', 
     gas: 3000000
   }, function(e, contract){
    console.log(e, contract);
    if (typeof contract.address != 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })