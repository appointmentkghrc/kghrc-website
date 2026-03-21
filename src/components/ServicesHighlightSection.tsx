"use client";

import { Pill, Brain, Clock, UserRound } from "lucide-react";

export default function ServicesHighlightSection() {
    const services = [
        { title: "ADVANCED CARE", icon: UserRound },
        { title: "RESPITE CARE", icon: Pill },
        { title: "DAILY CARE", icon: Clock },
        { title: "NEUROLOGY CARE", icon: Brain },
    ];

    return (
        <section className="relative py-28 bg-gradient-to-r from-[#021B2F] via-[#052A46] to-[#021B2F] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {services.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <div
                                key={index}
                                className="relative group rounded-2xl p-10 text-center cursor-pointer transition-all duration-500 overflow-hidden bg-[#0c2236] text-white"
                            >
                                {/* Hover Slider Overlay */}
                                <div className="absolute inset-0 bg-primary translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center">

                                    <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 border-2 border-primary text-primary bg-transparent transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                                        <Icon size={32} />
                                    </div>

                                    <h3 className="tracking-wider font-semibold text-lg">
                                        {service.title}
                                    </h3>

                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}