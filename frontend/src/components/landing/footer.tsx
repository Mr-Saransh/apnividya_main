import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo-new.png"
                                alt="Apni Vidya"
                                width={40}
                                height={40}
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                            <span className="text-2xl font-black text-white tracking-tight">Apni Vidya</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed font-medium">
                            Empowering the next generation with real-world skills taught by industry experts from IITs.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-sm">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'Courses', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:w-3 transition-all"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-sm">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
                                <li key={item}>
                                    <Link href={`/legal/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-600 transition-all"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-sm">Contact Us</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-slate-800 rounded-xl text-blue-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Email</p>
                                    <p className="text-white font-bold">hello@apnividya.in</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-slate-800 rounded-xl text-blue-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Location</p>
                                    <p className="text-white font-bold">IIT Delhi, New Delhi</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        © {new Date().getFullYear()} Apni Vidya. All rights reserved. Made with ❤️ for the future.
                    </p>
                </div>
            </div>
        </footer>
    );
}
