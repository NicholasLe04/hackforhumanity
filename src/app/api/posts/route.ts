"use server"
import { classifyMe, filterMe, warnMe, summarizeMe, mergeMe, resizeAndConvertFileToBase64 } from '@/lib/agents/fetchOpenAI';
import { supabase } from '@/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const author_id = formData.get("author_id") as string;
    const title = formData.get("title") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;
    const base64 = await resizeAndConvertFileToBase64(image);
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

    if (!image) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Handle ai agent logic
    const filtered_response = await filterMe(OPENAI_API_KEY,description,base64)
    const class_response = await classifyMe(OPENAI_API_KEY,filtered_response)
    const warn_response = await warnMe(OPENAI_API_KEY,filtered_response)
    const summary_response = await summarizeMe(OPENAI_API_KEY,filtered_response)
    const merge_response = await mergeMe(OPENAI_API_KEY,summary_response,warn_response,class_response,filtered_response)

    // Insert post data into Supabase
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: author_id,
        title: title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description
      })
      .select();

    // Convert file to Buffer for upload
    const fileBuffer = Buffer.from(await image.arrayBuffer());
    const filePath = `/${postData![0].id}` as string;

    // Upload image to Supabase storage
    const { data: imageData, error: imageError } = await supabase.storage
      .from("images")
      .upload(filePath, fileBuffer, {
        contentType: image.type,
      });

    if (imageError) throw imageError;

    if (postError) throw postError;

    return NextResponse.json({ message: "Document added successfully", postData, imageData }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("auth")) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    } else {
      console.error(error);
      return NextResponse.json({ error: "Failed to add document" }, { status: 500 });
    }
  }
}