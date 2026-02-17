import React from 'react';
import { Mail, Phone, CheckCircle } from 'lucide-react';

export default function BecomeMentorPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Become a Mentor at <span className="text-blue-600">Apni Vidya</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Join our team of expert IITian guides and help shape the future of students with real-world skills.
                    </p>
                </div>

                {/* Requirements/Benefits */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Why teach with us?</h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Flexible Schedule</h3>
                                <p className="text-slate-600">Teach at your own convenience and availability.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Global Impact</h3>
                                <p className="text-slate-600">Reach students from all different backgrounds.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Earn Well</h3>
                                <p className="text-slate-600">Competitive compensation for your valuable time and expertise.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Community</h3>
                                <p className="text-slate-600">Be part of an exclusive network of IITian educators.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Process */}
                <div className="bg-blue-600 rounded-3xl shadow-xl p-8 md:p-12 text-white">
                    <h2 className="text-2xl font-bold mb-8 text-center">How to Apply</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                                We keep our hiring process simple and personal. To apply, simply reach out to us directly via email or phone.
                                We would love to discuss your expertise and how you can contribute.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <Phone className="h-6 w-6 text-yellow-300" />
                                    <div>
                                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Call or WhatsApp</p>
                                        <p className="text-xl font-bold">+91 60093 96197</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <Mail className="h-6 w-6 text-yellow-300" />
                                    <div>
                                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Send your Resume</p>
                                        <p className="text-xl font-bold">apnividya.in@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative hidden md:block">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
                            <div className="border border-blue-400 rounded-2xl p-6 bg-blue-500/30 backdrop-blur-md">
                                <h3 className="font-bold text-lg mb-4">Process Overview</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-600 font-bold">1</span>
                                        <span>Contact Us</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-600 font-bold">2</span>
                                        <span>Initial Screening</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-600 font-bold">3</span>
                                        <span>Demo Class</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-600 font-bold">4</span>
                                        <span>Onboarding</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
