import React from "react";
import "./cards.css"; 
const services = [
  {
    step: "01",
    name: "Diagnostics",
    description:
      "State-of-the-art diagnostics to accurately identify vehicle issues.",
  },
  {
    step: "02",
    name: "Repairs",
    description:
      "Engine overhauls to brake replacements, we ensure high-quality work for your vehicle’s longevity.",
  },
  {
    step: "03",
    name: "Maintenance",
    description:
      "Oil changes, tire rotations, and more to enhance performance and prevent future issues.",
  },
];

const FlipCardComponent = () => {
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
                  <div className="absolute inset-0 h-full w-full rounded-xl bg-white [backface-visibility:hidden]">
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <p className="text-xl text-blue-500 mb-2">
                        Step {service.step}
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
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
                      <a href="tel:555-555-5555" className="inline-flex">
                        <button className="my-2 bg-yellow-800 hover:bg-yellow-700 text-white font-bold py-2 px-4 w-auto rounded-full inline-flex items-center">
                          <span>Schedule Service</span>
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
