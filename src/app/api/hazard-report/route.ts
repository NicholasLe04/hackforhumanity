import { agentGenerateReport } from "@/lib/agents/fetchOpenAI";
import { supabase } from "@/supabase/server";
import { NextRequest } from "next/server";

async function getLocalPosts(current_latitude: number, current_longitude: number, max_distance: number) {
    // Step 1: Fetch the data from Supabase (without the complex distance expression)
    const { data, error } = await supabase.from('posts').select("*");

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }

    // Step 2: Calculate the distance in JavaScript for each row
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 3958.8; // Earth's radius in km
        const X = (lat1 * Math.PI) / 180;
        const Y = (lat2 * Math.PI) / 180;
        const Z = ((lat2 - lat1) * Math.PI) / 180;
        const W = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Z / 2) * Math.sin(Z / 2) +
            Math.cos(X) * Math.cos(Y) * Math.sin(W / 2) * Math.sin(W / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in km
    };

    // Step 3: Add the calculated distance to each data object
    const dataWithDistances = data.map((row) => {
        const distance = calculateDistance(current_latitude, current_longitude, row.latitude, row.longitude);
        if (distance < max_distance) {
            return { ...row, distance: distance };
        }
    });

    // Step 4: Sort the data by distance
    dataWithDistances.sort((a, b) => a.distance - b.distance);

    // Return the sorted data with distances
    return dataWithDistances;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const longitude = parseFloat(formData.get("longitude") as string);
        const latitude = parseFloat(formData.get("latitude") as string);
        const max_distance = parseInt(formData.get("max_distance") as string);

        if (latitude == null || longitude == null || max_distance == null) {
            return new Response("Missing required fields", { status: 400 });
        }

        const localPosts = await getLocalPosts(latitude, longitude, max_distance);
        const hazardReport = await agentGenerateReport(process.env.OPENAI_API_KEY!, localPosts);

        return new Response(JSON.stringify({ hazardReport }), { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}