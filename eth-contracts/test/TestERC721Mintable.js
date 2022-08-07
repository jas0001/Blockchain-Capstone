var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const uri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Katten", "KAT",uri, {from: account_one});
        })
        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner.call();
            assert.equal(result, account_one, `Contract owner should be ${account_one}`)

        });
        it('owner should be able to mint', async function () {
            let result = false;
             //console.log("account_one: " + account_one);
             try{
               await this.contract.mint(account_two, 1, {from: account_one});
            }catch (e) {
               result = true;
               }       
         
            assert.equal(result, false, `Contract owner cannot mint`);
         }); 
         it('only owner should be able to mint', async function () {
            let result = false;
             try{
               await this.contract.mint(account_two, 2, {from: account_two});
            }catch (e) {
               result = true;
               }       
         
            assert.equal(result, true, `Other than owner can mint`);
         }); 
    });

     describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Katten", "KAT",uri,{from: account_one});
            // TODO: mint multiple tokens          
            await this.contract.mint( account_two, 2, { from: account_one } );
            await this.contract.mint( account_three, 3, { from: account_one } );
            await this.contract.mint( account_three, 4, { from: account_one } );
            await this.contract.mint( account_three, 5, { from: account_one } );
            await this.contract.mint( account_four, 6, { from: account_one } );
        })

       it('should return total supply', async function () { 
           let totalSupply = await this.contract.totalSupply.call();  
           console.log("Total supply: " + totalSupply);         
           assert.equal( totalSupply, 5, "Total supply is incorrect.");
        })

        it('should get token balance', async function () { 
            let result1=await this.contract.balanceOf(account_two);   
            let result2=await this.contract.balanceOf(account_three);
            assert.equal(result1,1,"Balance for account two should be 1");
            assert.equal(result2,3, "Balance for account three should be 3");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
       it('should return token uri', async function () { 
        let result=await this.contract.getTokenURI(2);
        assert.equal(result,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2");     
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_three,account_two,3,{from:account_three});
            let result=await this.contract.ownerOf(3);
            assert.equal(result,account_two, "Not able to transfer from one owner to another");
        })

        it('only owner should be able to transfer token', async function () { 
            let result = false;
             try{
                await this.contract.transferFrom(account_three,account_two,3,{from:account_four});
            }catch (e) {
               result = true;
            }    
           
            assert.equal(result,true, "Other than owner able to transfer token");
        })
    });

   
})