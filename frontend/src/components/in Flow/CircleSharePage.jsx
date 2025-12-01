// frontend/src/components/in Flow/CircleSharePage.jsx
import { useState } from "react";
import { ArrowLeft, Share2, TrendingUp, ThumbsUp, Send, X, Users, Star, Award, Target, ArrowUpRight, Clock, Calendar, Handshake, AlertCircle, Heart, MessageCircle, Zap, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { SelectRecipientsPage } from "./SelectRecipientsPage";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";

const mockContacts = [
  {
    id: "1",
    name: "Sarah Chen",
    firm: "Sequoia Capital",
    title: "Partner",
    avatar: "SC",
    matchScore: 96,
    relationshipScore: 95,
    sectors: ["AI/ML", "FinTech", "SaaS"],
    stats: {
      dealsShared: 23,
      dealsAccepted: 18,
      acceptanceRate: 78,
      dealsSharedBack: 31,
      responseTime: "2 hours",
      lastInteraction: "3 days ago",
    },
    insights: [
      "High engagement with AI/ML deals",
      "Co-invested in 5 deals together",
      "Strong track record on Series A",
    ],
    coInvestments: ["QuantumAI (2029)", "DataFlow Systems (2028)", "NeuralTech (2029)", "CloudSync (2028)", "AutoML Labs (2029)"],
    recentActivity: "Led Series B in AI startup last week",
    preferredDealSize: "$5M - $15M",
    strongestSector: "AI/ML (92% acceptance)",
    responsePattern: "Responds fastest on Tuesday mornings",
    personalNote: "Your strongest connection - always shares back premium deals",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    firm: "Andreessen Horowitz",
    title: "General Partner",
    avatar: "MR",
    matchScore: 92,
    relationshipScore: 88,
    sectors: ["FinTech", "Blockchain", "Enterprise"],
    stats: {
      dealsShared: 15,
      dealsAccepted: 12,
      acceptanceRate: 80,
      dealsSharedBack: 19,
      responseTime: "4 hours",
      lastInteraction: "1 week ago",
    },
    insights: [
      "Specializes in FinTech deals",
      "Active co-investor",
      "Fast decision maker",
    ],
    coInvestments: ["PayFlow (2029)", "CreditLabs (2028)", "BlockFinance (2029)"],
    recentActivity: "Just closed $100M fund focused on FinTech",
    preferredDealSize: "$8M - $25M",
    strongestSector: "FinTech (85% acceptance)",
    responsePattern: "Reviews deals within 24 hours",
    personalNote: "Great at introducing to other VCs in network",
  },
  {
    id: "3",
    name: "Emily Thompson",
    firm: "Accel Partners",
    title: "Principal",
    avatar: "ET",
    matchScore: 88,
    relationshipScore: 82,
    sectors: ["SaaS", "AI/ML", "Developer Tools"],
    stats: {
      dealsShared: 19,
      dealsAccepted: 14,
      acceptanceRate: 74,
      dealsSharedBack: 12,
      responseTime: "6 hours",
      lastInteraction: "2 days ago",
    },
    insights: [
      "Focuses on early-stage SaaS",
      "Strong technical diligence",
      "Co-invested in 3 deals",
    ],
    coInvestments: ["DevTools Pro (2029)", "APIHub (2028)", "CodeFlow (2029)"],
    recentActivity: "Shared 2 SaaS deals with you this month",
    preferredDealSize: "$3M - $10M",
    strongestSector: "SaaS (78% acceptance)",
    responsePattern: "Prefers detailed pitch decks",
    personalNote: "Met at TechCrunch Disrupt 2028 - strong technical background",
  },
  {
    id: "4",
    name: "David Park",
    firm: "Lightspeed Venture",
    title: "Partner",
    avatar: "DP",
    matchScore: 85,
    relationshipScore: 75,
    sectors: ["AI/ML", "HealthTech", "Climate"],
    stats: {
      dealsShared: 11,
      dealsAccepted: 8,
      acceptanceRate: 73,
      dealsSharedBack: 14,
      responseTime: "1 day",
      lastInteraction: "5 days ago",
    },
    insights: [
      "Interest in AI for healthcare",
      "Slow but thoughtful responder",
      "Good deal flow reciprocity",
    ],
    coInvestments: ["HealthAI (2029)", "MedTech Solutions (2028)"],
    recentActivity: "Participated in 3 deals you shared",
    preferredDealSize: "$10M - $30M",
    strongestSector: "HealthTech (80% acceptance)",
    responsePattern: "Takes time but thorough in diligence",
    personalNote: "Introduced you to 2 LPs last quarter",
  },
  {
    id: "5",
    name: "Jessica Wu",
    firm: "Kleiner Perkins",
    title: "Venture Partner",
    avatar: "JW",
    matchScore: 82,
    relationshipScore: 68,
    sectors: ["Consumer", "FinTech", "Marketplace"],
    stats: {
      dealsShared: 8,
      dealsAccepted: 5,
      acceptanceRate: 63,
      dealsSharedBack: 7,
      responseTime: "8 hours",
      lastInteraction: "2 weeks ago",
    },
    insights: [
      "Consumer-focused investments",
      "Moderate engagement level",
      "Balanced deal sharing",
    ],
    coInvestments: ["MarketHub (2029)"],
    recentActivity: "Recently promoted to Venture Partner",
    preferredDealSize: "$5M - $12M",
    strongestSector: "Consumer (65% acceptance)",
    responsePattern: "More active in Q4",
    personalNote: "Growing relationship - recently became more active",
  },
  {
    id: "6",
    name: "Robert Kumar",
    firm: "Index Ventures",
    title: "Associate",
    avatar: "RK",
    matchScore: 79,
    relationshipScore: 55,
    sectors: ["SaaS", "Enterprise", "DevTools"],
    stats: {
      dealsShared: 12,
      dealsAccepted: 7,
      acceptanceRate: 58,
      dealsSharedBack: 5,
      responseTime: "12 hours",
      lastInteraction: "1 month ago",
    },
    insights: [
      "Enterprise SaaS specialist",
      "Less frequent responder",
      "Low reciprocity rate",
    ],
    coInvestments: ["EnterpriseSuite (2028)"],
    recentActivity: "Hasn't shared deals recently",
    preferredDealSize: "$2M - $8M",
    strongestSector: "Enterprise (60% acceptance)",
    responsePattern: "Needs partner approval for decisions",
    personalNote: "Junior partner - consider reaching out to senior partners",
  },
];

export function CircleSharePage({ onClose, dealName = "NeuralFlow AI" }) {
  const [showSelectRecipients, setShowSelectRecipients] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("match");

  const filteredContacts = mockContacts
    .filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.sectors.some(sector => sector.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "acceptance") return b.stats.acceptanceRate - a.stats.acceptanceRate;
      return 0; // recent
    });

  if (showSelectRecipients) {
    return <SelectRecipientsPage onClose={() => setShowSelectRecipients(false)} onBack={() => setShowSelectRecipients(false)} dealName={dealName} />;
  }

  return (
    <div className="min-h-screen br-linear-to-br from-slate-50 via-white to-indigo-50">
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
              <div>
                <h1 className="text-slate-900">Circle Share</h1>
                <p className="text-slate-600 text-sm">Share {dealName} with your network</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} size="icon">
              <X size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Preview */}
            <Card className="border-slate-200 br-linear-to-br from-indigo-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 br-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 text-xl">
                      NF
                    </div>
                    <div>
                      <h2 className="text-slate-900 mb-1">{dealName}</h2>
                      <p className="text-slate-600 text-sm mb-3">AI-powered credit risk assessment platform</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-100 text-indigo-700 border-0">AI/ML</Badge>
                        <Badge className="bg-violet-100 text-violet-700 border-0">FinTech</Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">Series A</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-0">
                    <Star size={12} className="mr-1" />
                    94 Score
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search by name, firm, or sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700"
                  >
                    <option value="match">Best Match</option>
                    <option value="acceptance">Acceptance Rate</option>
                    <option value="recent">Recent Activity</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Network List */}
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="border-slate-200 hover:shadow-lg transition-all overflow-hidden">
                  {/* Top Banner with Relationship Indicator */}
                  {contact.relationshipScore >= 90 && (
                    <div className="br-linear-to-r from-emerald-500 to-teal-500 px-4 py-2 flex items-center gap-2">
                      <Heart size={14} className="text-white" />
                      <span className="text-white text-xs">Strong Relationship</span>
                    </div>
                  )}
                  {contact.relationshipScore >= 80 && contact.relationshipScore < 90 && (
                    <div className="br-linear-to-r from-indigo-500 to-purple-500 px-4 py-2 flex items-center gap-2">
                      <Handshake size={14} className="text-white" />
                      <span className="text-white text-xs">Trusted Partner</span>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar with Status */}
                      <div className="relative">
                        <div className="w-16 h-16 br-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl shrink-0">
                          {contact.avatar}
                        </div>
                        {contact.stats.lastInteraction.includes("days") && parseInt(contact.stats.lastInteraction) <= 7 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                            <Zap size={10} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-slate-900">{contact.name}</h3>
                              {contact.matchScore >= 90 && (
                                <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs">
                                  <Star size={10} className="mr-1" />
                                  Top Match
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm mb-2">{contact.title} at {contact.firm}</p>
                            
                            {/* Personal Note */}
                            {contact.personalNote && (
                              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-3">
                                <p className="text-indigo-900 text-xs flex items-start gap-2">
                                  <MessageCircle size={12} className="mt-0.5 shrink-0" />
                                  <span>{contact.personalNote}</span>
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end mb-1">
                                <p className="text-2xl text-slate-900">{contact.matchScore}</p>
                                <Award className="text-indigo-500" size={18} />
                              </div>
                              <p className="text-xs text-slate-600">Match Score</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end mb-1">
                                <p className="text-2xl text-emerald-600">{contact.relationshipScore}</p>
                                <Heart size={18} className="text-emerald-500" />
                              </div>
                              <p className="text-xs text-slate-600">Relationship</p>
                            </div>
                          </div>
                        </div>

                        {/* Sectors */}
                        <div className="flex items-center gap-2 mb-3">
                          {contact.sectors.map((sector) => (
                            <Badge key={sector} variant="outline" className="text-xs border-slate-300">
                              {sector}
                            </Badge>
                          ))}
                        </div>

                        {/* Two Column Layout for Stats and Insights */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          {/* Stats Grid */}
                          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                            <h4 className="text-xs text-slate-600 mb-2">Performance Metrics</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-slate-600 text-xs mb-1">Deals Shared</p>
                                <p className="text-slate-900">{contact.stats.dealsShared}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs mb-1">Acceptance</p>
                                <p className="text-emerald-600">{contact.stats.acceptanceRate}%</p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs mb-1">Shared Back</p>
                                <p className="text-indigo-600">{contact.stats.dealsSharedBack}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs mb-1">Response</p>
                                <p className="text-slate-900 text-sm">{contact.stats.responseTime}</p>
                              </div>
                            </div>
                          </div>

                          {/* Deal Preferences */}
                          <div className="bg-violet-50 rounded-lg p-3 space-y-2">
                            <h4 className="text-xs text-violet-700 mb-2">Deal Preferences</h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-start gap-2">
                                <Target size={12} className="text-violet-600 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-slate-600">Deal Size</p>
                                  <p className="text-slate-900">{contact.preferredDealSize}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <TrendingUp size={12} className="text-violet-600 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-slate-600">Best Sector</p>
                                  <p className="text-slate-900">{contact.strongestSector}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Co-Investments Section */}
                        {contact.coInvestments.length > 0 && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                            <h4 className="text-xs text-emerald-700 mb-2 flex items-center gap-1">
                              <Handshake size={12} />
                              Co-Investments Together ({contact.coInvestments.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {contact.coInvestments.slice(0, 3).map((investment, idx) => (
                                <Badge key={idx} className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                                  {investment}
                                </Badge>
                              ))}
                              {contact.coInvestments.length > 3 && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                                  +{contact.coInvestments.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Recent Activity Alert */}
                        {contact.recentActivity && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3">
                            <p className="text-blue-900 text-xs flex items-start gap-2">
                              <Clock size={12} className="mt-0.5 shrink-0" />
                              <span><strong>Recent:</strong> {contact.recentActivity}</span>
                            </p>
                          </div>
                        )}

                        {/* Response Pattern */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3">
                          <p className="text-orange-900 text-xs flex items-start gap-2">
                            <AlertCircle size={12} className="mt-0.5 shrink-0" />
                            <span><strong>Tip:</strong> {contact.responsePattern}</span>
                          </p>
                        </div>

                        {/* AI Insights */}
                        <div className="space-y-1">
                          <h4 className="text-xs text-slate-600 mb-2">AI Insights</h4>
                          {contact.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-indigo-600 rounded-full mt-2 shrink-0" />
                              <p className="text-slate-700 text-xs">{insight}</p>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-3" />

                        {/* Bottom Info Bar */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4 text-slate-600">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              Last: {contact.stats.lastInteraction}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Responds in {contact.stats.responseTime}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                            View Full Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <Users className="mx-auto text-slate-400 mb-4" size={48} />
                  <p className="text-slate-600">No contacts match your search</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Share Action */}
            <Card className="border-indigo-200 br-linear-to-br from-indigo-50 to-white">
              <CardHeader>
                <CardTitle className="text-base">Ready to Share?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 text-sm">
                  Select the best contacts from your network to share this deal with based on AI-powered matching.
                </p>
                <Button
                  onClick={() => setShowSelectRecipients(true)}
                  className="w-full br-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Send size={16} className="mr-2" />
                  Select & Share
                </Button>
              </CardContent>
            </Card>

            {/* Personalized Network Stats */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={18} />
                  Your Network Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="br-linear-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-3">
                  <p className="text-indigo-900 text-sm mb-2">This Month's Highlights</p>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>18 deals shared • 13 responses received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      <span>3 new co-investments closed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Sarah Chen shared 4 deals with you</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">Total Network</span>
                    <span className="text-slate-900">{mockContacts.length} VCs</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">Active Partners</span>
                    <span className="text-emerald-600">4 active</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">Strong Relationships</span>
                    <span className="text-indigo-600">3 contacts</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-slate-700 text-sm mb-3">Network Acceptance Rate</p>
                  <div className="flex items-center gap-3">
                    <Progress value={72} className="flex-1" />
                    <span className="text-slate-900">72%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">+8% vs last quarter</p>
                </div>
              </CardContent>
            </Card>

            {/* Relationship Insights */}
            <Card className="border-emerald-200 br-linear-to-br from-emerald-50 to-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="text-emerald-600" size={18} />
                  Relationship Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-slate-700 text-sm">
                      You and Sarah Chen have 5 co-investments with 80% success rate
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Handshake className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-slate-700 text-sm">
                      Michael Rodriguez introduced you to 2 portfolio companies
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-slate-700 text-sm">
                      Emily Thompson engaged with 3 of your last 5 shares
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="text-yellow-500" size={18} />
                  Top Performers This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockContacts.slice(0, 3).map((contact, idx) => (
                  <div key={contact.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Badge className={`${
                      idx === 0 ? "bg-yellow-100 text-yellow-700" :
                      idx === 1 ? "bg-slate-200 text-slate-700" :
                      "bg-orange-100 text-orange-700"
                    } border-0 text-xs w-6 h-6 flex items-center justify-center p-0`}>
                      {idx + 1}
                    </Badge>
                    <div className="w-10 h-10 br-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs shrink-0">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 text-sm truncate">{contact.name}</p>
                      <p className="text-slate-600 text-xs">{contact.stats.acceptanceRate}% • {contact.stats.dealsSharedBack} shared back</p>
                    </div>
                    <Heart className={`${
                      contact.relationshipScore >= 90 ? "text-emerald-500" : "text-slate-400"
                    } shrink-0`} size={16} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border-indigo-200 br-linear-to-br from-indigo-50 to-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={18} />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className="text-indigo-900 text-sm mb-2">For this AI/FinTech deal:</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                      <p className="text-slate-700 text-xs">
                        <strong>Sarah Chen</strong> - 96% match, strong AI focus, fast responder
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                      <p className="text-slate-700 text-xs">
                        <strong>Michael Rodriguez</strong> - 92% match, FinTech specialist, high acceptance
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                      <p className="text-slate-700 text-xs">
                        <strong>Emily Thompson</strong> - Just shared 2 deals with you, good reciprocity
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-900 flex items-start gap-2">
                    <AlertCircle size={12} className="mt-0.5 shrink-0" />
                    <span>Consider waiting 3 days before contacting David Park - he's currently reviewing a similar deal</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}