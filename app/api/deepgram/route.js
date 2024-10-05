import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export async function POST(req) {
    const audioBlob = await req.blob()

    try {
        const arrayBuffer = await audioBlob.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const result = await deepgram.listen.prerecorded.transcribeFile(
            {
                buffer: buffer,
                mimetype: audio/mpeg, 
            },
            {
                model: "nova-2",
                punctuate: true,
            }
        );

        const transcript = result.results.channels[0].alternatives[0].transcript;

        return new Response(JSON.stringify({ transcript }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
    } catch (error) {
        console.log(error)
        await logError(error, 500)
        return Response.json({}, { status: 500 })

    }
}
