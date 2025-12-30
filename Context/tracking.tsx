"use client"
import React,{useState, useEffect} from "react";
import Web3Model from "web3modal"
import { ethers } from "ethers"



//INTERNAL IMPORTS
import tracking from "./Tracking.json"
import { network } from "hardhat";
const ContractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const ContractABI = tracking.abi

// -- FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider :any) =>{
    return new ethers.Contract
    (ContractAddress, ContractABI, signerOrProvider)
}

interface TrackingContextType {
  connectWallet: () => Promise<string | undefined>;
  createShipment: (items: any) => Promise<void>;
  getAllShipment: () => Promise<any>;
  completeShipment: (completeShip: any) => Promise<String | undefined>;
  getShiment: (index: any) => Promise<any>;
  startShipment: (getProduct: any) => Promise<String | undefined>;
  getShimentCount: () => Promise<any>;
  DappName: string;
  currentUser: string;
}
export const TrackingContext = React.createContext<TrackingContextType | undefined>(undefined)

export const TrackingProvider = ({children}:any) =>{
    //STATE VARIABLE
    const DappName = "Product Tracking Dapp"
    const [currentUser , setCurrentUser ] = useState("")

    const createShipment = async (items:any)=>{
        console.log(items);
        const {receiver, pickupTime, distance, price} = items;
        try{
            const web3Modal = new Web3Model()
            const connection = await web3Modal.connect()
            const provider = new ethers.AnkrProvider()._getProvider(connection)
            const signer = await new ethers.AnkrProvider().getSigner()
            const contract = fetchContract(signer)
            const createItem = await contract.createShipment(
                receiver,
                new Date(pickupTime).getDate(),
                distance,
                ethers.parseUnits(price,18),
                {
                    value : ethers.parseUnits(price, 18),
                }
            )
            await createItem.wait()
            console.log(createItem)
        }catch(e){
            console.log("something happens wrong", e)
        }
    }


    const getAllShipment = async ()=>{
        try{
            const provider = new ethers.AlchemyProvider()
            const contract = fetchContract(provider)

            const shipments = await contract.getAllTransactions();
            const allShipments = shipments.map((shipment:any)=>({
                sender : shipment.sender,
                receiver : shipment.receiver,
                price : ethers.formatEther(shipment.price.toString()),
                pickupTime : shipment.pickupTime.toNumber(),
                deliveryTime : shipment.deliveryTime.toNumber(),
                distance : shipment.distance.toNumber(),
                isPaid : shipment.isPaid,
                status : shipment.status,
            }))
            return allShipments;
        }catch(e){
            console.error("error while getting all the shipment")
        }
    }

    const getShimentCount = async ()=>{
        try{
            // if user don't have any wallet
            if(!window.ethereum)return "Install MetaMask";
            // if they have then pop 
            const account = await window.ethereum.requests({
                method : "eth_accounts",
            })
            const provider = new ethers.AlchemyProvider()
            const contract = fetchContract(provider)
            const shipmentsCount = await contract.getShipmentCount(account[0]);
            return shipmentsCount;
        }catch(e){
            console.error("error while, getting shipment count")
        }
    }

    const completeShipment = async (completeShip:any):Promise<String | undefined>=>{
        console.log(completeShip)
        const { receiver, index } = completeShip
        try{
            if(!window.ethereum) return "Install MetaMask"
            const account = await window.ethereum.requests({
                method : "eth_accounts"
            })
            const web3Modal = new Web3Model()
            const connection = await web3Modal.connect()
            const provider = new ethers.AnkrProvider()._getProvider(connection)

            const signer = new ethers.AnkrProvider().getSigner()
            const contract = fetchContract(signer)
            
            const transaction = await contract.completeShipment(
                account[0],
                receiver,
                index,
                {
                    gasLimit : 300000,
                }
            )
            transaction.wait()
            console.log(transaction)
        }catch(e){
            console.error("wrong compeleteShiment", e)
        }
    }

    const getShiment = async (index:any)=>{
        console.log(index *1)
        try{
            if(!window.ethereum)return "Insall MetaMask"
            const account =await window.ethereum.requests({
                method : "eth_accounts",
            })

            const provider = new ethers.PocketProvider()
            const contract = fetchContract(provider)
            const shipment = await contract.getSipment(account[0], index * 1)

            const SingleShiment = {
                sender : shipment[0],
                receiver : shipment[1],
                pickUpTime : shipment[2].toNumber(),
                delvieryTime : shipment[3].toNumber(),
                distance : shipment[4].toNumber(),
                price : ethers.formatEther(shipment[5].toString()),
                status : shipment[6],
                isPaid : shipment[7]
            }
            return SingleShiment
        }catch(e){
            console.log("Sorry no shipment")
        }
    } 

    const startShipment = async (getProduct:any): Promise<String | undefined>=>{
        const { receiver, index } = getProduct()

        try{
            if(!window.ethereum){
                return "Install MetaMask"
            }
            const account = await window.ethereum.requests({
                method : "eth_account"
            })
            const web3Modal = new Web3Model()
            const connection = await web3Modal.connect()
            const provider = new ethers.AnkrProvider()._getProvider(connection)
            const signer = new ethers.AnkrProvider().getSigner();
            const contract = fetchContract(signer);
            const shipment = await contract.startShipment(
                account[0],
                receiver[0],
                index *1
            )
            shipment.wait()
            console.log(shipment)
        }catch(e){
            console.log("Sorry not shipment ", e)
        }
    }

    // check wallet connection 
    const checkIfWalletConnected = async()=>{
        try{
            if(!window.ethereum)return "Install MetaMask"

            const account = await window.ethereum.requests({
                method : "eth_accounts",
            })
            if(!account.length){
                setCurrentUser(account[0])
            }else{
                return "NO account"
            }
        }catch(e){
            return "not connected"
        }
    }

    const connectWallet = async ()=>{
        try{
            if(!window.ethereum)return "Install MetaMask"
            const account = await window.ethereum.request({
                method : "eth_requestAccount",
            })
            setCurrentUser(account[0])
        }catch(e){
            return "Something went wrong"
        }
    }
        useEffect(()=>{
            checkIfWalletConnected()
        },[])
        return (
            <TrackingContext.Provider
                value={{
                    connectWallet,
                    createShipment,
                    getAllShipment,
                    completeShipment,
                    getShiment,
                    startShipment,
                    getShimentCount,
                    DappName,
                    currentUser,
                }}
            >
                {children}
            </TrackingContext.Provider>
    )
}
