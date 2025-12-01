// src/components/DealTracker.jsx
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  LayoutGrid,
  List,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { mockStartups } from '../lib/mockData';
import { motion } from 'framer-motion';

export function DealTracker() {
  const dealsByStage = {
    new: mockStartups.filter(s => s.dealStatus === 'new'),
    contacted: mockStartups.filter(s => s.dealStatus === 'contacted'),
    meeting: mockStartups.filter(s => s.dealStatus === 'meeting'),
    diligence: mockStartups.filter(s => s.dealStatus === 'diligence'),
    passed: mockStartups.filter(s => s.dealStatus === 'passed')
  };

  const stages = [
    { key: 'new', label: 'New', icon: Eye, color: 'bg-blue-500' },
    { key: 'contacted', label: 'Contacted', icon: Clock, color: 'bg-purple-500' },
    { key: 'meeting', label: 'Meeting', icon: CheckCircle2, color: 'bg-green-500' },
    { key: 'diligence', label: 'Due Diligence', icon: LayoutGrid, color: 'bg-orange-500' },
    { key: 'passed', label: 'Passed', icon: XCircle, color: 'bg-gray-400' }
  ];

  const container = { show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600">Manage your entire deal pipeline in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hover:bg-slate-100">
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-slate-100">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 md:grid-cols-5 gap-4"
      >
        {stages.map((stage) => {
          const Icon = stage.icon;
          const count = dealsByStage[stage.key].length;
          return (
            <motion.div key={stage.key} variants={item}>
              <Card className="hover:shadow-xl transition-shadow rounded-xl border-slate-200">
                <CardContent className="p-6 flex items-center gap-2">
                  <div
                    className={`w-12 h-12 ${stage.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold leading-none pb-4">{count}</div>
                  <div className="text-sm text-slate-600 mt-1 pb-4">{stage.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const deals = dealsByStage[stage.key];

          return (
            <div key={stage.key} className="space-y-3">
              {/* Column Title */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="text-sm font-medium">{stage.label}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {deals.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {deals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: index * 0.03 }}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-md transition-shadow rounded-xl border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium truncate flex-1">{deal.name}</h4>
                          <Badge className="ml-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs shadow-sm">
                            {deal.score}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{deal.tagline}</p>

                        <div className="flex items-center gap-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {deal.sector}
                          </Badge>
                        </div>

                        <div className="text-xs text-slate-500">{deal.lastUpdated}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {deals.length === 0 && (
                  <div className="text-center py-8 text-sm text-slate-400">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { startup: 'Quantum Health AI', action: 'Moved to New', user: 'AI Discovery', time: '2 hours ago', type: 'new' },
              { startup: 'SupplyChain.ai', action: 'Moved to Contacted', user: 'John Doe', time: '5 hours ago', type: 'progress' },
              { startup: 'ClimateCarbon', action: 'Meeting scheduled for tomorrow', user: 'John Doe', time: '6 hours ago', type: 'meeting' },
              { startup: 'FinFlow', action: 'Started due diligence', user: 'Sarah Chen', time: '1 day ago', type: 'diligence' },
              { startup: 'EduTech Pro', action: 'Marked as passed', user: 'John Doe', time: '2 days ago', type: 'passed' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.04 }}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'new'
                      ? 'bg-blue-500'
                      : activity.type === 'progress'
                      ? 'bg-purple-500'
                      : activity.type === 'meeting'
                      ? 'bg-green-500'
                      : activity.type === 'diligence'
                      ? 'bg-orange-500'
                      : 'bg-gray-400'
                  }`}
                />

                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.startup}</span> – {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activity.user} · {activity.time}
                  </p>
                </div>

                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
