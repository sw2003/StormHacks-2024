import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_APIKEY);

export async function POST(req) {
    const audioBlob = await req.blob()

    try {
        const arrayBuffer = await audioBlob.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            buffer,
            {
                model: "nova-2",
            }
        );

        const transcript = result.results.channels[0].alternatives[0].transcript;

        return Response.json({transcript})

        /*
        return new Response(JSON.stringify({ transcript }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        */
    } catch (error) {
        console.log(error)
        return Response.json({}, { status: 500 })

    }
}
