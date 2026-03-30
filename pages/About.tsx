import React from 'react';
import { SEO } from '../components/SEO';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { 
  Rocket, 
  Target, 
  Cpu, 
  Lightbulb, 
  Users, 
  ShieldCheck, 
  Wrench, 
  Code, 
  Gamepad2, 
  Palette, 
  Briefcase, 
  Video,
  Printer,
  Zap
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="À Propos - MakerLab Academy Casablanca"
        description="Découvrez MakerLab Academy, le centre de référence STEM au Maroc. Ateliers de robotique, codage, IA et impression 3D pour enfants et adolescents."
        keywords="STEM education Morocco, activités STEM enfants Maroc, ateliers scientifiques Casablanca, éducation technologique jeunes, MakerLab Academy Casablanca"
      />
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b-8 border-black bg-brand-orange/10">
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display font-black text-6xl md:text-7xl mb-6 leading-tight uppercase tracking-tighter">
                Who We <span className="text-brand-red">Are</span>
              </h1>
              <p className="text-2xl font-bold mb-8 leading-relaxed">
                MakerLab Academy is a <span className="bg-brand-blue/20 px-2">STEM education center in Casablanca</span> where kids and teenagers learn by <span className="underline decoration-brand-red decoration-4">building real projects</span>, not just watching or memorizing.
              </p>
              <div className="bg-black text-white p-6 rounded-2xl border-4 border-black shadow-neo inline-block rotate-1">
                <p className="font-black text-xl uppercase tracking-widest">
                  Think like engineers, creators, and innovators.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Abstract shapes for background */}
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-black rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border-8 border-brand-red rounded-xl rotate-12 opacity-10"></div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 border-b-8 border-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="bg-brand-blue border-4 border-black rounded-3xl p-8 shadow-neo -rotate-2">
                <h2 className="font-display font-black text-4xl mb-6 uppercase">Our Mission</h2>
                <p className="text-xl font-bold mb-6">
                  At MakerLab, students don't just use technology — they design it, build it, and understand it.
                </p>
                <div className="space-y-4">
                  {[
                    "Solve problems",
                    "Build solutions",
                    "Work creatively with technology",
                    "Turn ideas into real projects"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">{i+1}</div>
                      <span className="font-black uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <h2 className="font-display font-black text-5xl mb-8 uppercase leading-none">
                Our <span className="text-brand-blue">Vision</span>
              </h2>
              <p className="text-xl font-bold mb-6 text-gray-700">
                We want to build a new generation of young innovators in Morocco. A generation that creates instead of only consuming technology.
              </p>
              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform">
                <p className="font-bold text-lg italic">
                  "MakerLab Academy aims to become a reference for hands-on STEM education in Morocco."
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Difference Section - Engineering Process */}
      <section className="py-20 bg-gray-50 border-b-8 border-black overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-16">
          <ScrollReveal>
            <h2 className="font-display font-black text-5xl md:text-6xl mb-6 uppercase">
              What Makes Us <span className="text-brand-green">Different</span>
            </h2>
            <p className="text-xl font-bold text-gray-600 max-w-3xl mx-auto">
              Most programs use pre-made kits. At MakerLab, we follow a real engineering process to go much further.
            </p>
            <div className="mt-8 inline-block bg-brand-red text-white border-4 border-black px-8 py-3 rounded-full font-black uppercase tracking-tighter text-xl shadow-neo rotate-1 hover:rotate-0 transition-transform">
              🚫 THE "NO LEGO" RULE : REAL COMPONENTS ONLY
            </div>
          </ScrollReveal>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                step: "1", 
                title: "Design", 
                desc: "Students design using CAD tools, applying geometry and logic.", 
                color: "bg-brand-orange", 
                icon: Lightbulb 
              },
              { 
                step: "2", 
                title: "Build", 
                desc: "Manufacture designs using 3D printers and laser cutters.", 
                color: "bg-brand-red", 
                icon: Wrench 
              },
              { 
                step: "3", 
                title: "Program", 
                desc: "Students code and bring their projects to life.", 
                color: "bg-brand-blue", 
                icon: Code 
              },
              { 
                step: "4", 
                title: "Test & Improve", 
                desc: "Debug and improve design — just like real engineers.", 
                color: "bg-brand-green", 
                icon: Zap 
              }
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className={`h-full border-4 border-black p-8 rounded-3xl ${s.color} shadow-neo flex flex-col items-center text-center transform hover:scale-105 transition-transform`}>
                  <div className="bg-white p-4 rounded-2xl border-4 border-black mb-6">
                    <s.icon size={32} />
                  </div>
                  <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-black mb-4 uppercase tracking-widest">
                    Step {s.step}
                  </div>
                  <h3 className="font-display font-black text-2xl mb-4 uppercase">{s.title}</h3>
                  <p className="font-bold text-sm leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stations Section */}
      <section className="py-20 border-b-8 border-black">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="font-display font-black text-5xl mb-4 uppercase">Six Innovation Stations</h2>
              <div className="w-32 h-3 bg-brand-red border-2 border-black"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Computer Science & AI", icon: Cpu, desc: "Programming, artificial intelligence, and software inner workings.", color: "border-brand-blue" },
              { title: "Robotics & Engineering", icon: Rocket, desc: "Design and build robots from scratch — no Lego kits.", color: "border-brand-red" },
              { title: "Game Design", icon: Gamepad2, desc: "Create video games and interactive experiences.", color: "border-brand-green" },
              { title: "Creative Design", icon: Palette, desc: "Digital design tools to develop visual creativity.", color: "border-brand-orange" },
              { title: "Entrepreneurship", icon: Briefcase, desc: "Transform ideas into real projects and startups.", color: "border-black" },
              { title: "Digital Storytelling", icon: Video, desc: "Communicate ideas through video, content, and media.", color: "border-brand-blue" }
            ].map((station, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className={`border-4 ${station.color} p-8 rounded-2xl bg-white hover:bg-gray-50 transition-colors shadow-neo-sm group`}>
                  <div className={`w-14 h-14 rounded-xl border-4 border-black flex items-center justify-center mb-6 transition-transform group-hover:-rotate-6 bg-white`}>
                    <station.icon size={28} />
                  </div>
                  <h3 className="font-display font-black text-2xl mb-4 uppercase tracking-tight">{station.title}</h3>
                  <p className="font-bold text-gray-600 leading-relaxed">{station.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Makerspace Section */}
      <section className="py-20 bg-brand-green/10 border-b-8 border-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-white border-4 border-black rounded-[40px] p-8 md:p-16 shadow-neo grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <ScrollReveal direction="left">
              <h2 className="font-display font-black text-5xl md:text-6xl mb-8 uppercase leading-tight">
                Our <span className="text-brand-red">Makerspace</span>
              </h2>
              <p className="text-xl font-bold mb-8 text-gray-700 leading-relaxed">
                MakerLab Academy is built like a <span className="bg-brand-orange/20 px-2 italic">real innovation lab</span>. 
                Students have access to tools used by professionals to feel like they are inside a startup lab or tech studio.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "3D Printers", icon: Printer },
                  { label: "Laser Cutting", icon: Zap },
                  { label: "Electronics Lab", icon: Cpu },
                  { label: "Prototyping Tools", icon: Wrench }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-black rounded-xl font-black uppercase text-sm tracking-wider">
                    <item.icon size={18} className="text-brand-red" />
                    {item.label}
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="bg-brand-red absolute -top-4 -left-4 w-full h-full rounded-[40px] border-4 border-black"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
                  alt="MakerLab Makerspace" 
                  className="relative z-10 w-full h-[400px] object-cover rounded-[40px] border-4 border-black shadow-neo"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-10 font-display font-black text-9xl text-black/5 select-none pointer-events-none uppercase">MAKER</div>
      </section>

      {/* Philosophy & Parents Section */}
      <section className="py-20 border-b-8 border-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <ScrollReveal direction="left">
              <h2 className="font-display font-black text-4xl mb-8 uppercase">Teaching Philosophy</h2>
              <p className="text-xl font-bold mb-8 text-gray-600">
                We believe students learn best when they build, experiment, make mistakes, and solve real problems. 
                Our instructors guide students like mentors in a startup or engineering lab.
              </p>
              <div className="space-y-6">
                {[
                  "Project-based learning",
                  "Creativity & Innovation",
                  "Collaboration & Teamwork",
                  "Real-world Technical Skills"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border-2 border-black rounded-xl bg-brand-blue/10">
                    <ShieldCheck className="text-brand-blue mt-1" />
                    <div>
                      <h4 className="font-black uppercase text-lg">{item}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="bg-brand-orange border-4 border-black rounded-3xl p-8 shadow-neo">
                <h2 className="font-display font-black text-4xl mb-8 uppercase">Why Parents Choose Us</h2>
                <div className="space-y-4">
                  {[
                    "Develop confidence through projects",
                    "Understand technology deeply",
                    "Improve problem-solving skills",
                    "Use screens productively",
                    "Prepare for future careers"
                  ].map((item, i) => (
                    <div key={i} className="bg-white border-2 border-black p-4 rounded-xl flex items-center gap-4 hover:translate-x-2 transition-transform">
                      <div className="bg-brand-red text-white p-2 rounded-lg border-2 border-black">
                        <Zap size={16} />
                      </div>
                      <span className="font-bold text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-black text-white text-center border-b-8 border-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <h2 className="font-display font-black text-5xl md:text-6xl mb-12 uppercase italic tracking-tighter">
              Who Our Programs Are <span className="text-brand-blue underline">For</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                "Kids curious about tech",
                "Teenagers",
                "Future engineers",
                "Innovation lovers",
                "Beginners & Advanced"
              ].map((item, i) => (
                <div key={i} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full border-2 border-white/30 font-black uppercase text-sm tracking-widest transition-colors">
                  {item}
                </div>
              ))}
            </div>
            <div className="mb-12">
              <span className="font-display font-black text-7xl md:text-9xl text-brand-orange">7 - 17</span>
              <p className="font-black uppercase text-2xl tracking-widest mt-2">Years Old</p>
            </div>
            <p className="text-2xl font-bold text-gray-400">
              No previous experience is required — only curiosity.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-brand-red relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal scale={0.9}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display font-black text-6xl md:text-7xl mb-8 text-white uppercase leading-none tracking-tighter">
                Join the <span className="bg-black text-brand-orange px-4">Maker</span> Movement
              </h2>
              <p className="text-2xl font-black text-black mb-12 uppercase leading-tight">
                Not just someone who uses technology — but someone who builds the future.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button href="/register" variant="secondary" className="px-12 py-6 text-2xl font-black uppercase border-4 border-black shadow-neo-dark">
                  Get Started
                </Button>
                <Button href="/programs" variant="outline" className="px-12 py-6 text-2xl font-black uppercase border-4 border-black hover:bg-black hover:text-white transition-all">
                  Our Programs
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Background text decoration */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 select-none pointer-events-none">
          <span className="font-display font-black text-[20rem] text-black/10 leading-none">BUILD</span>
        </div>
      </section>
    </div>
  );
};
