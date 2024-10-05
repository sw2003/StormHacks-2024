import { Innertube } from 'youtubei.js/web';

const youtube = await Innertube.create({
    lang: 'en',
    location: 'US',
});

function getYouTubeVideoId(url) {
    // Regex pattern to match YouTube video ID
    //var pattern = /[?&]v=([a-zA-Z0-9-]{11})/;
    var pattern = /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([^&\n?#]+)/;;
    
    // Extract video ID using regex
    var match = url.match(pattern);

    // If match found, return the video ID
    if (match && match[1]) {
        return match[1];
    } else {
        // Handle invalid URLs or no match found
        console.error('Invalid YouTube URL');
        return null;
    }
}

const fetchTranscript = async (url) => {
    try {
        const videoId = getYouTubeVideoId(url)

        if (!videoId) {
            throw new Error('Invalid or missing video ID');
        }

        const info = await youtube.getInfo(videoId);
        const basic_info = info.basic_info
        const duration = basic_info.duration

        const transcriptData = await info.getTranscript();

        return { duration: duration, transcript: transcriptData.transcript.content.body.initial_segments.map((segment) => segment.snippet.text + ' ') }
    } catch (error) {
        //console.error('Error fetching transcript:', error);
        throw error;
    }
};

export async function POST(req) {
    try {
        const { videoId } = await req.json();

        if (!videoId) {
            return new Response(JSON.stringify({ error: 'Missing video ID' }), { status: 400 });
        }

        const { duration, transcript } = await fetchTranscript(videoId)

        return new Response(JSON.stringify({
            plainTextTranscript: transcript, 
            duration: duration
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.log(error)
        return Response.json({}, { status: 500 })
    }
}
