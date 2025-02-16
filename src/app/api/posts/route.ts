"use server"
import { filterMe, classifyMe, warnMe, summarizeMe, mergeMe } from '../../../lib/agents/fetchOpenAI';
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
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

    if (!image) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Handle ai agent logic
    const filtered_response = await filterMe(OPENAI_API_KEY,`${title} ${description}`,image)
    const class_response = await classifyMe(OPENAI_API_KEY,filtered_response)
    const warn_response = await warnMe(OPENAI_API_KEY,filtered_response)
    const summary_response = await summarizeMe(OPENAI_API_KEY,filtered_response)
    const merge_response = await mergeMe(OPENAI_API_KEY,summary_response,warn_response,class_response)

    const analysis_json = JSON.parse(merge_response.split('\n').slice(1, -1).join('\n'));

    // DONT ADD IF NOT THREAT
    if (analysis_json.classify.urgency === "Green") {
      return NextResponse.json({ message: "No Danger Detected" }, { status: 200 });
    }

    // Insert post data into Supabase
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: author_id,
        title: title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description,
        summary: analysis_json.summary.description,
        close_warning: analysis_json.warn.close,
        far_warning: analysis_json.warn.far,
        urgency: analysis_json.classify.urgency,
        radius: analysis_json.classify.radius
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