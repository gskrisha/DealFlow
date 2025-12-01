import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  Target,
  Zap,
  Brain,
  Mail,
  BarChart3,
  Network,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
function CountUp({ from = 0, to = 0, duration = 1.8, suffix = "", decimals = 0 }) {
  const controls = useAnimation();
  const [value, setValue] = useState(from);

  useEffect(() => {
    controls.start({
      val: to,
      transition: { duration, ease: "easeOut" }
    });
  }, [to]);

  return (
    <motion.span
      initial={{ val: from }}
      animate={controls}
      onUpdate={(latest) => {
        const num = Number(latest.val).toFixed(decimals);
        setValue(num);
      }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}

export function LandingPage({ onEnterDashboard }) {
  const features = [
    {
      icon: Search,
      title: "Smart Discovery",
      description:
        "AI-powered crawling of Crunchbase, AngelList, YC, LinkedIn, ProductHunt, GitHub, and Twitter/X to find high-potential startups.",
      pain: "Solves: Discovery inefficiency",
    },
    {
      icon: Brain,
      title: "AI Deal Scoring Engine",
      description:
        "ML-powered evaluation of founding teams, traction, market potential, and investor fit with explainable scoring.",
      pain: "Solves: Evaluation bottleneck & Noise vs. quality",
    },
    {
      icon: Mail,
      title: "Automated Outreach",
      description:
        "Generate personalized emails to high-score startups with Gmail, Outlook, and HubSpot integration.",
      pain: "Solves: Time inefficiency",
    },
    {
      icon: BarChart3,
      title: "Deal Tracking Dashboard",
      description:
        "Unified view of all deals with filters by stage, score, sector, and daily top-5 startup alerts.",
      pain: "Solves: Fragmented data",
    },
    {
      icon: TrendingUp,
      title: "Continuous Monitoring",
      description:
        "Track momentum shifts, funding rounds, team changes, and growth signals in real-time.",
      pain: "Solves: Missed signals",
    },
    {
      icon: Network,
      title: "Network Intelligence",
      description:
        "Visualize mutual connections, portfolio synergies, and predict next unicorn probability.",
      pain: "Solves: Network leverage gaps",
    },
  ];

  const painPoints = [
    "Too many startup leads, very few worth investing in",
    "Finding early, high-potential startups before everyone else",
    "Analysts spend hours reviewing decks and founders",
    "Info spread across Crunchbase, LinkedIn, Pitchbook, internal CRMs",
    "No continuous tracking of emerging startups or momentum shifts",
  ];

  const capabilities = [
    { label: "Startups Tracked", value: 50, suffix: "k+" },
    { label: "Data Sources", value: 15, suffix: "+" },
    { label: "AI Accuracy", value: 94, suffix: "%" },
    { label: "Time Saved", value: 20, suffix: "hrs/week" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-purple-50">
      {/* Background orbs */}
      <div className="pointer-events-none fixed top-[-200px] left-[-150px] w-[460px] h-[460px] rounded-full bg-linear-to-br from-indigo-300/40 to-purple-300/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-180px] -right-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-pink-200/40 to-amber-200/40 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-lg shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">flowFound</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-slate-600 transition hover:text-slate-900" href="#features">
              Features
            </a>
            <a className="text-slate-600 transition hover:text-slate-900" href="#how-it-works">
              How it Works
            </a>
            <a className="text-slate-600 transition hover:text-slate-900" href="#pricing">
              Pricing
            </a>
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm" onClick={onEnterDashboard}>View Demo</Button>
          </nav>

          <Button className="md:hidden" size="sm" onClick={onEnterDashboard}>Demo</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-26">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <Badge className="mx-auto bg-blue-50 text-blue-700 border-blue-200 shadow-sm">
            AI-Powered Deal Flow Intelligence
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900"
          >
            Find the next{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              unicorn
            </span>{" "}
            before everyone else
          </motion.h1>

          <p className="mx-auto max-w-2xl text-xl text-slate-600">
            An AI-driven platform that identifies, scores, and tracks the most investable startups
            aligned with your thesis. Stop drowning in noise. Start investing in winners.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2" onClick={onEnterDashboard}>
              Explore Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Book a Demo
            </Button>
          </div>

          {/* Stats with CountUp */}
          <div className="grid grid-cols-2 gap-6 pt-12 md:grid-cols-4">
            {capabilities.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl text-transparent">
                  <CountUp
                    from={0}
                    to={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                    decimals={0}
                  />
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl lg:text-4xl font-bold">
              The Problem with Traditional Deal Flow
            </h2>
            <p className="mb-12 text-center text-slate-400">
              VCs face critical challenges in today's fast-moving startup ecosystem
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                >
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-slate-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl lg:text-5xl font-bold text-slate-900">
              Intelligent Deal Flow, Powered by AI
            </h2>
            <p className="text-xl text-slate-600">
              Every feature designed to solve your biggest pain points
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  whileHover={{ scale: 1.025 }}
                  transition={{ duration: 0.25 }}
                  key={f.title}
                >
                  <Card className="rounded-2xl border border-slate-200 bg-white/90 shadow-md transition hover:shadow-lg pb-5">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600 shadow">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{f.title}</CardTitle>
                      <CardDescription className="text-sm">
                        <Badge
                          variant="outline"
                          className="mt-2 mb-3 border-green-200 bg-green-50 text-xs text-green-700"
                        >
                          {f.pain}
                        </Badge>
                        <p>{f.description}</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-linear-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-16 text-center text-4xl font-bold text-slate-900">
              How flowFound Works
            </h2>

            <div className="space-y-10">
              {[
                {
                  step: "01",
                  title: "Connect Your Thesis",
                  description:
                    "Define your investment criteria: sectors, stages, geography, and thesis keywords.",
                  icon: Target,
                },
                {
                  step: "02",
                  title: "AI Discovers & Scores",
                  description:
                    "Our engine crawls 15+ sources, extracts data with LLMs, and scores startups on team, traction, and fit.",
                  icon: Brain,
                },
                {
                  step: "03",
                  title: "Review Top Deals",
                  description:
                    "Get daily alerts with top 5 startups. Review AI-generated summaries and scoring explanations.",
                  icon: TrendingUp,
                },
                {
                  step: "04",
                  title: "Automate Outreach",
                  description:
                    "Send personalized emails with one click. Track responses and schedule meetings.",
                  icon: Zap,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="flex items-start gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <div className="mb-1 text-sm font-medium text-blue-600">
                        STEP {step.step}
                      </div>
                      <h3 className="mb-2 text-2xl font-semibold text-slate-900">{step.title}</h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden rounded-2xl border-0 bg-linear-to-br from-blue-600 to-purple-600 shadow-xl">
            <CardContent className="p-12 text-center text-white space-y-3">
              <h2 className="text-4xl font-bold">Ready to transform your deal flow?</h2>
              <p className="text-xl text-blue-100">
                Join leading VCs who are finding better deals, faster.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button size="lg" className="gap-2" onClick={onEnterDashboard}>
                  Explore Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white/10"
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  14-day free trial
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">flowFound</span>
          </div>

          <p className="text-sm text-slate-600">
            © 2025 flowFound. AI-Powered VC Deal Flow Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
