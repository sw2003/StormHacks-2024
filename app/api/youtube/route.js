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

export async function youtubeTranscript(body) {
    const videoId = body.videoId

    if (!videoId) {
        const e = new Error('missing video id')
        e.name = 'RequestError'

        throw e
    }

    const { duration, transcript } = await fetchTranscript(videoId)

    return { plainTextTranscript: transcript, duration: duration };
}
