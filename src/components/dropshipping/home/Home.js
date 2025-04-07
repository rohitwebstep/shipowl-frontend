"use client"


import { useDropshipper } from '../middleware/DropshipperMiddleWareContext'
import Banner from './Banner'
import CategorySection from './CatogorySection'
import NewlyLaunched from './NewlyLaunched'
import PotentialHeros from './PotentialHeros'
import React, { useEffect } from 'react'

const Home = () => {
    const { verifyDropShipperAuth } = useDropshipper();
    useEffect(() => {
        verifyDropShipperAuth();
    }, [verifyDropShipperAuth]);
    return (
        <>
            <Banner />
            <CategorySection />
            <NewlyLaunched />
            <PotentialHeros />
        </>

    )
}

export default Home