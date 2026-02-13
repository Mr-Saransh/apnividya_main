'use client';

import {
    ArrowRight,
    Star,
    UserCircle,
    Cpu,
    Code,
    ShieldCheck,
    Wallet
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CourseGrid() {
    const router = useRouter();

    const courses = [
        {
            title: "Personality Development",
            icon: <UserCircle className="w-16 h-16 text-purple-600" />,
            color: "bg-purple-50",
            desc: "Build confidence and communication skills"
        },
        {
            title: "Computer with AI",
            icon: <Cpu className="w-16 h-16 text-blue-600" />,
            color: "bg-blue-50",
            desc: "Modern computing fundamentals & GenAI"
        },
        {
            title: "Coding Basics",
            icon: <Code className="w-16 h-16 text-indigo-600" />,
            color: "bg-indigo-50",
            desc: "Start your programming journey with logic"
        },
        {
            title: "Cyber Security",
            icon: <ShieldCheck className="w-16 h-16 text-slate-600" />,
            color: "bg-slate-50",
            desc: "Learn to stay safe in the digital world"
        },
        {
            title: "Financial Literacy",
            icon: <Wallet className="w-16 h-16 text-green-600" />,
            color: "bg-green-50",
            desc: "Money management skills for young minds"
        }
    ];

    return (
        <section id="courses" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-2 mb-2 px-4 py-1.5 bg-yellow-50 rounded-full border border-yellow-100">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700 uppercase tracking-wider">Premium Selection</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Specialisation Classes</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">Focus on specific skills with our specialized high-impact modules designed for rapid learning.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <div key={index} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                            {/* Thumbnail Section */}
                            <div className={`w-full h-48 ${course.color} flex items-center justify-center transition-transform duration-500`}>
                                <div className="p-4 bg-white/50 rounded-2xl shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                    {course.icon}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                                <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-grow">
                                    {course.title === "Personality Development" && "Boost confidence, master public speaking, and develop a winning personality."}
                                    {course.title === "Computer with AI" && "Master computing basics and step into the future with practical AI skills."}
                                    {course.title === "Coding Basics" && "Start your journey with Python and logic building blocks for beginners."}
                                    {course.title === "Cyber Security" && "Learn digital safety, ethical hacking basics, and online protection."}
                                    {course.title === "Financial Literacy" && "Understand money, savings, and investments to build a strong foundation."}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
