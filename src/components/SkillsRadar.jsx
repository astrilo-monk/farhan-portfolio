import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles.css';

const hardSkillsData = [
  { subject: 'JavaScript', Score: 90, fullMark: 100 },
  { subject: 'React.js', Score: 85, fullMark: 100 },
  { subject: 'Backend (Node/Java)', Score: 75, fullMark: 100 },
  { subject: 'Core Java', Score: 80, fullMark: 100 },
  { subject: 'Dev Tools & Git', Score: 85, fullMark: 100 },
  { subject: 'Frontend UI/UX', Score: 80, fullMark: 100 },
  { subject: 'Data Structures', Score: 70, fullMark: 100 },
];

const softSkillsData = [
  { subject: 'Problem Solving', Score: 95, fullMark: 100 },
  { subject: 'Creative Coding', Score: 90, fullMark: 100 },
  { subject: 'Self Learning', Score: 100, fullMark: 100 },
  { subject: 'Debugging', Score: 90, fullMark: 100 },
  { subject: 'Adaptability', Score: 85, fullMark: 100 },
  { subject: 'Communication', Score: 80, fullMark: 100 },
];

const SkillsRadar = React.memo(() => {
  const [activeTab, setActiveTab] = useState('hard');

  const data = activeTab === 'hard' ? hardSkillsData : softSkillsData;
  const title = activeTab === 'hard' ? 'Hard Skills' : 'Soft Skills';
  // Use cyber cyan for hard skills, magenta for soft skills
  const color = activeTab === 'hard' ? '#00f0ff' : '#ff00aa'; 

  const nextTab = () => setActiveTab(prev => prev === 'hard' ? 'soft' : 'hard');
  const prevTab = () => setActiveTab(prev => prev === 'hard' ? 'soft' : 'hard');

  return (
    <div className="skills-radar-container hud-panel corner-decor fade-up">
      <div className="skills-header">
        <button onClick={prevTab} className="skills-nav-btn"><ChevronLeft size={24} /></button>
        <h3>{title}</h3>
        <button onClick={nextTab} className="skills-nav-btn"><ChevronRight size={24} /></button>
      </div>

      <div className="radar-chart-wrapper" style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <defs>
              <linearGradient id="colorGradientHard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorGradientSoft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff00aa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff00aa" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10, 6, 16, 0.95)', borderColor: color, color: '#fff' }}
              itemStyle={{ color: color }}
              isAnimationActive={false}
              cursor={false}
            />
            <Radar
              name="Proficiency"
              dataKey="Score"
              stroke={color}
              strokeWidth={2}
              fill={activeTab === 'hard' ? "url(#colorGradientHard)" : "url(#colorGradientSoft)"}
              fillOpacity={0.6}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="skills-dots">
        <span className={`dot ${activeTab === 'hard' ? 'active cyan' : ''}`} onClick={() => setActiveTab('hard')} />
        <span className={`dot ${activeTab === 'soft' ? 'active magenta' : ''}`} onClick={() => setActiveTab('soft')} />
      </div>

      <div className="skills-detail">
        <h4 className={activeTab === 'hard' ? 'cyan' : 'magenta'}>Detail</h4>
        <p>
          {activeTab === 'hard' 
            ? "These technical skills are derived from building projects like ascii-art-js, code-tracer, and http-server-java. They represent my core capabilities in frontend and backend environments."
            : "Developed through consistent project-based learning, debugging complex issues in tools like saarthi, and maintaining structured, high-quality codebases."}
        </p>
      </div>
    </div>
  );
});

export default SkillsRadar;
