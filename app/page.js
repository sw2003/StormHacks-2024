"use client";

import Image from "next/image";
import RecordButton from "./components/RecordButton";
import FlipCardComponent from "./flashcards/page";
import React from "react";
import { useState } from "react";


export default function Home() {

  const [nextPage, setNextPage] = useState(false);

  const togglePage = () => {
    setNextPage((prev) => !prev);
  };
 
  return (
    <div className="relative min-h-screen">
      {!nextPage && (
        <div className="flex justify-center items-center h-full">
          <FlipCardComponent />
        </div>
      )}
      {nextPage && (
        <div className="max-w-[768px] mx-auto flex justify-center items-center h-full">
          <RecordButton></RecordButton>
        </div>
      )}

      {!nextPage && 
        <button
          onClick={togglePage}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300"
        >
          Bring me in
        </button>
      }
    </div>
  );
}
