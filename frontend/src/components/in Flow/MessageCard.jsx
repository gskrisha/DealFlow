// frontend/src/components/MessageCard.jsx
import React from "react";
import { Mail, Linkedin, MessageCircle, TrendingUp, DollarSign, Building2, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function MessageCard({ message }) {
  const getSourceIcon = (source) => {
    switch (source) {
      case "linkedin":
        return <Linkedin size={16} className="text-blue-600" />;
      case "email":
        return <Mail size={16} className="text-purple-600" />;
      case "whatsapp":
        return <MessageCircle size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case "linkedin":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "email":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "whatsapp":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getAIScoreColor = (score) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-yellow-600";
    return "text-slate-600";
  };

  const listItem = {
    hidden: { opacity: 0, y: 10, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  const cardHover = { whileHover: { y: -2, transition: { duration: 0.2 } } };

  return (
    <motion.div variants={listItem} className="p-6">
      <motion.div {...cardHover} className={cn(
        "hover:bg-slate-50 transition-all cursor-pointer group border-l-4",
        message.isHot ? "border-l-orange-500 bg-linear-to-r from-orange-50 to-transparent" : "border-l-slate-200 hover:border-l-indigo-500"
      )}>
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-3 p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {message.sender}
                  </h3>
                  <Badge className={cn("border text-xs", getSourceColor(message.source))}>
                    <span className="flex items-center gap-1">
                      {getSourceIcon(message.source)}
                      <span className="capitalize">{message.source}</span>
                    </span>
                  </Badge>
                  {message.isHot && (
                    <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white border-0 text-xs animate-pulse">
                      🔥 Hot Deal
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
                  <Building2 size={14} />
                  <span>{message.company}</span>
                  <span className="text-slate-400">•</span>
                  <Clock size={14} />
                  <span>{message.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">AI Score</div>
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                    <div className={cn("text-lg font-semibold", getAIScoreColor(message.aiScore))}>
                      {message.aiScore}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed text-sm">
              {message.summary}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-indigo-50 text-xs">
                {message.sector}
              </Badge>
              {message.fundingAmount && (
                <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 text-xs">
                  <DollarSign size={12} className="mr-1" />
                  ${message.fundingAmount}M
                </Badge>
              )}
              {message.stage && (
                <Badge variant="outline" className="border-violet-300 text-violet-700 bg-violet-50 text-xs">
                  {message.stage}
                </Badge>
              )}
            </div>

            {message.aiInsight && (
              <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-linear-to-r from-violet-50 to-transparent border-l-2 border-l-violet-500 pl-3 py-2 rounded-r">
                <div className="flex items-start gap-2">
                  <TrendingUp size={14} className="text-violet-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-violet-800">{message.aiInsight}</p>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs h-8 shadow-sm">
                View Thread
              </Button>
              <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 text-xs h-8">
                Add Pipeline
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs h-8">
                Archive
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}