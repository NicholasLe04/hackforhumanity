
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Reusable function for making OpenAI API requests
async function makeOpenAIRequest(apiKey: string, requestBody: object) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response from OpenAI.";
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    throw error;
  }
}

// Function to build messages for OpenAI request
function createMessages(systemText: string, userText: string, imageBase64?: string) {
  const messages = [{ role: "system", content: systemText }];
  
  if (imageBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userText },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    });
  } else {
    messages.push({ role: "user", content: [{ type: "text", text: userText }] });
  }

  return messages;
}

// filterMe - Filters images for disaster-related content
export async function filterMe(apiKey: string, base64Image: string, context: string) {
  const requestBody = {
    model: "gpt-4-turbo",
    messages: createMessages(
      "Describe the image.",
      `First, state context in form Context: context. Then, state Image description as Image Description: You are to harvest valuable image from this photo. Only filter out information from this photo that is relevant to natural disasters and may pose harmful or risky to humans. For example, you would not mention key information such as puppy, roses, or chairs, but would instead retain information such as downed power lines, fires, and smoke. Do not state additional information if not relevant. You should not elaborate further if you do not detect harmful material. Only elaborate on harmful data. Answers should be incredibly detailed. Further context: ${context}`,
      base64Image
    )
  };

  return makeOpenAIRequest(apiKey, requestBody);
}

// classifyMe - Categorizes urgency of a given context
export async function classifyMe(apiKey: string, context: string) {
  const requestBody = {
    model: "gpt-4o",
    messages: createMessages(
      "Categorize urgency in JSON format. Follow the provided template:",
      `"classify": {
        "urgency": STRING (Red, Yellow, Green) [Red = Most severe, Green = most positive],
        "radius": FLOAT (Units: Miles),
      }`,
      `You should now categorize this information in tiers of urgency, describing how urgent a response would be to this scenario. If the text provided sounds incredibly dangerous, give red. If semi-dangerous, give yellow. If not dangerous at all, give green. Here is the text you should analyze: ${context}`
    )
  };

  return makeOpenAIRequest(apiKey, requestBody);
}

// warnMe - Provides warnings based on urgency level
export async function warnMe(apiKey: string, context: string) {
  const requestBody = {
    model: "gpt-4o",
    messages: createMessages(
      "Provide warnings in JSON format. Follow the provided template:",
      `"warn": {
        "close": STRING (Advised warning for close to threat residents.),
        "far": STRING (Advised warning (if any) for away from threat residents.),
      }`,
      `Please provide adequate warnings for the following context. For the situation, provide appropriate response to it. FOR EXAMPLE: Fire should warrant an evacuation if within a certain radius, and a downed power line should warn people nearby to stay away. CONTEXT: ${context}`
    )
  };

  return makeOpenAIRequest(apiKey, requestBody);
}

// summarizeMe - Provides warnings based on urgency level
export async function summarizeMe(apiKey: string, context: string) {
    const requestBody = {
      model: "gpt-4o",
      messages: createMessages(
        "Provide a single JSON field that is a summary for this provided text. Format it such that the description is like a news caption, do not explicity say this image. Rather, say a title, suchas 'Downed powerline in a residential area.' Follow the provided template:",
        `"summary": {
          "description": STRING (Summarize data in a brief description. Should be similar to a news announcement.)
        }`,
        `CONTEXT: ${context}`
      )
    };
  
    return makeOpenAIRequest(apiKey, requestBody);
  }

  // summarizeMe - Provides warnings based on urgency level
export async function mergeMe(apiKey: string, summary: string, warn: string, classify: string, filter: string) {
    const requestBody = {
      model: "gpt-4o",
      messages: createMessages(
        "Merge the following JSON files into one singular JSON. Do not delete any data.",
        `JSONs: ${summary}, ${warn}, ${classify}, ${filter}`
      )
    };
  
    return makeOpenAIRequest(apiKey, requestBody);
  }

// resizeAndConvertFileToBase64 - Resizes an image and converts it to base64
export function resizeAndConvertFileToBase64(file: File, maxSize: number = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context is not supported"));

        let { width, height } = img;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > width && height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg").split(",")[1]);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}
