"use client"
import { useContext, useEffect, useState } from "react"
import { TrackingContext } from "../Context/tracking"

export default function Navbar(){
    const [state, setState] = useState(false)
    const { currentUser, connectWallet} = useContext(TrackingContext)
    const navigation = [
        { title : "Home", path : "#"},
        { title : "Services", path : "#"},
        { title : "Contact", path : "#"},
        { title : "Erc20", path : "#"},
        { title : "Home", path : "#"},
    ]
    useEffect(()=>{
        document.onclick = (e) =>{
            const  target = e.target;
            if(!target?.closest(".menu-btn")) setState(false)
        }
    })
    return <div className={`bg-white pb-5 md:text-sm ${
        state ? "shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" :""
    }`}>
        <div className="gap-x-14 items-center max-w-screen-xol max-auto px-4 md:flex md:px-8">
            <div className="flex items-center justify-between py-5 md:block">
                <a href="javascript:void(0)" >
                    <img 
                        src={"https://www.floatui.com/logo"}
                        width={120}
                        height={50}
                        alt="Float UI logo"/>
                </a>
                <div className="md:hidden">
                    <button className="menu-btn text-gray-500 hover:text-gray-800" onClick={()=>{
                        setState(!state)
                    }}>
                        {state ? "Image should be here" : "diff img should be here"}
                    </button>
                </div>                
            </div>
            <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
                state ? "block" : "hidden"
            }`}>
                <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                    {navigation.map((item,idx)=>{
                        return (
                            <li key={idx} className="text-gray-700 hover:text-gray-900">
                                {item.title}   
                            </li>
                        )
                    })}
                </ul>
                <div className=" flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
                    {currentUser ? (
                        <p className="flex items-center justify-center gap-x-1 py-2 px-4  font-medium border-y-gray-800 bg-gray-700 hover:bg-gray-900 active:bg-gray-900 rounded-full md:inline-flex"
                        >
                            {currentUser.slice(0,25)}..
                        </p>
                    ): (
                        <button onClick={()=>{
                            connectWallet()
                        }} className="flex items-center justify-center gap-x-1 py-4 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                            {currentUser ? currentUser.balance : "Connect Wallet"}
                        </button>
                    )}
                    
                </div>
            </div>
        </div>
    </div>
}