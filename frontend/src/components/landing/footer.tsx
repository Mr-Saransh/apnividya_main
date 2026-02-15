import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800 font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white rounded-xl p-2 h-14 w-14 flex items-center justify-center">
                                <Image
                                    src="/logo-new.png"
                                    alt="Apni Vidya"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Apni Vidya</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Empowering students with real-world skills through live interactive classes taught by IITians. Building the next generation of leaders.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/share/1CW3KDxSqx/" },
                                { icon: <span className="font-bold text-lg">𝕏</span>, href: "https://x.com/apnividya" },
                                { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/apnividya?igsh=Y3pieGJjcGV5ZGJt" },
                                { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/company/apnividya/" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-800 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-lg shadow-black/20"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            Quick Links <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {['Home', 'Courses', 'About', 'Become a Mentor'].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={link === 'Become a Mentor' ? '/become-mentor' : `#${link.toLowerCase()}`}
                                        className="hover:text-blue-400 transition-colors hover:pl-2 duration-300 block"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            Legal <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {/* NOTE: Updated hrefs from /legal#privacy to /legal/privacy-policy to match existing project structure if needed, or keeping as is if user wants exact copy. 
                               The source code used /legal#privacy. The destination project seemed to use /legal/privacy-policy in the previous file.
                               However, the user said "exactly like given project source code". 
                               I will stick to the source code hrefs: /legal#privacy, etc. 
                            */}
                            <li><Link href="/legal#privacy" className="hover:text-blue-400 transition-colors hover:pl-2 duration-300 block">Privacy Policy</Link></li>
                            <li><Link href="/legal#terms" className="hover:text-blue-400 transition-colors hover:pl-2 duration-300 block">Terms of Service</Link></li>
                            <li><Link href="/legal#refund" className="hover:text-blue-400 transition-colors hover:pl-2 duration-300 block">Refund Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            Contact Us <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                        </h4>
                        <ul className="space-y-5 text-sm">
                            <li className="flex items-start gap-4 group">
                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                </div>
                                <span>Agartala, India</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                                    <Phone className="h-5 w-5 text-blue-500" />
                                </div>
                                <span className="group-hover:text-white transition-colors">+91 60093 96197</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                </div>
                                <span className="group-hover:text-white transition-colors">apnividya.in@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Apni Vidya. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <span className="text-red-500 animate-pulse">❤</span> for Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
