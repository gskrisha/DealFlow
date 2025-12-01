// frontend/src/components/in Flow/FilterBar.jsx
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filter } from "lucide-react";

export function FilterBar({ selectedSector, setSelectedSector, sortBy, setSortBy }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50 hover:bg-slate-75 transition-colors"
    >
      <Filter className="text-slate-500" size={18} />
      
      <Select value={selectedSector} onValueChange={setSelectedSector}>
        <SelectTrigger className="w-[180px] bg-white border-slate-300 text-slate-900 hover:border-indigo-400 transition-colors rounded-lg">
          <SelectValue placeholder="Filter by Sector" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sectors</SelectItem>
          <SelectItem value="ai">AI/ML</SelectItem>
          <SelectItem value="fintech">FinTech</SelectItem>
          <SelectItem value="healthtech">HealthTech</SelectItem>
          <SelectItem value="saas">SaaS</SelectItem>
          <SelectItem value="blockchain">Blockchain</SelectItem>
          <SelectItem value="climate">Climate Tech</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[200px] bg-white border-slate-300 text-slate-900 hover:border-indigo-400 transition-colors rounded-lg">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ai-priority">🤖 AI Priority</SelectItem>
          <SelectItem value="recent">⏰ Most Recent</SelectItem>
          <SelectItem value="funding">💰 Funding Amount</SelectItem>
          <SelectItem value="sector">📊 Sector</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}