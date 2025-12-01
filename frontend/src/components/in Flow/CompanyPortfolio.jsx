// frontend/src/components/CompanyPortfolio.jsx
import React from "react";
import { ArrowLeft, Sparkles, Download, Share2, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, fadeInUp, cardHover } from "../../lib/motionVariants";

export function CompanyPortfolio({ onClose }) {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onClose} className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Dashboard
                </Button>
                <div className="h-8 w-px bg-slate-300" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 21h18V3H3v18z" fill="#fff" opacity="0.06"/></svg>
                  </div>
                  <div>
                    <h1 className="text-slate-900">NeuralFlow AI</h1>
                    <p className="text-slate-600 text-sm">AI-powered credit risk assessment • Series A</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-slate-300">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="border-slate-300">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus size={16} className="mr-2" />
                  Add to Pipeline
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/12 backdrop-blur p-3 rounded-xl">
                  <Sparkles size={32} />
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">AI Investment Score</p>
                  <motion.h2 animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">94/100</motion.h2>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur mb-2">Strong Buy Signal</Badge>
                <p className="text-white/90 text-sm">High alignment with your portfolio thesis</p>
              </div>
            </div>
          </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={20} />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-600 text-sm mb-1">Seeking</p>
                    <p className="text-slate-900 text-xl">$8M</p>
                    <p className="text-emerald-600 text-xs mt-1">Series A</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-600 text-sm mb-1">Valuation</p>
                    <p className="text-slate-900 text-xl">$35M</p>
                    <p className="text-slate-600 text-xs mt-1">Pre-money</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-600 text-sm mb-1">ARR</p>
                    <p className="text-slate-900 text-xl">$2M</p>
                    <p className="text-emerald-600 text-xs mt-1">+85% MoM</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-600 text-sm mb-1">Customers</p>
                    <p className="text-slate-900 text-xl">127</p>
                    <p className="text-indigo-600 text-xs mt-1">3 Fortune 500</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Overview */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-slate-900 mb-2 text-sm">Problem</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Traditional credit risk assessment for SMB lending is manual, slow, and often inaccurate, 
                    leading to high default rates and missed opportunities for both lenders and borrowers.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-slate-900 mb-2 text-sm">Solution</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    NeuralFlow uses advanced machine learning to automate credit risk assessment, analyzing 
                    200+ data points including transaction history, social signals, and market trends to provide 
                    real-time credit decisions with 94% accuracy.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-slate-900 mb-2 text-sm">Business Model</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    SaaS platform with tiered pricing based on loan volume. Average contract value of $180K/year. 
                    Additional revenue from API integrations and white-label solutions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-indigo-600" size={20} />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Total Addressable Market</p>
                    <p className="text-slate-900 text-2xl">$127B</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Market Growth Rate</p>
                    <p className="text-slate-900 text-2xl">23% CAGR</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-slate-900 mb-3 text-sm">Competitive Landscape</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700 text-sm">Market Leader</span>
                      <Badge variant="outline" className="border-slate-300">Traditional Players</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <span className="text-slate-900 text-sm">NeuralFlow Position</span>
                      <Badge className="bg-indigo-600 text-white border-0">AI-First Disruptor</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-900 mb-2 text-sm">Key Differentiators</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <span className="text-slate-700 text-sm">94% accuracy vs 67% industry average</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <span className="text-slate-700 text-sm">Real-time decisions (2 minutes vs 2 weeks)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <span className="text-slate-700 text-sm">50% lower default rates for lenders</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-indigo-600" size={20} />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-16 h-16 br-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shrink-0">
                    AM
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 mb-1">Alex Martinez</h3>
                    <p className="text-slate-600 text-sm mb-2">CEO & Co-Founder</p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Former VP of Engineering at Stripe. Led ML team at Square. PhD in Computer Science from Stanford. 
                      Previously sold AI startup to PayPal for $45M.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-16 h-16 br-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white shrink-0">
                    SK
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 mb-1">Sarah Kim</h3>
                    <p className="text-slate-600 text-sm mb-2">CTO & Co-Founder</p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Ex-Google AI researcher. Published 15+ papers on ML risk assessment. MIT graduate. 
                      Built credit models processing $10B+ in transactions.
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-slate-700 text-sm">
                    <span className="text-indigo-700">Team size:</span> 24 people (12 engineers, 5 data scientists, 7 business)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Traction */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Traction & Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-600 text-sm mb-2">MoM Growth</p>
                    <p className="text-emerald-600 text-2xl">85%</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-2">NRR</p>
                    <p className="text-emerald-600 text-2xl">142%</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Churn</p>
                    <p className="text-emerald-600 text-2xl">2.1%</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-slate-900 mb-3 text-sm">Key Milestones</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-slate-900 text-sm">Signed 3 regional banks (Wells Fargo, Chase, BofA)</p>
                        <p className="text-slate-600 text-xs mt-1">Q4 2029</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-slate-900 text-sm">Processed $2.4B in loan applications</p>
                        <p className="text-slate-600 text-xs mt-1">Last 12 months</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-slate-900 text-sm">Achieved SOC 2 Type II compliance</p>
                        <p className="text-slate-600 text-xs mt-1">Q3 2029</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendation */}
            <Card className="border-emerald-200 br-linear-to-br from-emerald-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="text-emerald-600" size={20} />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4">
                  <p className="text-emerald-900">
                    <strong>Strong Investment Opportunity</strong>
                  </p>
                  <p className="text-emerald-800 text-sm mt-2">
                    High alignment with your AI/FinTech thesis. Strong team with proven exits. 
                    Exceptional traction and unit economics.
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 text-sm">Team Strength</span>
                      <span className="text-slate-900 text-sm">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 text-sm">Market Opportunity</span>
                      <span className="text-slate-900 text-sm">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 text-sm">Traction</span>
                      <span className="text-slate-900 text-sm">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 text-sm">Product/Tech</span>
                      <span className="text-slate-900 text-sm">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-slate-900 text-sm mb-2">Your Decision</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={recommendation === "pass" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecommendation("pass")}
                      className={recommendation === "pass" ? "bg-red-600" : "border-slate-300"}
                    >
                      <ThumbsDown size={14} className="mr-1" />
                      Pass
                    </Button>
                    <Button
                      variant={recommendation === "review" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecommendation("review")}
                      className={recommendation === "review" ? "bg-yellow-600" : "border-slate-300"}
                    >
                      Review
                    </Button>
                    <Button
                      variant={recommendation === "invest" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecommendation("invest")}
                      className={recommendation === "invest" ? "bg-emerald-600" : "border-slate-300"}
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      Invest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card className="border-orange-200 br-linear-to-br from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="text-orange-600" size={20} />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-slate-700 text-sm">
                    Heavy competition from established players like Experian and FICO
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-slate-700 text-sm">
                    Regulatory scrutiny in financial services sector
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-slate-700 text-sm">
                    Customer concentration: top 3 clients = 45% revenue
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deal Info */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Round Type</span>
                  <Badge className="bg-violet-100 text-violet-700 border-0">Series A</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Stage</span>
                  <span className="text-slate-900">Early Growth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className="text-slate-900">San Francisco, CA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Founded</span>
                  <span className="text-slate-900">2028</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Lead Investor</span>
                  <span className="text-slate-900">Sequoia Capital</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Other Investors</span>
                  <span className="text-slate-900">a16z, YC</span>
                </div>
              </CardContent>
            </Card>

            {/* Pitch Deck */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="text-indigo-600" size={20} />
                  Pitch Deck
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-slate-900 text-sm mb-1">neuralflow-series-a.pdf</p>
                  <p className="text-slate-600 text-xs">15 slides • 3.2 MB</p>
                </div>
                <Button variant="outline" className="w-full border-slate-300">
                  <Download size={16} className="mr-2" />
                  Download Deck
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
