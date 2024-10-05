import OpenAI from "openai";
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.CHATGPT_APIKEY
});

export async function POST(req){

    try {
        const { note } = await req.json();

        if (!note || typeof note !== 'string') {
            return new Response(JSON.stringify({ error: "Invalid input: 'note' must be a string" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

        const audio = await callGptEndpoint(note);
        return new Response(audio.res, {
            headers: {
            "Content-Type": "audio/mpeg",
            "Content-Disposition": "attachment; filename=speech.mp3",
            },
        });

    } catch (error) {
        console.log(error)
        return Response.json({}, { status: 500 })
    }

}

async function callGptEndpoint(note) {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: note,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return {
        res: buffer
    }
}

