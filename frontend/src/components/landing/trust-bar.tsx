import { Radio, VideoOff, GraduationCap } from 'lucide-react';

export default function TrustBar() {
    const trustItems = [
        {
            icon: <Radio className="h-8 w-8 text-blue-100" />,
            title: "100% Live Classes",
            desc: "Real-time interaction with mentors"
        },
        {
            icon: <VideoOff className="h-8 w-8 text-blue-100" />,
            title: "No Recorded Videos",
            desc: "Live learning, no boring lectures"
        },
        {
            icon: <GraduationCap className="h-8 w-8 text-blue-100" />,
            title: "Taught by IITians",
            desc: "Learn from the best minds"
        }
    ];

    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/5 opacity-50 blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
                    {trustItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-default group">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-0.5 tracking-tight">{item.title}</h3>
                                <p className="text-blue-100 text-sm font-medium opacity-90">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
