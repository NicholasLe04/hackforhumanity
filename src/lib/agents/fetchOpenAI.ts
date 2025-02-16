import { Post } from "@/supabase/schema";

type MessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

interface Message {
  role: "system" | "user";
  content: MessageContent[];
}


async function openAIComplete(apiKey: string, requestBody: object) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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


async function createMessages(systemText: string, userText: string, file?: File | Blob): Promise<Message[]> {
  const messages: Message[] = [{ role: "system", content: [{ type: "text", text: systemText }] }];
  if (file) {
    const imageBase64 = await fileToBase64Server(file);
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

// agentFilter - Filters images for disaster-related content
export async function agentFilter(apiKey: string, context: string, image: File | Blob) {
  console.log(context);
  const requestBody = {
    model: "gpt-4-turbo",
    messages: await createMessages(
      "You are an image analyst and your job is analyze and describe images.",
      `First, state context in form Context: context. Then, state Image description as Image Description: You are to harvest valuable image from this photo. Only filter out information from this photo that is relevant to dangers, threats, dangerous people, or disasters and may pose harmful or risky to humans. Explicitly list off the dangers in your string response. For example, you would not mention key information such as puppy, roses, or chairs, but would instead retain information such as downed power lines, fires, dangerous people, criminals, illegal activity that is a safety issue to people, harassment, and smoke. Do not state additional information if not relevant. You should not elaborate further if you do not detect harmful material or people. Only elaborate on potentially harmful data. Answers should be incredibly detailed. If what you analyze seems to be not a risk to anybody (dark room for eye strain), please do not deem it a hazard. A hazard should severely post a risk to human life and may cause physical bodily harm that would require medical treatment or mental treatment.\n CONTEXT: ${context}`,
      image
    )
  };

  return openAIComplete(apiKey, requestBody);
}

// agentClassify - Categorizes urgency of a given context
export async function agentClassify(apiKey: string, context: string) {
  const requestBody = {
    model: "gpt-4o",
    messages: await createMessages(
      `Categorize urgency in JSON format. Follow the provided template: \n
      "classify": {
        "urgency": STRING (Red, Orange, Yellow) [Red = Most severe, Yellow = least severe],
        "radius": FLOAT (Units: Miles),
      }`,
      `You should now categorize this information in tiers of urgency, describing how urgent a response would be to this scenario. If the text provided sounds incredibly dangerous, give red. If semi-dangerous, give Orange. If little to no danger, give Yellow. Here is the text you should analyze: ${context}`
    )
  };

  return openAIComplete(apiKey, requestBody);
}

// agentGenerateWarnings - Provides warnings based on urgency level
export async function agentGenerateWarnings(apiKey: string, context: string) {
  const requestBody = {
    model: "gpt-4o",
    messages: await createMessages(
      `Provide warnings in JSON format. Follow the provided template: \n
      "warn": {
        "close": STRING (Advised warning for close to threat residents.),
        "far": STRING (Advised warning (if any) for away from threat residents.),
      }`,
      `Please provide adequate warnings for the following context. For the situation, provide appropriate response to it. FOR EXAMPLE: Fire should warrant an evacuation if within a certain radius, and a downed power line should warn people nearby to stay away. CONTEXT: ${context}`
    )
  };

  return openAIComplete(apiKey, requestBody);
}

// agentSummarize - Provides warnings based on urgency level
export async function agentSummarize(apiKey: string, context: string) {
  const requestBody = {
    model: "gpt-4o",
    messages: await createMessages(
      `Provide a single JSON field that is a summary for this provided text. Forat like so: do not explicity say this image. Make it very short and concise, being straight to the point and excplicitly mentioning what the threat is. Say a title suchas 'Downed powerline in a residential area.' Follow the provided template: \n
      "summary": {
        "description": STRING (Summarize data in a brief description.)
      }`,
      `CONTEXT: ${context}`
    ),
    max_tokens: 50
  };

  return openAIComplete(apiKey, requestBody);
}

// agentMergeJSON - Merges JSON objects
export async function agentMergeJSON(apiKey: string, summary: string, warn: string, classify: string) {
  const requestBody = {
    model: "gpt-4o",
    messages: await createMessages(
      "Merge the following JSON files into one singular JSON. Do not delete any data.",
      `JSONs: ${summary}, ${warn}, ${classify}`
    )
  };

  return openAIComplete(apiKey, requestBody);
}


export async function agentGenerateReport(apiKey: string, localPosts: Post[]) {
  const requestBody = {
    model: "gpt-4o",
    messages: await createMessages(
      "You are a professional city hazard analyst. Your job is look at the local hazard reports in your city and generate a full detailed hazard report for your city. It should be broken up into sections with professional language.",
      `Recent Hazards and Reports in your city: ${JSON.stringify(localPosts)}`
    )
  };

  return openAIComplete(apiKey, requestBody);
}

// Server-side function to convert File/Blob to base64
async function fileToBase64Server(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}