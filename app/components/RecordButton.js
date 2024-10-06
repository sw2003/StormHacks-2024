"use client"
import { Button } from '@nextui-org/button';
import {Select, SelectItem} from "@nextui-org/react";
import { RiRecordCircleLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react"
import { Spinner } from "@nextui-org/spinner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import styles from './styles.module.css'
import { FaFileAudio } from "react-icons/fa6";
import { BsFillSendArrowDownFill } from "react-icons/bs";
import { GiSpeaker } from "react-icons/gi";
import { useRouter } from "next/navigation"

export default function RecordButton() {
    const [counter, setCounter] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [mediaStream, setMediaStream] = useState(null)
    const [audioUrls, setAudioURLS] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const markdownRef = useRef('')
    const [markdown, setMarkdown] = useState('')
    const containerRef = useRef(null)
    const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState("English")
    const router = useRouter()
    

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
                        setIsRecording(false)

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
                    scrollToBottom()
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

    const readNotes = async () => {
        setIsGeneratingVoice(true)

        let markdownvariable = markdown.substring(0, 1000)
        const speech = await fetch('/api/openai', {
            method: "POST",
            body: JSON.stringify({
                note: markdownvariable
            })
        })

        setIsGeneratingVoice(false)
        
        const blob = await speech.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.play()

    }

    const handleLanguageChange = (selectedKeys) => {
        const selected = selectedKeys[0];
        setSelectedLanguage(selected);
        console.log("Selected language:", selected); 
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

   

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;  // Scroll to the top
        }
    }

    const reset = ()=>{
        setMarkdown('')
        setIsRecording(false)
        setIsGenerating(false) 
        setAudioURLS([])
        setIsGeneratingVoice(false)

    }

    const [languages, setLanguages] = useState([
        {key: "english", item: "English"},
        {key: "french", item: "French"},
        {key: "spanish", item: "Spanish"},
        {key: "russian", item: "Russian"},
        {key: "chinese", item: "Chinese"},
        {key: "korean", item: "Korean"},
    ])

    return (
        <>
            <div ref={timerRef} className="hidden">0</div>

            {
                markdown === '' && <div className='relative'>
                    <div className='absolute h-80 flex justify-center items-center w-full text-6xl'>
                        LectureSync
                    </div>
                      <div className=' h-screen flex justify-center items-center flex-col'>
                    {
                        !isRecording ?
                            <div className='max-w-[480px] w-full'>
                                <div className="p-2 max-w-[480px] w-full" onClick={() => { toggleRecord(); recordAudio()}}>
                                    <div className="p-2 bg-green-600 rounded-full text-center cursor-pointer flex gap-3 items-center justify-center">
                                        <RiRecordCircleLine size={20}></RiRecordCircleLine>
                                        <div>
                                            Record
                                        </div>

                                    </div>
                                </div>



                            </div>


                            :
                            <div className='p-2 max-w-[480px] w-full' onClick={() => { toggleRecord(); toggleRecordOff(); }}>
                                <div className='p-2 bg-red-500 rounded-full text-center cursor-pointer flex gap-3 items-center justify-center'>
                                    Stop recording
                                    {
                                        isRecording && <div className="">{secondsToHHMMSS(counter)}</div>
                                    }
                                </div>
                            </div>
                    }
                    <div className='flex gap-2 overflow-x-auto max-w-[480px] w-full px-4'>



                        {
                            audioUrls.map((audioUrl) => {
                                return <div className='px-4 bg-neutral-800 rounded cursor-pointer flex gap-2 items-center'>
                                    <FaFileAudio size={15}></FaFileAudio>


                                    {
                                        secondsToHHMMSS(audioUrl.timer)

                                    }

                                </div>
                            })
                        }

                    </div>
                    {
                        audioUrls.length > 0 && 
                        (
                            <div>
                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-3">
                                <Select 
                                label="Select a language" 
                                className="max-w-xs" 
                                defaultSelectedKeys={["english"]}
                                selectedKeys={[selectedLanguage]}
                                onSelectionChange={handleLanguageChange}
                                >
                                {languages.map((language) => (
                                    <SelectItem key={language.key}>
                                    {language.item}
                                    </SelectItem>
                                ))}
                                </Select>
                            </div>
                            <div className='flex gap-2 mt-3 cursor-pointer px-4 py-2 bg-blue-600 rounded-full' onClick={generate}>
                                <BsFillSendArrowDownFill size={25}></BsFillSendArrowDownFill>
                                Create Note

                            </div>
                        </div>
                        )
                    }

                </div>

                </div>
                
              
            }
       

            <div className={`${markdown === '' && 'hidden'} h-[92vh] overflow-y-auto relative`} ref={containerRef}>
               
                {
                    markdown !== '' && <div className='max-w-[768px] p-2 mx-auto' >
                        <div className={`${styles.markdown}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                        </div>
                    </div>

                }
            </div>
            {
                markdown !== '' && <div className={`${markdown === '' && 'hidden'} h-[8vh] flex gap-4 justify-center p-2`}>
                    <div className='px-4 py-1 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer gap-2' onClick={()=>{scrollToTop(); readNotes()}}>
                        Read aloud
                        <GiSpeaker size={15}></GiSpeaker>
                        {
                            isGeneratingVoice && <Spinner color="default" size='15'></Spinner>
                        }
                    </div>
                    <div className='px-4 py-1 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer' onClick={reset}>Create Another Note</div>
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

