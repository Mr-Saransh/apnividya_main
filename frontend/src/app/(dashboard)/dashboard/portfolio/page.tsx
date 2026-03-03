'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Download, Share2, Bot, Award, Plus } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

interface DashboardStats {
  karmaPoints: number; globalRank: number; percentile: number;
  dayStreak: number; totalEnrollments: number; lessonsCompleted: number;
  totalPosts: number; totalComments: number;
  continueLearning: { courseId: string; title: string; progress: number }[];
  achievements: { id: number; name: string; icon: string; color: string }[];
}

const tabItems = ['Overview', 'Academic', 'Skills', 'Competitions', 'Projects'];
const achievementIcons: Record<string, string> = { trophy: '🏆', star: '⭐', crown: '👑', book: '📚', help: '🙋', heart: '❤️', calendar: '📅' };

export default function PortfolioPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => { api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  const fullName = user?.fullName || 'Student';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const karma = stats?.karmaPoints ?? 0;
  const rank = stats?.globalRank ?? 4700;
  const percentile = stats?.percentile ?? 15;
  const streak = stats?.dayStreak ?? 0;
  const enrollments = stats?.totalEnrollments ?? 0;
  const lessons = stats?.lessonsCompleted ?? 0;
  const posts = stats?.totalPosts ?? 0;
  const achievements = stats?.achievements ?? [];

  const competitions = Math.max(1, Math.floor(karma / 50));
  const certificates = Math.max(0, Math.floor(enrollments / 2));
  const projects = Math.max(0, Math.floor(posts / 3));
  const academicScore = Math.min(99, 55 + Math.floor(karma / 20) + Math.floor(lessons * 2));
  const skillLevel = karma >= 1000 ? 'Expert' : karma >= 500 ? 'Advanced' : karma >= 200 ? 'Intermediate' : 'Beginner';
  const growthRate = karma >= 300 ? 'High' : karma >= 100 ? 'Medium' : 'Growing';

  const radarData = [
    { subject: 'Maths', score: Math.min(99, 65 + Math.floor(karma / 30)) },
    { subject: 'Science', score: Math.min(99, 70 + Math.floor(karma / 25)) },
    { subject: 'English', score: Math.min(99, 60 + Math.floor(karma / 35)) },
    { subject: 'History', score: Math.min(99, 68 + Math.floor(karma / 32)) },
    { subject: 'Coding', score: Math.min(99, 72 + Math.floor(karma / 20)) },
  ];
  const barData = [
    { month: 'Jan', score: Math.max(45, 55 + Math.floor(karma / 60)) },
    { month: 'Feb', score: Math.max(50, 60 + Math.floor(karma / 55)) },
    { month: 'Mar', score: Math.max(55, 65 + Math.floor(karma / 50)) },
    { month: 'Apr', score: Math.max(60, 68 + Math.floor(karma / 45)) },
    { month: 'May', score: Math.max(62, 72 + Math.floor(karma / 40)) },
    { month: 'Jun', score: Math.min(99, 76 + Math.floor(karma / 35)) },
  ];

  const topSkills = [
    karma >= 500 ? 'Python' : 'HTML',
    karma >= 300 ? 'AI Fundamentals' : 'Basics',
    enrollments >= 2 ? 'Public Speaking' : 'Communication',
    streak >= 7 ? 'Leadership' : 'Time Management',
  ];
  const skillColors = ['#00D4B8', '#3D7EFF', '#B47EFF', '#f59e0b'];

  const trophies = [
    ...(karma >= 100 ? [{ name: '100 Karma', emoji: '🥉' }] : []),
    ...(karma >= 500 ? [{ name: 'Karma Master', emoji: '🥈' }] : []),
    ...(karma >= 1000 ? [{ name: 'Legend', emoji: '🥇' }] : []),
    ...(streak >= 7 ? [{ name: '7-Day Streak', emoji: '🔥' }] : []),
    ...(enrollments >= 3 ? [{ name: 'Multi-Learner', emoji: '📚' }] : []),
  ];

  const certList = stats?.continueLearning?.filter(e => e.progress >= 80).slice(0, 3) ?? [];

  const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Portfolio Navigation */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border px-6 lg:px-10 py-4 flex gap-4 overflow-x-auto">
        {tabItems.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              activeTab === t ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:text-foreground'
            }`}>{t}</button>
        ))}
      </div>

      <div className="p-6 lg:p-10">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-6 justify-between items-start">
            <div className="flex gap-6 items-center flex-wrap">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-extrabold text-white border-4 border-background shadow-lg shrink-0">
                {initials}
              </div>
              <div>
                <div className="inline-block bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-2">🥇 National Rank #{rank}</div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-foreground">{fullName}</h1>
                <p className="text-muted-foreground mb-3">{user?.email || 'Student'}</p>
                <div className="flex flex-wrap gap-3">
                  {[`🏆 ${competitions} Competitions`, `📜 ${certificates} Certificates`, `💡 ${projects} Projects`].map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 border border-border text-foreground font-semibold px-4 py-2.5 rounded-xl hover:bg-muted transition-all text-sm">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl transition-all text-sm">
                <Download className="h-4 w-4" /> Resume PDF
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: '🎓 Academic Score', value: `${academicScore}%`, sub: `Top ${percentile}% nationally`, subClass: 'text-teal-500' },
            { label: '💻 Skill Level', value: skillLevel, sub: `Top ${percentile}% in Coding`, subClass: 'text-muted-foreground' },
            { label: '📈 Growth Rate', value: growthRate, sub: `${streak} day streak`, subClass: 'text-purple-500' },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <span className="text-sm text-muted-foreground block mb-2">{s.label}</span>
              <strong className="text-3xl font-bold text-foreground block mb-1">{s.value}</strong>
              <span className={`text-xs ${s.subClass}`}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-4">Subject Proficiency</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" dot />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="font-bold text-foreground">AI Feedback</h3>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <Bot className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm leading-relaxed text-foreground">
                  "{fullName.split(' ')[0]} shows strong improvement in Science. Logic building in Coding is exceptional. Recommend focusing on intermediate Algebra to boost overall math scores."
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm text-foreground border" style={{ borderColor: `${skillColors[i]}40`, background: `${skillColors[i]}15` }}>{skill}</span>
                  ))}
                </div>
              </div>
              {achievements.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground mb-3">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {achievements.slice(0, 5).map((a, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-muted border border-border text-muted-foreground">
                        {achievementIcons[a.icon] || '🏅'} {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Academic' && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-foreground mb-4">Score Progression</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis domain={[40, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {radarData.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{s.subject}</span><span>{s.score}%</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="space-y-4">
            {stats?.continueLearning?.map((e, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-foreground">{e.title}</h4>
                  <span className="text-xs text-teal-500">{e.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${e.progress}%` }} />
                </div>
              </div>
            ))}
            {(!stats?.continueLearning || stats.continueLearning.length === 0) && (
              <div className="text-center p-10 text-muted-foreground">No courses enrolled yet. Start learning!</div>
            )}
          </div>
        )}

        {activeTab === 'Competitions' && (
          <div>
            <h3 className="font-bold text-foreground mb-4">Trophy Shelf</h3>
            {trophies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {trophies.map((t, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-4xl mb-2">{t.emoji}</div>
                    <p className="text-xs text-muted-foreground font-medium">{t.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 text-muted-foreground">No trophies yet! Join competitions to earn them.</div>
            )}
          </div>
        )}

        {activeTab === 'Projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(Math.max(1, projects))].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="h-28 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl mb-4" />
                <h4 className="font-bold text-foreground text-sm mb-1">Project {i + 1}</h4>
                <p className="text-xs text-muted-foreground">A project built as part of your learning journey.</p>
              </div>
            ))}
            <div className="bg-muted border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Add New Project</p>
            </div>
          </div>
        )}

        {/* Certificates */}
        {certList.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-foreground mb-4">Recent Certificates</h3>
            <div className="space-y-3">
              {certList.map((c, i) => (
                <div key={i} className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 flex items-center gap-4">
                  <Award className="h-6 w-6 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-foreground font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">Progress: {c.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
