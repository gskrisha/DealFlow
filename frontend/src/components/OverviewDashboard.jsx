// src/components/OverviewDashboard.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { mockStartups } from '../lib/mockData';
import { motion } from 'framer-motion';

export function OverviewDashboard() {
  const topDeals = mockStartups.slice(0, 5);

  const stats = [
    { label: 'New Deals Today', value: '23', change: '+12%', trend: 'up', icon: Target },
    { label: 'High Score (>90)', value: '8', change: '+3', trend: 'up', icon: Sparkles },
    { label: 'Meetings Scheduled', value: '5', change: '+2', trend: 'up', icon: Users },
    { label: 'Response Rate', value: '68%', change: '+5%', trend: 'up', icon: Mail }
  ];

  const recentActivity = [
    { type: 'discovery', title: 'Quantum Health AI', description: 'New high-score startup discovered', time: '2h ago', score: 94 },
    { type: 'response', title: 'SupplyChain.ai replied', description: 'Founder interested in meeting next week', time: '4h ago' },
    { type: 'meeting', title: 'ClimateCarbon meeting', description: 'First call scheduled for tomorrow 2pm', time: '6h ago' },
    { type: 'signal', title: 'DevSecure momentum shift', description: 'GitHub stars +2K, featured on HN', time: '8h ago' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-semibold mb-1">Welcome back, John</h1>
          <p className="text-slate-600">Here’s what’s happening with your deal flow today</p>
        </div>
        <Button className="gap-2 shadow-md hover:shadow-lg transition">
          <Sparkles className="w-4 h-4" />
          Run AI Discovery
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className="bg-white/70 backdrop-blur-md border border-slate-200 hover:shadow-xl transition rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold mb-1">{stat.value}</div>
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Top 5 Startups */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top 5 Startups Today</CardTitle>
                <CardDescription>Highest scoring deals that match your thesis</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-slate-100">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {topDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="
                    flex items-center gap-4 p-4 
                    border rounded-xl 
                    bg-white/70 backdrop-blur-md
                    hover:shadow-xl hover:bg-slate-50 
                    transition-all
                  "
                >
                  {/* Rank */}
                  <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
                    #{index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="truncate font-semibold">{deal.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {deal.sector}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {deal.stage}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{deal.tagline}</p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {deal.score}
                      </div>
                      <div className="text-xs text-slate-500">AI Score</div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity + Pipeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Card className="rounded-2xl border-slate-200 shadow-md bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across your pipeline</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md
                        ${
                          activity.type === 'discovery'
                            ? 'bg-blue-100'
                            : activity.type === 'response'
                            ? 'bg-green-100'
                            : activity.type === 'meeting'
                            ? 'bg-purple-100'
                            : 'bg-orange-100'
                        }
                      `}
                    >
                      {activity.type === 'discovery' && <Sparkles className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'response' && <Mail className="w-4 h-4 text-green-600" />}
                      {activity.type === 'meeting' && <Users className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'signal' && <TrendingUp className="w-4 h-4 text-orange-600" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        {activity.score && (
                          <Badge className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
                            {activity.score}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pipeline Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <Card className="rounded-2xl border-slate-200 shadow-md bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Pipeline Overview</CardTitle>
              <CardDescription>Deal progression across stages</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {[ 
                { stage: 'New Discoveries', count: 23, total: 50, color: 'from-blue-500 to-blue-400' },
                { stage: 'Contacted', count: 12, total: 50, color: 'from-purple-500 to-purple-400' },
                { stage: 'Meetings Scheduled', count: 5, total: 50, color: 'from-green-500 to-green-400' },
                { stage: 'Due Diligence', count: 3, total: 50, color: 'from-orange-500 to-orange-400' },
                { stage: 'Term Sheet', count: 1, total: 50, color: 'from-pink-500 to-pink-400' }
              ].map((item) => (
                <div key={item.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{item.stage}</span>
                    <span className="text-sm">{item.count} deals</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / item.total) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full bg-linear-to-r ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-blue-200 rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6">
              <Target className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-medium mb-2">Update Thesis</h3>
              <p className="text-sm text-slate-600 mb-4">Refine your investment criteria and scoring preferences</p>
              <Button variant="outline" size="sm">Configure</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6">
              <Mail className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-medium mb-2">Review Outreach</h3>
              <p className="text-sm text-slate-600 mb-4">3 founders responded to your emails this week</p>
              <Button variant="outline" size="sm">View Responses</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-linear-to-br from-orange-50 to-red-50 border-orange-200 rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6">
              <CheckCircle2 className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-medium mb-2">Weekly Report</h3>
              <p className="text-sm text-slate-600 mb-4">Your deal flow summary is ready for review</p>
              <Button variant="outline" size="sm">Download</Button>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
