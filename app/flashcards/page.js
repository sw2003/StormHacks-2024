import React from "react";
import "./cards.css"; 
const services = [
  {
    step: "01",
    name: "Deepgram",
    link: "https://deepgram.com/",
    description:
      "Speech Recognition — AI models to transcribe, summarize speech. Converts audio file to text transcripts",
  },
  {
    step: "02",
    name: "Anthropic",
    link: "https://www.anthropic.com/",
    description:
      "Claude - family of LLMs developed by Anthropic. Generate markdown notes from Deepgram transcripts",
  },
  {
    step: "03",
    name: "Openai",
    link: "https://platform.openai.com/docs/guides/text-to-speech",
    description:
      "TTS (text-to-speech) model - an audio API that provides a speech endpoint. Reads out generated notes",
  },
];

export const FlipCardComponent = () => {
  return (
    <section className="py-16 mx-auto sm:py-20">
      <div className="mx-auto flex justify-center object-center px-4 py-16 sm:py-24 lg:max-w-7xl">
        <div className="flex justify-center object-center flex-col gap-12 sm:gap-16">
          <div className="mx-auto grid gap-12 sm:gap-16 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="group h-96 w-96 [perspective:1000px]"
              >
                <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face */}
                  <div className="absolute inset-0 h-full w-full rounded-xl bg-black/50 [backface-visibility:hidden]">
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <p className="text-xl text-blue-500 mb-2">
                        Step {service.step}
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {service.name}
                      </p>
                    </div>
                  </div>
                  {/* Back Face */}
                  <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="flex min-h-full flex-col items-center justify-center">
                      <h2 className="text-2xl font-bold mb-4">
                        {service.name}
                      </h2>
                      <p className="text-lg text-pretty text-center mb-4">
                        {service.description}
                      </p>
                      <a href={service.link} className="inline-flex">
                        <button className="my-2 bg-yellow-800 hover:bg-yellow-700 text-white font-bold py-2 px-4 w-auto rounded-full inline-flex items-center">
                          <span>Details</span>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlipCardComponent;
