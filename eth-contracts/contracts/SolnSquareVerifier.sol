// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import './ERC721Mintable.sol';
import './Verifier.sol';


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{

Verifier verifier;
constructor(address verifierAddress) {
    verifier = Verifier(verifierAddress);  
}
// TODO define a solutions struct that can hold an index & an address
struct Solution{
   uint256 index;
   address submitter;
   bool isUsed;
   bool isSubmitted;
}

// TODO define an array of the above struct
Solution[] solutionsArr; 

// TODO define a mapping to store unique solutions submitted
 mapping(uint256 => Solution) private solSubmissions;

// TODO Create an event to emit when a solution is added
  event SolutionSubmitted(uint256 _index, address _address);


 function submitSolution(Verifier.Proof memory proof, uint[2] memory _inputs, address _address, uint256 _index) 
 public returns(bool) {
    require(verifier.verifyTx(proof,_inputs), "Unable to verify the solution");
    require(!solSubmissions[_index].isSubmitted, "Solution already exists");

    solSubmissions[_index]=Solution({index: _index, submitter: _address, isUsed: false, isSubmitted:true});
    emit SolutionSubmitted(_index, _address);  
    return true;  
  }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly 
 function mintToken(address _address, uint256 _tokenId) public onlyOwner returns(bool) {
    require(!solSubmissions[_tokenId].isUsed, "Solution has already been used");
    require(solSubmissions[_tokenId].submitter == _address, "Provided address does not match the solution address");
      super.mint(_address, _tokenId);
      solSubmissions[_tokenId].isUsed = true;
    return true;
    }
      
}




















  


























