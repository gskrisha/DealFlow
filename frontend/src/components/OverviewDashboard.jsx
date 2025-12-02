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
  ArrowRight,
  Loader2,
  WifiOff,
  Zap,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useStartups, useStartupStats, usePipeline } from '../lib/hooks';
import { useDiscovery } from '../lib/DiscoveryContext';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

export function OverviewDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { startups, isLoading: startupsLoading, useMock } = useStartups();
  const { stats, isLoading: statsLoading } = useStartupStats();
  const { pipeline, isLoading: pipelineLoading } = usePipeline();
  const { discoveredStartups, startDiscovery, discoveryInProgress, jobProgress, jobError, passOnStartup, filtersMatched, appliedFilters } = useDiscovery();
  
  const [discoveryDialogOpen, setDiscoveryDialogOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState(['yc']);
  const [discoveryStarting, setDiscoveryStarting] = useState(false);
  const [filterBannerDismissed, setFilterBannerDismissed] = useState(false);

  // Use discovered startups if available, otherwise use regular startups
  const displayStartups = discoveredStartups.length > 0 ? discoveredStartups : startups;
  
  // Get top 5 deals by score
  const topDeals = [...displayStartups]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Calculate stats from data
  const dashboardStats = [
    { 
      label: 'New Deals Today', 
      value: displayStartups.filter(s => s.dealStatus === 'new').length.toString() || '0', 
      change: '+12%', 
      trend: 'up', 
      icon: Target 
    },
    { 
      label: 'High Score (>90)', 
      value: displayStartups.filter(s => s.score >= 90).length.toString() || '0', 
      change: '+3', 
      trend: 'up', 
      icon: Sparkles 
    },
    { 
      label: 'Meetings Scheduled', 
      value: displayStartups.filter(s => s.dealStatus === 'meeting').length.toString() || '0', 
      change: '+2', 
      trend: 'up', 
      icon: Users 
    },
    { 
      label: 'Response Rate', 
      value: displayStartups.length > 0 ? Math.round((displayStartups.filter(s => s.dealStatus === 'contacted').length / displayStartups.length) * 100) + '%' : '0%', 
      change: '+5%', 
      trend: 'up', 
      icon: Mail 
    }
  ];

  const recentActivity = [
    { type: 'discovery', title: topDeals[0]?.name || 'Discovery Pending', description: 'New startup discovered', time: '2h ago', score: topDeals[0]?.score || null },
    { type: 'response', title: 'Awaiting Responses', description: 'Outreach in progress', time: '4h ago' },
    { type: 'meeting', title: 'Schedule Meeting', description: 'Ready for next steps', time: '6h ago' },
    { type: 'signal', title: 'Market Activity', description: 'Monitor opportunities', time: '8h ago' }
  ];

  // Calculate pipeline stages from data
  const pipelineStages = [
    { stage: 'New Discoveries', count: displayStartups.filter(s => s.dealStatus === 'new').length, total: 50, color: 'from-blue-500 to-blue-400' },
    { stage: 'Contacted', count: displayStartups.filter(s => s.dealStatus === 'contacted').length, total: 50, color: 'from-purple-500 to-purple-400' },
    { stage: 'Meetings Scheduled', count: displayStartups.filter(s => s.dealStatus === 'meeting').length, total: 50, color: 'from-green-500 to-green-400' },
    { stage: 'Due Diligence', count: displayStartups.filter(s => s.dealStatus === 'diligence').length, total: 50, color: 'from-orange-500 to-orange-400' },
    { stage: 'Term Sheet', count: displayStartups.filter(s => s.dealStatus === 'invested').length, total: 50, color: 'from-pink-500 to-pink-400' }
  ];

  const userName = user?.fullName || user?.name || JSON.parse(localStorage.getItem('userData') || '{}')?.name || 'John';

  const handleRunDiscovery = async () => {
    setDiscoveryStarting(true);
    try {
      await startDiscovery({
        sources: selectedSources,
      });
      setDiscoveryDialogOpen(false);
    } catch (error) {
      console.error('Discovery error:', error);
    } finally {
      setDiscoveryStarting(false);
    }
  };

  const isLoading = startupsLoading || statsLoading || discoveryInProgress;

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
          <h1 className="text-4xl font-semibold mb-1">Welcome back, {userName}</h1>
          <p className="text-slate-600">
            Here's what's happening with your deal flow today
            {useMock && (
              <Badge variant="outline" className="ml-2 text-xs bg-amber-50 border-amber-200 text-amber-700">
                <WifiOff className="w-3 h-3 mr-1 inline" />
                Demo Mode
              </Badge>
            )}
          </p>
        </div>
        <Button 
          className="gap-2 shadow-md hover:shadow-lg transition"
          onClick={() => setDiscoveryDialogOpen(true)}
          disabled={discoveryInProgress}
        >
          {discoveryInProgress ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run AI Discovery
            </>
          )}
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
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

      {/* Filter Mismatch Banner */}
      {filtersMatched === false && !filterBannerDismissed && discoveredStartups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-800 font-medium">No exact matches for your thesis filters</p>
            <p className="text-amber-700 text-sm mt-1">
              We couldn't find startups matching your 
              {appliedFilters?.sectors?.length > 0 && (
                <span className="font-medium"> Sector Focus ({appliedFilters.sectors.join(', ')})</span>
              )}
              {appliedFilters?.sectors?.length > 0 && appliedFilters?.stages?.length > 0 && ' or'}
              {appliedFilters?.stages?.length > 0 && (
                <span className="font-medium"> Investment Stages ({appliedFilters.stages.join(', ')})</span>
              )}
              . Showing all available startups instead.
            </p>
            <p className="text-amber-600 text-xs mt-2">
              Tip: Update your thesis in Settings to broaden matching criteria, or explore these opportunities.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="shrink-0 hover:bg-amber-100"
            onClick={() => setFilterBannerDismissed(true)}
          >
            <X className="w-4 h-4 text-amber-600" />
          </Button>
        </motion.div>
      )}

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
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 hover:bg-slate-100"
                onClick={() => onNavigate && onNavigate('discovery')}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                </div>
              ) : topDeals.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No deals found. Run AI Discovery to get started.
                </div>
              ) : (
              topDeals.map((deal, index) => (
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
              ))
              )}
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
              {pipelineLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                </div>
              ) : (
              pipelineStages.map((item) => (
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
              ))
              )}
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

      {/* Discovery Modal */}
      <Dialog open={discoveryDialogOpen} onOpenChange={setDiscoveryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              AI Discovery Configuration
            </DialogTitle>
            <DialogDescription>
              Select data sources and start discovering startups matching your thesis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Data Sources */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Data Sources</label>
              <div className="space-y-2">
                {[
                  { id: 'yc', label: 'Y Combinator', description: 'Latest funded startups' },
                  { id: 'crunchbase', label: 'Crunchbase', description: 'Company data & funding' },
                  { id: 'angellist', label: 'AngelList', description: 'Startup profiles' },
                ].map(source => (
                  <label key={source.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <Checkbox
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSources([...selectedSources, source.id]);
                        } else {
                          setSelectedSources(selectedSources.filter(s => s !== source.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{source.label}</div>
                      <div className="text-xs text-slate-500">{source.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Discovery Progress */}
            {discoveryInProgress && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Discovery in progress</span>
                    <span className="text-sm text-slate-600">{jobProgress}%</span>
                  </div>
                  <Progress value={jobProgress} className="h-2" />
                </div>
                <p className="text-xs text-slate-500">
                  Fetching and analyzing startups from selected sources...
                </p>
              </div>
            )}

            {/* Error Message */}
            {jobError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{jobError}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDiscoveryDialogOpen(false)}
              disabled={discoveryInProgress}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunDiscovery}
              disabled={discoveryInProgress || selectedSources.length === 0}
              className="gap-2"
            >
              {discoveryInProgress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Discovery...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Start Discovery
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
