

import { useWaitForTransactionReceipt } from 'wagmi'
import { useDisconnect } from 'wagmi'
import { polygon } from '@wagmi/core/chains'
import { config } from "./wagmi"
import { abi } from './abi'
import { mainabi } from "./mainabi";
import { useAccount, useConnect } from "wagmi";
import {
    getAccount,
    switchChain,
    writeContract,
} from "@wagmi/core";
import { flare } from '@wagmi/core/chains'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useEffect, useState } from "react";
import { parseUnits } from 'viem'
import './dailog.css';



const Users = () => {
    const { connectors, connect} = useConnect()
    const { chainId } = getAccount(config);
    const {disconnect } = useDisconnect()
    const [inputValue, setInputValue] = useState('');
    const { isConnected } = useAccount();
    const [investValue, setInvestValue] = useState<any>()
   
    const [finalHash , setFinalHash] = useState<any>()
    const [sender , setsender] = useState<any>()
 
  
  console.log("Deposite Amount")
  const depositAmount = 3;
  const depositAmountS= "3"
  const username="john"
  const id =1
  console.log("TransactionID")

const[submit,setSubmit]=useState(false);
    const [checkconnnection, setcheckconnection] = useState(false)
    const [approve, setApprove] = useState(true);

    const handleApprove = async () => {

   
        try {
            if (chainId != flare.id) {
                await switchChain(config, {
                    chainId: 14,
                });

                setApprove(false)



                const requested = await writeContract(config, {
                    abi :mainabi,
                    address: '0x317322aCf30e411c3E4A596C627E6DcC3C76f277',
                    functionName: 'invest',
                    args: [
                        BigInt(depositAmount),
                    ],
                    
                    value:parseUnits(depositAmountS, 18), 
                })

                console.log(requested)

                if (!requested) {
                    console.log("no value");
                } else {
                    const result = await waitForTransactionReceipt(config, {
                        hash: requested,
                        pollingInterval: 1_000,
                    })
                    setInvestValue(result.status)
                    setFinalHash(result.transactionHash)
                    setsender(result.to)
                  
                }
        
           


            } else {
                setApprove(false)

                const requested = await writeContract(config, {
               
                    address: '0x317322aCf30e411c3E4A596C627E6DcC3C76f277',
                   abi: mainabi,
                    functionName: 'invest',
                    args: [
                        BigInt(depositAmount),
                    ],
                    
                    value: parseUnits(depositAmountS, 18), 
                })

                console.log(requested)

                if (!requested) {
                    console.log("no value");
                } else {
                    const result = await waitForTransactionReceipt(config, {
                        hash: requested,
                        pollingInterval: 1_000,
                    })
                    setInvestValue(result.status)
                    setFinalHash(result.transactionHash)
                    setsender(result.to)
                    console.log(result.status)
                }

        
                }
            
        } catch (error) {

            console.error(error);
            if (error) {
                setApprove(true)
            }

        }
    }

    // const checkConnection = async () => {
    //     setcheckConnect(true)
    //     setcheckconnection(false)
        

    // }

    // const checkWalletConnectDialog = async () => {

    //     setcheckconnection(true)
    //     setcheckConnect(false)
    // }

    const checkCancelDialog = async () => {

        setcheckconnection(true)
        setSubmit(false)
        setApprove(true)
    }

 
    const handleInputChange = (event:any) => {
        setInputValue(event.target.value); // Update the state with the new input value
      };
    




    return (
        <div className="modal-overlay" style={{background:"radial-gradient(#303c8f, #1d2456" , height:"100%" ,width:"100%"}}>
            
            <div className="modal ">
                <div><h3 style={{paddingLeft:"5%"}}>Please Enter the Authentication Code </h3></div>
                <div style={{paddingLeft:"5%"}}>
      <input
      className="inputFiled"
        id="myInput"
        type="text"
        value={inputValue}
        onChange={handleInputChange} // Update state on change
      />
      {
        inputValue=='123456'? (
        <div>
<div >

{!isConnected && checkconnnection == false ?
    (

        <div className="modal-overlay"style={{background:"radial-gradient(#303c8f, #1d2456" , height:"100%" ,width:"100%"}}>
            <div className="modal " style={{height:"100%"}}>

                <div >

                    

                        <div>
                            <div >

                                <div className='' style={{ color: "#539feb", paddingLeft: "20px", paddingBottom: "2%", paddingTop: "2%" }}><h2>Connect</h2></div>
                               
                            </div>
                            <div className='col-12' style={{ paddingBottom: "2%", paddingLeft: "25px", paddingRight: "25px" }}>
                                <div className='col-12' >
                                    <div style={{ paddingBottom: "3%" }}>
                                        {connectors.map((connector) => (

                                            <div style={{ paddingBottom: "8px" }}><button
                                                className="Wallet-button3"
                                                key={connector.uid}
                                                onClick={() => connect({ connector })}
                                                type="button"

                                            >
                                                {connector.name}

                                            </button>
                                            </div>
                                        ))}


                                    </div>
                                </div>
                            </div>
                            <div className='col-6' style={{ paddingBottom: "5px", paddingLeft: "20px", paddingRight: "5px", color: "grey", fontSize: "13px" }}>First time setting up a wallet?</div>
                        </div>

                    

                </div>

            </div>
        </div>
    ) : (
        <div>
        <div className="modal-overlay" style={{background:"radial-gradient(#303c8f, #1d2456",height:"100%"}}>
            
            <div className="modal" style={{alignItems:"center",maxHeight:"80%"}}>
           
            
             
            {
                                    approve == true ?
                                    (  
                                        <div>
                                        <div className=" col-12"style={{display:"flex"}} >
                                            <div>
                                            <button className='close-button ' style={{ paddingTop: "5%", paddingRight: "25px" }} onClick={() => disconnect()}>Disconnect</button> 
                                            </div>
                                        <div className="col-xs-2 col-sm-3 col-md-4 col-lg-6" style={{paddingLeft:"15px",paddingRight:"20%",paddingTop:"10px",paddingBottom:"10px"}} >                            
                                            <h3>Deposite</h3>
                                            <div>Deposite your funds using Crypto. </div>
                                        </div>
                                        
                                        
                                       
                                       
                                        </div>
                                    <div style={{ paddingBottom: "2%", paddingLeft: "20px", paddingRight: "25px",justifyContent:"center"}}>
                                        
                                        

                                        <div  >
                                            

                                            <div> 
                                                
                                             
                                                    
                                                   
                                                   <div  style={{paddingRight:"20px",paddingTop:"10px",paddingBottom:"10px"}} >                            
                                                    <button className=' Wallet-button4' onClick={handleApprove}>Submit Deposite</button>
                                                      </div>
                                                      
                                              
                                                
                                         
                                             </div>

                                       {/* <div >
                                        <div style={{paddingLeft:"15px",paddingRight:"20px",paddingTop:"10px",paddingBottom:"25px"}}>
                                          <button className=' Wallet-button1' onClick={checkWalletConnectDialog}>Cancel</button>
                                             </div>
                   
                   
                                        </div> */}

                                      </div>
                                        
                                        </div>
                                        </div>
                                    ):(
                                        (investValue == "success" ?
                                            (
                                                <div className=" col-12" >
                                                    <div className="col-xs-2 col-sm-3 col-md-4 col-lg-6" style={{ paddingLeft: "15px", paddingRight: "20%", paddingTop: "10px", paddingBottom: "10px" }} >
                                                        <h2>Successfull</h2>
                                                        <div>Your Transaction has been successfully listed on blockchain for furthur details please check the transaction on your wallet.</div>
                                                    </div>

                                                </div>
                                            )
    
                                            :
                                            (( investValue== "reverted" ? (
                                                <div >
                                                    <div style={{ color: "red" }}>Warning</div>
                                                    <p>Your Transaction has been reverted.</p>
                                                </div>
                                            ) : (<div className="loader-container">
                                                <div className="loader"></div>
                                                <p>Loading...</p>
                                            </div>))
                                            )) 
                                  )
                                        
          
}
                            
                    


            </div>


         </div>
         
       
        </div>
     
        

    )

}

</div>

        </div>
        ):(<div>
            { inputValue != '123456' ?
            (<div></div>):( <div><h3>Incorrect Authentication Code</h3></div>)}
       </div>)
      }
</div>
                

            </div>
        </div>
    );
};
export default Users