// frontend/src/components/in Flow/PipelineStages.jsx
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

export function PipelineStages() {
  const stages = [
    { name: "New Submissions", count: 24, color: "bg-blue-500", icon: "📥" },
    { name: "Under Review", count: 18, color: "bg-yellow-500", icon: "👀" },
    { name: "Due Diligence", count: 12, color: "bg-orange-500", icon: "🔍" },
    { name: "Partner Review", count: 8, color: "bg-purple-500", icon: "🤝" },
    { name: "Term Sheet", count: 3, color: "bg-emerald-500", icon: "📄" },
    { name: "Closed", count: 47, color: "bg-slate-400", icon: "✅" },
  ];

  const containerVariants = { show: { transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-0.5">Pipeline Overview</h2>
          <p className="text-sm text-slate-600">Track deals through your investment process</p>
        </CardHeader>
        
        <CardContent className="space-y-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-0 divide-y divide-slate-200"
          >
            {stages.map((stage, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="p-3 hover:bg-linear-to-r hover:from-slate-50 to-transparent transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`w-2.5 h-2.5 rounded-full ${stage.color}`}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors font-medium">
                      {stage.name}
                    </span>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge className="bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200 text-xs shadow-sm">
                      {stage.count}
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 pt-4 border-t border-slate-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">Total Active Deals</span>
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <span className="text-lg font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  65
                </span>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
