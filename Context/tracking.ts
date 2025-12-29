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
export const TrackingContext = React.createContext('Tracking')

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

const completeShipment = async (completeShip:any)=>{

}