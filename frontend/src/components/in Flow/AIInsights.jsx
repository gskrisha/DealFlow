// frontend/src/components/in Flow/AIInsights.jsx
import { motion } from "framer-motion";
import { Sparkles, Brain, Target, Zap } from "lucide-react";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader } from "../ui/card";

export function AIInsights() {
  const insights = [
    { text: "You engage more with B2B SaaS companies raising Series A", icon: "🎯" },
    { text: 'Deals mentioning "AI-powered" have 2.3x higher open rate', icon: "📈" },
    { text: "You prefer warm intros from Sarah Chen and Michael Ross", icon: "🤝" },
  ];

  const containerVariants = { show: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="bg-linear-to-br from-white to-violet-50/30 border-violet-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
        <CardHeader className="pb-0 bg-linear-to-r from-violet-50 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
              <Brain className="text-violet-600" size={20} />
            </motion.div>
            <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
          </div>
          <p className="text-sm text-slate-600">Learning from your preferences</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Trending Sectors */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-violet-600" size={16} />
              <h3 className="text-slate-900 text-sm font-semibold">Trending Sectors</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "AI/ML", value: 34 },
                { label: "FinTech", value: 28 },
                { label: "HealthTech", value: 22 }
              ].map((sector, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-700 text-sm font-medium">{sector.label}</span>
                    <motion.span 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-violet-700 text-sm font-semibold"
                    >
                      {sector.value}%
                    </motion.span>
                  </div>
                  <Progress value={sector.value} className="h-2 bg-violet-100 rounded-full" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Learning Insights */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Sparkles className="text-violet-600" size={16} />
              </motion.div>
              <h3 className="text-slate-900 text-sm font-semibold">What I've Learned</h3>
            </div>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-linear-to-r from-violet-50 to-transparent border border-violet-200 rounded-lg p-3 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                      className="text-lg shrink-0 mt-0.5"
                    >
                      {insight.icon}
                    </motion.div>
                    <p className="text-slate-700 text-xs leading-relaxed group-hover:text-slate-900 transition-colors">
                      {insight.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-linear-to-br from-violet-100 via-violet-50 to-transparent border border-violet-200 rounded-xl p-4 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="group hover:bg-white/50 p-2 rounded-lg transition-colors">
                <p className="text-slate-600 text-xs mb-1 font-medium">Avg Response Time</p>
                <motion.p 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-slate-900 font-semibold"
                >
                  2.3h
                </motion.p>
              </div>
              <div className="group hover:bg-white/50 p-2 rounded-lg transition-colors">
                <p className="text-slate-600 text-xs mb-1 font-medium">Deal Velocity</p>
                <motion.p 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                  className="text-emerald-600 font-semibold"
                >
                  +18%
                </motion.p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}