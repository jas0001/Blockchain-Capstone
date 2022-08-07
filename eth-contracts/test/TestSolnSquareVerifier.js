const SolnSquareVerifier = artifacts.require('./SolnSquareVerifier');
const Verifier = artifacts.require('./Verifier');

var Proof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];
  const account_four = accounts[3];

  beforeEach(async function() {   
    let verifierContract = await Verifier.new({from: account_one});
    this.contract = await SolnSquareVerifier.new(verifierContract.address); 
  });

  it("should not add new solutions if proof fails", async function()  {      
    //add soultion with false proof
     let result = false;
     try{
      await this.contract.submitSolution(Proof.proof, [11, 15], account_two, 2, {from:account_one});    
        }catch (e) {
        result = true;
       }      
      //result should be true
      assert.equal(result,true,"Solution not submitted");
   });
       
  it("should add new solutions (same solution only once)", async function()  {      
   //add first soultion
    let result = false;//await this.contract.submitSolution(Proof.proof, Proof.inputs, account_two, 2, {from:account1});  
    try{
     await this.contract.submitSolution(Proof.proof, Proof.inputs, account_two, 2, {from:account_one});    
       }catch (e) {
       result = true;
      }      
    //try to add the same solution again 
    let result2 = false;
    try{
      await this.contract.submitSolution(Proof.proof, Proof.inputs, account_two, 2, {from:account_one});    
        }catch (e) {
        result2 = true;
       }  
       //add a second solution
       let result3 = false;
    try{
      await this.contract.submitSolution(Proof.proof, Proof.inputs, account_three, 3, {from:account_one});    
        }catch (e) {
        result3 = true;
       }  
        
     //first and last result should be false, second should be true
     assert.equal(result,false,"Solution (1) not submitted");
     assert.equal(result2,true,"Same solution (1) added twice");
     assert.equal(result3,false,"Solution (2) not submitted");
  });
  it("only owner should be able to mint", async function()  {      
    let result1 = false;
    let result2 = false;
    //add soulution
      try{
        await this.contract.submitSolution(Proof.proof, Proof.inputs, account_three, 4, {from:account_one});    
      }catch (e) {
          result1 = true;
       }  
       //try to mint token using account other than owner for added solution
       try{
        await this.contract.mintToken(account_three, 4, {from:account_two});    
          }catch (e) {
          result2 = true;
        }               
       //result1 should be false, result2 should be true 
      assert.equal(result1,false,"Not added solution");
      assert.equal(result2,true,"Other than owner can mint");
  });
  it("owner should be able to mint for approved/added solutions", async function()  {      
    let result = false;
    let result2 = false;
    //add soulution
      try{
        await this.contract.submitSolution(Proof.proof, Proof.inputs, account_three, 4, {from:account_one});    
      }catch (e) {
          result2 = true;
       }  
       //mint token using added solution
       try{
        await this.contract.mintToken(account_three, 4, {from:account_one});    
          }catch (e) {
          result = true;
        }               
       //both result should be false 
      assert.equal(result2,false,"Not added solution");
      assert.equal(result,false,"Not minting added solution");
  });
  it("should only be able to mint once for each solution", async function()  {      
    let result1 = false;    
    let result2 = false;  
    let result3 = false;   
    //add soulution
      try{
        await this.contract.submitSolution(Proof.proof, Proof.inputs, account_three, 4, {from:account_one});    
      }catch (e) {
        result1 = true;
       }  
       //mint 
       try{
        await this.contract.mintToken(account_three, 4, {from:account_one});    
          }catch (e) {
          result2 = true;
        }  
       //try to mint using same soultion again 
       try{
        await this.contract.mintToken(account_three, 4, {from:account_one});    
          }catch (e) {
          result3 = true;
        }  
       //result1 and 2  should be false, result3 should be true 
      assert.equal(result1,false,"Solution not added");
      assert.equal(result2,false,"Mint failed first time for solution");      
      assert.equal(result3,true,"Can mint using same soultion twice"); 
  });
  it("should not be able to mint for not approved/added solutions", async function()  {      
    let result = false;    
   
       //mint token using not added solution
       try{
        await this.contract.mintToken(account_three, 6, {from:account_one});    
          }catch (e) {
          result = true;
        }          
       //result should be true      
      assert.equal(result,true,"Minting not added solution");
  }); 
    it('should return total supply and balanceOf', async function () { 
      //add solutions and mint
      await this.contract.submitSolution(Proof.proof, Proof.inputs, account_two, 1, {from:account_one});  
      await this.contract.submitSolution(Proof.proof, Proof.inputs, account_three, 2, {from:account_one}); 
      await this.contract.submitSolution(Proof.proof, Proof.inputs, account_three, 3, {from:account_one}); 
      await this.contract.submitSolution(Proof.proof, Proof.inputs, account_four, 4, {from:account_one}); 
      await this.contract.mintToken( account_two, 1, {from:account_one}); 
      await this.contract.mintToken(account_three,2, {from:account_one}); 
      await this.contract.mintToken(account_three, 3, {from:account_one}); 
      await this.contract.mintToken(account_four, 4, {from:account_one});
      //check toal supply 
      let totalSupply = await this.contract.totalSupply.call();  
      //console.log("Total supply: " + totalSupply);               
      assert.equal( totalSupply, 4, "Total supply is incorrect.");
      //check balance of accounts
      let result1=await this.contract.balanceOf(account_two);   
      let result2=await this.contract.balanceOf(account_three);
      let result3=await this.contract.balanceOf(account_four);
      assert.equal(result1,1,"Balance for account two should be 1");
      assert.equal(result2,2, "Balance for account three should be 2");
      assert.equal(result3,1, "Balance for account four should be 1");
  })
});  
