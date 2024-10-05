"use client"
import { Button } from '@nextui-org/button';
import { RiRecordCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react"

export default function RecordButton() {
    const [counter, setCounter] = useState(0)
    const [isRecording, setIsRecording] = useState(false)

    const toggleRecord = () => {
        if (isRecording) {
            setIsRecording(false)
            setCounter(0)
        }
        else {
            setIsRecording(true)

            setInterval(() => {
                setCounter((counter) => {
                    return counter += 1
                })
            }, 1000)
        }
    }

    useEffect(() => {
        console.log(counter)
    }, [counter])

    return (
        <div className="p-2" onClick={toggleRecord}>
            <div className="p-2 bg-red-500 rounded-full text-center cursor-pointer flex gap-3 items-center justify-center">
                <RiRecordCircleLine size={20}></RiRecordCircleLine>
                <div>
                    Record
                </div>
                {
                    isRecording && secondsToHHMMSS(counter)
                }
            </div>
        </div>
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