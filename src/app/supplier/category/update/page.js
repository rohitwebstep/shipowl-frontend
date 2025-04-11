// src/app/supplier/category/update/page.js
import Update from '@/components/supplier/category/Update';
import React, { Suspense } from 'react';
import HashLoader from "react-spinners/HashLoader";

// Fallback component to show while the Update component is loading
const UpdateFallback = () => (
    <div className="flex justify-center items-center h-96">
        <HashLoader color="orange" />
    </div>
);

export default function UpdatePage() {
    return (
        <Suspense fallback={<UpdateFallback />}>
            <Update />
        </Suspense>
    );
}

// Ensure the page is treated as dynamic
export const dynamic = 'force-dynamic';