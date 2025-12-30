"use client"

import React, {useContext, useEffect, useState} from "react"
import {
    Table,
    Form,
    Service,
    Profile,
    CompleteShipment,
    GetShipment,
    StatShipment
} from "./index"
import { TrackingContext } from "@/Context/tracking"
export default function DAshboard(){
    const { 
        currentUser,
        createShipment,
        getAllShipment,
        completeShipment,
        getShiment,
        startShipment,
        getShipmentCount
    } = useContext(TrackingContext)

    const [ createShipmentModel , setCreateShipmentModal] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const [startModal, setStartModal] = useState(false)
    const [completeModal, setCompleteModal] = useState(false)
    const [getModal, setGetModal] = useState(false)

    const [allShipmentData, setAllShipmentData] = useState()
    useEffect(()=>{
        const fetchCampaigns = async()=>{
            const allData = await getAllShipment()
            setAllShipmentData(allData)
        }
        fetchCampaigns()
    },[])
    
    return <div>
        <Service 
            setOpenProfile={setOpenProfile}
            setCompleteModal={setCompleteModal}
            setGetModel={setGetModal}
        />
        <Table 
            setCreateShipmentModal={setCreateShipmentModal}
            allShipmentData={allShipmentData}
        />
        <Form  
            createShipmentModal={setCreateShipmentModal}
            createShipment={createShipment}
            setCreateShipmentModal={setCreateShipmentModal}
        />
        <Profile 
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
            currentUser={currentUser}
            getShipmentCount={getShipmentCount}
        />
        <CompleteShipment  
            completeModal={completeModal}
            setCompleteModal={setCompleteModal}
            completeShipment={completeShipment}
        />
        <GetShipment    
            getModel={getModal}
            setGetModel={setGetModal}
            getShipment={getShiment}
        />
        <StatShipment
            startModal={startModal}
            setStartModal={setStartModal}
            startShipment={startShipment}
        /> 
    </div>
}