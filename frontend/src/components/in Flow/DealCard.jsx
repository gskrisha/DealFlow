import React from "react";
import { FileText, Download, Eye, TrendingUp, Building2, Users, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";

export function DealCard({ deal }) {
  const cardHover = { whileHover: { y: -4, transition: { duration: 0.2 } } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div {...cardHover}>
        <Card className="border-slate-200 hover:shadow-lg transition-shadow rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900 text-base">{deal.company}</h3>
                  <Badge className="bg-linear-to-r from-emerald-500 to-green-500 text-white border-0 text-xs shadow-sm">
                    {deal.aiScore}% Match
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    <span>{deal.sector}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{deal.submittedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {deal.thumbnailUrl && (
              <div className="relative mb-4 rounded-xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 aspect-video group cursor-pointer border border-slate-200">
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg font-medium gap-2">
                    <Eye size={14} />
                    View Pitch Deck
                  </Button>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="text-slate-300" size={44} />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-3 right-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md"
                  >
                    {deal.slides || 12} slides
                  </motion.div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200"
              >
                <p className="text-xs text-emerald-700 mb-1 font-medium">Seeking</p>
                <p className="text-slate-900 font-semibold">${deal.fundingAmount}M</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-200"
              >
                <p className="text-xs text-purple-700 mb-1 font-medium">Valuation</p>
                <p className="text-slate-900 font-semibold">${deal.valuation}M</p>
              </motion.div>
            </div>

            <div className="space-y-2 mb-4">
              <Badge variant="outline" className="border-violet-300 text-violet-700 bg-violet-50 text-xs">
                {deal.stage}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Users size={14} />
                <span>{deal.founders?.join(", ") || "Team"}</span>
              </div>
            </div>

            {deal.highlights && deal.highlights.length > 0 && (
              <div className="mb-4 space-y-2">
                {deal.highlights.map((highlight, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-xs"
                  >
                    <TrendingUp size={12} className="text-emerald-600 mt-1 shrink-0" />
                    <span className="text-slate-700">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md text-xs h-8 font-medium">
                <Eye size={14} className="mr-1.5" />
                Review Deal
              </Button>
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 h-8">
                <Download size={14} />
              </Button>
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 h-8">
                <ExternalLink size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
