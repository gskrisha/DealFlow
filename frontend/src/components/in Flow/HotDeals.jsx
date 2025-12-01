// frontend/src/components/in Flow/HotDeals.jsx
import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { mockMessages } from "./data/mockData";

export function HotDeals() {
  const hotDeals = mockMessages.filter(msg => msg.isHot).slice(0, 5);

  const containerVariants = { show: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="bg-linear-to-br from-white to-orange-50/30 border-orange-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
        <CardHeader className="pb-0 bg-linear-to-r from-orange-50 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Flame className="text-orange-600" size={20} />
            </motion.div>
            <h2 className="text-lg font-semibold text-slate-900">Hot Deals</h2>
          </div>
          <p className="text-sm text-slate-600">AI-identified high-priority opportunities</p>
        </CardHeader>
        
        <CardContent className="p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {hotDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="bg-white border border-orange-200 rounded-xl p-3 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-linear-to-br from-orange-500 to-red-500 text-white rounded-lg w-8 h-8 flex items-center justify-center shrink-0 text-sm font-bold shadow-md"
                  >
                    {index + 1}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 text-sm font-medium mb-0.5 truncate group-hover:text-orange-700 transition-colors">
                      {deal.company}
                    </h3>
                    <p className="text-slate-600 text-xs mb-2 line-clamp-2">{deal.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                        {deal.sector}
                      </Badge>
                      {deal.fundingAmount && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                          ${deal.fundingAmount}M
                        </Badge>
                      )}
                    </div>
                  </div>
                  <motion.div 
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-emerald-100 px-2.5 py-1 rounded-lg text-emerald-700 text-xs font-semibold shrink-0 shadow-sm"
                  >
                    {deal.aiScore}
                  </motion.div>
                </div>
              </motion.div>
            ))}
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button 
                variant="ghost" 
                className="w-full text-orange-700 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors text-sm h-9 mt-2"
              >
                View All Hot Deals
                <ArrowRight size={14} className="ml-auto" />
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}