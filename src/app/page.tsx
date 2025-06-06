"use client"

import React, { useState, useEffect } from 'react';
import { Github, Twitter, Zap, TrendingUp, Award, Code, DollarSign, Users, Star, ArrowRight } from 'lucide-react';

const DevWorthLanding = () => {
const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.3 }
    );

    const timelineElements = document.querySelectorAll('[data-timeline]');
    timelineElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const NebulaOrb = ({ size = 'w-64 h-64', delay = 0, position = 'top-1/4 left-1/4', gradient = 'from-violet-400 to-purple-600' }) => (
    <div 
      className={`absolute ${size} ${position} rounded-full bg-gradient-radial ${gradient} blur-2xl`}
      style={{
        animation: `nebula-float 12s ease-in-out infinite ${delay}s, smooth-pulse 4s ease-in-out infinite ${delay * 0.7}s`,
        filter: 'blur(40px)',
        opacity: 0.15,
      }}
    />
  );

  const GridPattern = () => (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.4) 1px, transparent 0)`,
        backgroundSize: '60px 60px',
        animation: 'grid-move 25s linear infinite'
      }} />
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description, gradient } : any) => (
    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-violet-500/50 transition-all duration-500 hover:scale-105">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: gradient }} />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center" style={{ background: gradient }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  const Badge = ({ type, label, color }: any) => (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color} mr-2 mb-2`}>
      <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Nebula Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <GridPattern />
        
        {/* Large nebula orbs */}
        <NebulaOrb size="w-96 h-96" delay={0} position="top-10 -left-20" gradient="from-violet-400 via-purple-500 to-pink-500" />
        <NebulaOrb size="w-80 h-80" delay={2} position="top-1/3 right-10" gradient="from-blue-400 via-cyan-500 to-teal-400" />
        <NebulaOrb size="w-72 h-72" delay={4} position="bottom-20 left-1/4" gradient="from-purple-500 via-violet-600 to-indigo-500" />
        <NebulaOrb size="w-64 h-64" delay={1} position="bottom-10 -right-10" gradient="from-pink-400 via-rose-500 to-orange-400" />
        
        {/* Medium nebula orbs */}
        <NebulaOrb size="w-48 h-48" delay={3} position="top-1/2 left-10" gradient="from-emerald-400 via-teal-500 to-cyan-500" />
        <NebulaOrb size="w-56 h-56" delay={5} position="top-20 right-1/3" gradient="from-indigo-400 via-blue-500 to-purple-500" />
        <NebulaOrb size="w-40 h-40" delay={2.5} position="bottom-1/3 right-20" gradient="from-yellow-400 via-orange-500 to-red-400" />
        
        {/* Small nebula orbs */}
        <NebulaOrb size="w-32 h-32" delay={1.5} position="top-1/4 left-1/2" gradient="from-violet-300 via-purple-400 to-pink-400" />
        <NebulaOrb size="w-28 h-28" delay={4.5} position="bottom-1/2 left-1/3" gradient="from-blue-300 via-indigo-400 to-violet-400" />
        <NebulaOrb size="w-36 h-36" delay={3.5} position="top-2/3 right-1/4" gradient="from-teal-300 via-cyan-400 to-blue-400" />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
           <p className='text-lg font-bold'>Forked<span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Up
            </span></p> 
            
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-900/50 to-blue-900/50 border border-violet-500/30 mb-8">
            <Zap className="w-4 h-4 text-violet-400 mr-2" />
            <span className="text-sm text-violet-300">Your code has value • Discover it now</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your GitHub is worth
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              more than you think
            </span>
          </h1>
          
          <p className="text-sm text-gray-300 mb-12 max-w-2xl mx-auto font-bold">
            Connect your socials so we can remind you that 90% of your commits are console.log('test'). It's not just imposter syndrome. It’s AI-verified NGMI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-black border-2 border-violet-500 rounded-xl font-semibold text-white hover:bg-violet-500 transition-all duration-300 flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">12K+ devs valued</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Badges */}
      <section className="relative z-10 container mx-auto px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-gray-300">Earn Your Developer Badge</h3>
          <div className="flex flex-wrap justify-center">
            <Badge type="ngmi" label="NGMI - Not Gonna Make It" color="bg-red-900/30 text-red-300 border border-red-500/30" />
            <Badge type="mgmi" label="MGMI - Might Make It" color="bg-yellow-900/30 text-yellow-300 border border-yellow-500/30" />
            <Badge type="ygmi" label="YGMI - You're Gonna Make It" color="bg-green-900/30 text-green-300 border border-green-500/30" />
            <Badge type="wagmi" label="WAGMI - We're All Gonna Make It" color="bg-violet-900/30 text-violet-300 border border-violet-500/30" />
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Features that
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"> matter</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to understand your true developer worth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={Github}
            title="GitHub Analysis"
            description="Deep dive into your repositories, commits, and contributions with AI-powered insights"
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
          />
          <FeatureCard
            icon={Twitter}
            title="X Integration"
            description="Connect your X profile for a complete developer persona card"
            gradient="linear-gradient(135deg, #1d4ed8, #3b82f6)"
          />
          <FeatureCard
            icon={DollarSign}
            title="AI Valuation"
            description="Get your code valued in real dollars based on complexity and impact"
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
          <FeatureCard
            icon={Award}
            title="Developer Badges"
            description="Earn prestigious badges from NGMI to WAGMI based on your contributions"
            gradient="linear-gradient(135deg, #dc2626, #f59e0b)"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Growth Tracking"
            description="Monitor your progress and see how your worth evolves over time"
            gradient="linear-gradient(135deg, #7c3aed, #a855f7)"
          />
          <FeatureCard
            icon={Users}
            title="Community Ranks (under dev)"
            description="See how you stack up against other developers in the community"
            gradient="linear-gradient(135deg, #0891b2, #06b6d4)"
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-gray-400 text-lg">Simple steps to discover your developer worth</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-blue-500 to-violet-500 transform md:-translate-x-1/2"></div>
            
            <div className="space-y-16">
              {[
                { step: "01", title: "Connect", desc: "Link your X and GitHub accounts securely", icon: "🔗" },
                { step: "02", title: "Analyze", desc: "Our AI analyzes your code and contributions", icon: "🤖" },
                { step: "03", title: "Discover", desc: "Get your valuation and developer badge", icon: "💎" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  id={`timeline-${index}`}
                  data-timeline
                  className={`relative flex items-center transition-all duration-1000 ${
                    isVisible[`timeline-${index}`] 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full border-4 border-black transform md:-translate-x-1/2 z-10 flex items-center justify-center transition-all duration-500 ${
                    isVisible[`timeline-${index}`] ? 'scale-100' : 'scale-0'
                  }`}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Connecting line segment */}
                  
                  <div className={`absolute left-8 md:left-1/2 w-0.5 h-16 bg-gradient-to-b from-violet-500 to-blue-500 transform md:-translate-x-1/2 transition-all duration-700 ${
                    isVisible[`timeline-${index}`] ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ 
                    top: '24px',
                    transformOrigin: 'top',
                    transitionDelay: `${index * 150 + 300}ms`
                  }}></div>
                  
                  {/* Content */}
                  <div className={`w-full pl-20 md:pl-0 transition-all duration-800 ${
                    index % 2 === 0 ? 'md:pr-12 md:w-1/2' : 'md:pl-12 md:w-1/2 md:ml-auto'
                  } ${
                    isVisible[`timeline-${index}`]
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${index % 2 === 0 ? 'md:-translate-x-8' : 'md:translate-x-8'} translate-x-0`
                  }`}
                  style={{ transitionDelay: `${index * 200 + 400}ms` }}
                >
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 shadow-2xl">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl mr-4 shadow-lg">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-violet-400 mb-1">{item.step}</div>
                          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to discover your
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"> developer worth</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who've already discovered their true value
          </p>
          <button className="group relative px-10 py-5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl font-semibold text-white hover:from-violet-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
            <span className="text-lg">Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <div className="flex justify-center mb-[3rem] items-center">
  <video className="w-[500px] h-[300px] object-cover rounded-xl" autoPlay muted loop>
    <source src="./forkedUp.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>


      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              ForkedUp
            </span>
          </div>
          <p className="text-gray-400 mb-4">Discover the true value of your code</p>
          <p className="text-gray-500 text-sm">© 2025 DevWorth. Built for developers, by developers.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes nebula-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          25% { 
            transform: translateY(-20px) translateX(15px) scale(1.05); 
          }
          50% { 
            transform: translateY(-8px) translateX(-10px) scale(0.95); 
          }
          75% { 
            transform: translateY(-25px) translateX(8px) scale(1.02); 
          }
        }
        
        @keyframes smooth-pulse {
          0%, 100% { 
            opacity: 0.15; 
            transform: scale(1);
          }
          25% { 
            opacity: 0.25; 
            transform: scale(1.08);
          }
          50% { 
            opacity: 0.18; 
            transform: scale(1.03);
          }
          75% { 
            opacity: 0.22; 
            transform: scale(1.05);
          }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default DevWorthLanding;