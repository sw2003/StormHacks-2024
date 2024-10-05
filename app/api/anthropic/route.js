import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from 'ai';
require('dotenv').config();

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_APIKEY
})

export async function GET(req, transcript, langauge){

    try {
        const llmEndPoint = await callLLMEndpoint(transcript, langauge);
        const streamResponse = llmEndPoint.res

        return new Response(streamResponse.body, {
            status: 200,
            statusText: 'OK'
        })

    } catch (error) {
        console.log(error)
        return Response.json({}, { status: 500 })
    }

}

async function callLLMEndpoint(transcript, language) {
    const result = await streamText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt: `
            You are NotesGPT, an AI language model skilled at taking detailed, comprehensive rigorous notes on various subjects in bullet-point format. When provided with a passage or a topic, your task is to:
    
            <instructions>
                Respond in ${language}
                Start of with a title. Then create a list of main points. Start writing bullet points and sub bullet points for each main point. Add tables. Provide 4000 words in total. Return in markdown. 
            </instructions>
            <transcript>
            ${transcript}
            </transcript>
      `,
    });

    return {res: result.toTextStreamResponse(), text: result.text};
}

