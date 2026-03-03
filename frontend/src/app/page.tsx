import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/landing/navbar';
import FeatureSlider from '@/components/landing/landing-slides';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-white dark:from-[#050B18] dark:via-[#0a1527] dark:to-[#050B18] flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content — centered single viewport */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4 pt-24 gap-6 overflow-hidden">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100">
            <Image src="/logo-new.png" alt="Apni Vidya" width={44} height={44} className="object-contain" priority unoptimized />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Apni Vidya</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live learning. Real results.</p>
        </div>

        {/* Feature Slideshow Block */}
        <div className="w-full max-w-sm">
          <FeatureSlider />
        </div>

        {/* Get Started CTA */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all"
          >
            Get Started →
          </Link>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </main>

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-[120px] opacity-50 -z-0" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 dark:bg-indigo-500/10 rounded-full blur-[100px] opacity-40 -z-0" />
    </div>
  );
}
