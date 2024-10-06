'use client'
import FlipCardComponent from "../flashcards/page"
import { useRouter } from "next/navigation"
import { Button } from "@nextui-org/react"
export default function Page(){
    const router = useRouter()

    const navigateToMain = ()=>{
        router.push('/')
    }
    return (
        <>
            <FlipCardComponent></FlipCardComponent>

            <div className="flex justify-center absolute w-screen bottom-10">
                <Button color="primary" onPress={navigateToMain}>Get Started!</Button>
            </div>
        </>
    )
}