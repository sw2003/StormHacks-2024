"use client"
import { Button } from '@nextui-org/button';
import { RiRecordCircleLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react"
import { Spinner } from "@nextui-org/spinner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import styles from './styles.module.css'

export default function RecordButton() {
    const [counter, setCounter] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [mediaStream, setMediaStream] = useState(null)
    const [audioChunks, setAudioChunks] = useState(null)
    const [audioUrls, setAudioURLS] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const markdownRef = useRef('')
    const [markdown, setMarkdown] = useState('')

    const toggleRecord = () => { setIsRecording(!isRecording) }
    const timerRef = useRef(counter)

    async function recordAudio() {
        setIsRecording(true)
        const interval = setInterval(() => {
            setCounter((count) => count += 1)
        }, 1000)

        try {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    setMediaRecorder(new MediaRecorder(stream))
                    setMediaStream(stream)

                    let audioChunks = [];

                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        const audioUrl = URL.createObjectURL(audioBlob);


                        setAudioURLS((audioURLS) => {
                            return [...audioURLS, { url: audioUrl, timer: timerRef.current }]
                        })

                        clearInterval(interval)

                        setCounter(0)


                    };

                    // Start recording
                    mediaRecorder.start();
                })
        } catch (error) {
            add('issue with adding audio file')
        }
    }

    useEffect(() => {
        timerRef.current = counter
    }, [counter])

    const generate = async () => {
        if (audioUrls.length > 0) {
            try {
                setIsGenerating(true)

                const audiourls = audioUrls.map((audio) => {
                    return audio.url
                })

                const combined = await combineAudioBlobs(audiourls)
                const res = await fetch('/api/deepgram', {
                    method: "POST",
                    body: combined,
                    headers: {
                        'Content-Type': combined.type,
                    }
                })

                const transcriptJson = await res.json()

                const markdownRes = await fetch('/api/anthropic', {
                    method: "POST",
                    body: JSON.stringify({
                        transcript: transcriptJson.transcript
                    })
                })

                const reader = markdownRes.body.getReader();
                reader.read().then(async function processChunk({ done, value }) {
                    if (done) {
                        setIsGenerating(false)
                    
                        markdownRef.current = '' 

                        console.log('Stream finished.');
                        console.log("note saved")
                        return;
                    }
                    // Process the chunk (e.g., append it to the page)
                    const text = new TextDecoder().decode(value).toString()
                    console.log(text)

                    markdownRef.current = markdownRef.current + text
                    setMarkdown((markdown) => { return markdown + text })

                    return reader.read().then(processChunk);
                });



                setIsGenerating(false)
                if (!res.ok) {
                    throw new Error()
                }

            } catch (error) {

            }
        }
    }


    const toggleRecordOff = () => {
        setIsRecording(false)

        if (mediaRecorder) {
            mediaRecorder.stop()
        }


        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
    }

    useEffect(() => {
        console.log(audioUrls)
    }, [audioUrls])

    return (
        <>
            <div ref={timerRef} className="hidden">0</div>
            {
                !isRecording ?
                    <div className="p-2" onClick={() => { toggleRecord(); recordAudio() }}>
                        <div className="p-2 bg-green-600 rounded-full text-center cursor-pointer flex gap-3 items-center justify-center">
                            <RiRecordCircleLine size={20}></RiRecordCircleLine>
                            <div>
                                Record
                            </div>

                        </div>
                    </div>
                    :
                    <div className='p-2' onClick={() => { toggleRecord(); toggleRecordOff(); }}>
                        <div className='p-2 bg-red-500 rounded-full text-center cursor-pointer flex gap-3 items-center justify-center'>
                            Stop recording
                            {
                                isRecording && <div className="">{secondsToHHMMSS(counter)}</div>
                            }
                        </div>
                    </div>
            }
            <div className='flex gap-2 overflow-x-auto mx-auto max-w-[768px] w-full'>
                {
                    audioUrls.map((audioUrl) => {
                        return <div className='px-8 bg-blue-600 rounded cursor-pointer'>

                            {
                                secondsToHHMMSS(audioUrl.timer)

                            }

                        </div>
                    })
                }
            </div>
            {
                audioUrls.length > 0 && <div className='max-w-[786px] mx-auto h-64 flex justify-center items-center'>

                    <Button color='primary' onPress={generate}>Create Notes
                        {
                            isGenerating && <Spinner color='default' size='sm'></Spinner>
                        }
                    </Button>

                </div>
            }
            {
                markdown !== '' && <div className={`${styles.markdown}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                </div>  
            }





        </>

    )
}

function secondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    return `${hStr}:${mStr}:${sStr}`;
}

async function fetchBlob(url) {
    const response = await fetch(url);
    return response.blob();
}

async function combineAudioBlobs(blobUrls) {
    const blobs = await Promise.all(blobUrls.map(url => fetchBlob(url)));

    const combinedBlob = new Blob(blobs, { type: blobs[0].type });

    return combinedBlob;
}

