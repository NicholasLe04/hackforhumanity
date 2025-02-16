"use client";
  
  import { useState } from "react";
  import { filterMe, classifyMe, warnMe, summarizeMe, mergeMe, resizeAndConvertFileToBase64 } from "./fetchOpenAI";
  
  export default function ImageUploader({ apiKey }: { apiKey: string }) {
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [context, setContext] = useState<string>("");
    const [base64Image, setBase64Image] = useState<string | null>(null);
  
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      setText("Image ready for analysis.");
      setLoading(false);
  
      try {
        // Resize & Convert the image
        const base64 = await resizeAndConvertFileToBase64(file);
  
        // Show preview image
        setPreviewImage(`data:image/jpeg;base64,${base64}`);
        setBase64Image(base64);
      } catch (error) {
        setText("Error processing image.");
      }
    };
  
    const handleSend = async () => {
      if (!base64Image) return;
      setText("Processing image...");
      setLoading(true);
  
      try {
        setText("Classifying...");
        const filtered_response = await filterMe(apiKey, base64Image, context);
        const warn_response = await warnMe(apiKey, filtered_response);
        const class_response = await classifyMe(apiKey, filtered_response);
        const summary_response = await summarizeMe(apiKey, filtered_response);
        const merge_response = await mergeMe(apiKey, summary_response, warn_response, class_response, filtered_response);
        setText(merge_response);
      } catch (error) {
        setText("Error analyzing image.");
      }
  
      setLoading(false);
    };
  
    return (
      <div className="flex flex-col items-center gap-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <textarea
          placeholder="Enter context for analysis"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="border rounded p-2 w-full"
        />
        {previewImage && <img src={previewImage} alt="Uploaded Preview" className="uploaded-image" />}
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        {loading ? <p className="text-lg font-bold">Loading...</p> : <p className="text-lg">{text ?? "Upload an image for analysis."}</p>}
      </div>
    );
  }
