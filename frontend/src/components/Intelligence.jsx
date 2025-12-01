import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Network,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  FileText,
  Activity,
  Target
} from 'lucide-react';
import { mockStartups } from '../lib/mockData';
import { motion } from 'framer-motion';

export function Intelligence() {
  // sort unicorn candidates descending
  const topUnicornCandidates = mockStartups
    .filter((s) => s.unicornProbability)
    .sort((a, b) => (b.unicornProbability || 0) - (a.unicornProbability || 0));

  const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Deal Intelligence</h1>
        <p className="text-slate-500">AI-powered insights and predictive analytics</p>
      </div>

      {/* Unicorn Predictions */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
        <Card className="bg-linear-to-br from-yellow-50 to-orange-50 border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              <CardTitle>Unicorn Probability Predictions</CardTitle>
            </div>
            <CardDescription>
              ML model predictions based on growth trajectory, team, and market dynamics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUnicornCandidates.map((startup) => (
                <motion.div key={startup.id} variants={fadeUp} className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🦄</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium">{startup.name}</h3>
                        <Badge className="text-sm bg-slate-100">{startup.sector}</Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">Unicorn Probability</span>
                          <span className="text-2xl font-semibold text-transparent bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text">
                            {startup.unicornProbability}%
                          </span>
                        </div>
                        <Progress value={startup.unicornProbability} className="h-3" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600">Growth</div>
                          <div className="text-green-600 font-medium">{startup.metrics.growth}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Revenue</div>
                          <div className="font-medium">{startup.metrics.revenue}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">AI Score</div>
                          <div className="font-medium text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                            {startup.score}/100
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">View Analysis</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Network Intelligence */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                <CardTitle>Network Intelligence</CardTitle>
              </div>
              <CardDescription>Mutual connections and portfolio synergies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStartups.slice(0, 5).map((startup) => (
                  <motion.div key={startup.id} variants={fadeUp} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white shrink-0">
                      {startup.name.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate mb-1">{startup.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="w-3 h-3" />
                        <span>{startup.mutualConnections} mutual connections</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View Graph</Button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-2">Portfolio Synergy Detected:</p>
                    <p>Quantum Health AI has connections to 3 of your portfolio companies. Strong potential for strategic partnerships.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Momentum Tracking */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <CardTitle>Momentum Signals</CardTitle>
              </div>
              <CardDescription>Real-time tracking of growth indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    startup: 'Quantum Health AI',
                    signal: 'Team expansion',
                    detail: '5 senior hires from Google Health in past month',
                    trend: 'up',
                    importance: 'high'
                  },
                  {
                    startup: 'SupplyChain.ai',
                    signal: 'Customer momentum',
                    detail: '3 Fortune 500 customers signed this quarter',
                    trend: 'up',
                    importance: 'high'
                  },
                  {
                    startup: 'DevSecure',
                    signal: 'Community growth',
                    detail: 'GitHub stars increased 200% in 30 days',
                    trend: 'up',
                    importance: 'medium'
                  },
                  {
                    startup: 'ClimateCarbon',
                    signal: 'Regulatory approval',
                    detail: 'EU carbon credit certification received',
                    trend: 'up',
                    importance: 'high'
                  },
                  {
                    startup: 'FinFlow',
                    signal: 'Partnership',
                    detail: 'Stripe partnership announced',
                    trend: 'up',
                    importance: 'medium'
                  }
                ].map((item, index) => (
                  <motion.div key={index} variants={fadeUp} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.importance === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${item.importance === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">{item.startup}</h4>
                          <Badge variant={item.importance === 'high' ? 'default' : 'secondary'} className="text-xs">
                            {item.signal}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{item.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Summaries */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>LLM-Generated Summaries</CardTitle>
            </div>
            <CardDescription>1-pager summaries for quick review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mockStartups.slice(0, 4).map((startup) => (
                <motion.div key={startup.id} variants={fadeUp} className="border rounded-lg p-4 space-y-3 bg-white/60 backdrop-blur">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="mb-1 font-medium">{startup.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{startup.sector}</Badge>
                        <Badge className="text-xs bg-linear-to-r from-blue-600 to-purple-600 text-white">{startup.score}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-3">{startup.description}</p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-3 h-3 mr-2" />
                      View 1-Pager
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Sparkles className="w-3 h-3 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sector Trends */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <CardTitle>Sector Intelligence</CardTitle>
            </div>
            <CardDescription>Market trends and investment opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  sector: 'HealthTech',
                  startups: 8,
                  avgScore: 89,
                  trend: '+15% deal flow',
                  hot: true
                },
                {
                  sector: 'Enterprise SaaS',
                  startups: 12,
                  avgScore: 85,
                  trend: '+8% deal flow',
                  hot: false
                },
                {
                  sector: 'FinTech',
                  startups: 6,
                  avgScore: 82,
                  trend: '+22% deal flow',
                  hot: true
                }
              ].map((item, index) => (
                <motion.div key={index} variants={fadeUp} className={`p-4 border rounded-lg ${
                  item.hot ? 'bg-linear-to-br from-orange-50 to-red-50 border-orange-200' : 'bg-slate-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium">{item.sector}</h4>
                    {item.hot && (
                      <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white text-xs">🔥 Hot</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Startups tracked</span>
                      <span>{item.startups}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Avg. AI Score</span>
                      <span className="text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        {item.avgScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">30-day trend</span>
                      <span className="text-green-600">{item.trend}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
