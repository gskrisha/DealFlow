// frontend/src/components/in Flow/QuickActions.jsx
import { motion } from "framer-motion";
import { Plus, Upload, Users, Calendar, FileText, TrendingUp, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

export function QuickActions({ onUploadDeck, onCircleShare }) {
  const actions = [
    { name: "Circle Share", icon: Share2, color: "bg-linear-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800", onClick: onCircleShare },
    { name: "Upload Deck", icon: Upload, color: "bg-linear-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800", onClick: onUploadDeck },
    { name: "Schedule Call", icon: Calendar, color: "bg-linear-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" },
    { name: "Updates", icon: TrendingUp, color: "bg-linear-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800" },
  ];

  const containerVariants = { show: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-0.5">Quick Actions</h2>
          <p className="text-sm text-slate-600">Frequently used tools</p>
        </CardHeader>
        
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {actions.map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.button
                  onClick={action.onClick}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`${action.color} text-white w-full rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-md font-medium text-sm group`}
                >
                  <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <action.icon size={20} />
                  </motion.div>
                  <span className="group-hover:scale-105 transition-transform">{action.name}</span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}