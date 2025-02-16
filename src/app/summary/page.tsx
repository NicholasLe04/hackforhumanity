"use client"
import React from 'react'

const generateReport = async () => {
    const data = new FormData();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            data.append("latitude", position.coords.latitude.toFixed(10));
            data.append("longitude", position.coords.longitude.toFixed(10));
        },
        (error) => {
            console.error("Error getting location:", error);
        }
    );
    data.append("max_distance", "10");
    const response = await fetch("/api/hazard-report", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: data
    });
    console.log(response);
}

function Page() {
    return (
        <div>
            <button onClick={generateReport}>
                Generate Report
            </button>
        </div>
    )
}

export default Page
