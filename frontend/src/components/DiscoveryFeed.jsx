import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import {
  Search,
  Filter,
  TrendingUp,
  MapPin,
  Users,
  DollarSign,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { mockStartups } from '../lib/mockData';
import { DealDetailDialog } from './DealDetailDialog';
import { motion } from 'framer-motion';

export function DiscoveryFeed() {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterSector, setFilterSector] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStartups = useMemo(() => {
    return mockStartups.filter((startup) => {
      const matchesSector = filterSector === 'all' || startup.sector === filterSector;
      const matchesStage = filterStage === 'all' || startup.stage === filterStage;
      const matchesSearch =
        searchQuery === '' ||
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesStage && matchesSearch;
    });
  }, [filterSector, filterStage, searchQuery]);

  const sectors = useMemo(() => Array.from(new Set(mockStartups.map((s) => s.sector))), []);
  const stages = useMemo(() => Array.from(new Set(mockStartups.map((s) => s.stage))), []);

  const listItem = {
    hidden: { opacity: 0, y: 10, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } }
  };

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
          <h1 className="text-4xl font-semibold mb-1">Smart Discovery</h1>
          <p className="text-slate-500">AI-curated startups matching your investment thesis</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm bg-white/40 border-white/30 shadow-sm">
            Last updated: 2 hours ago
          </Badge>

          <Button
            className="gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            Refresh Feed
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border border-slate-200/70 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-4">

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search startups by name or keyword..."
                  className="pl-10 bg-white/70 backdrop-blur border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sector Filter */}
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-full md:w-[200px] bg-white/70 backdrop-blur">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Stage Filter */}
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-full md:w-[200px] bg-white/70 backdrop-blur">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Misc Filter */}
              <Button variant="outline" size="icon" className="self-start shadow-sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">Showing {filteredStartups.length} startups</p>
        <Select defaultValue="score-high">
          <SelectTrigger className="w-[200px] bg-white/70 backdrop-blur">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score-high">Highest Score</SelectItem>
            <SelectItem value="score-low">Lowest Score</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="traction">Best Traction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Startup Cards */}
      <div className="grid gap-5">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {filteredStartups.map((startup) => (
            <motion.div key={startup.id} variants={listItem}>
              
              <Card className="
                bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-slate-200/60
                hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all mb-8
              ">
                <CardContent className="p-6">
                  <div className="flex gap-6">

                    {/* Score */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="shrink-0"
                    >
                      <div className="
                        w-20 h-20 rounded-2xl shadow-md
                        bg-linear-to-br from-blue-500 to-purple-600
                        flex flex-col items-center justify-center text-white
                      ">
                        <div className="text-3xl font-semibold">{startup.score}</div>
                        <div className="text-xs opacity-90">Score</div>
                      </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{startup.name}</h3>
                            <Badge variant="outline" className="text-xs">{startup.sector}</Badge>
                            <Badge variant="outline" className="text-xs">{startup.stage}</Badge>

                            {startup.unicornProbability > 70 && (
                              <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs">
                                🦄 {startup.unicornProbability}%
                              </Badge>
                            )}
                          </div>

                          <p className="text-slate-600 mb-3 line-clamp-2">{startup.tagline}</p>

                          {/* Metadata Row */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {startup.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" /> {startup.founders.length} founders
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> {startup.metrics.revenue}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" /> {startup.metrics.growth}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
                      >
                        {['team', 'traction', 'market', 'fit'].map((key) => (
                          <div
                            key={key}
                            className="bg-white/60 backdrop-blur rounded-lg p-2 text-center shadow-sm"
                          >
                            <div className="text-sm text-slate-600 mb-1 capitalize">
                              {key}
                            </div>
                            <div className="text-lg font-medium">
                              {startup.scoreBreakdown[key]}
                            </div>
                          </div>
                        ))}
                      </motion.div>

                      {/* Signals */}
                      <div className="mb-4">
                        <div className="text-sm text-slate-600 mb-2">Key Signals:</div>
                        <div className="flex flex-wrap gap-2">
                          {startup.signals.map((signal, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-green-50 text-green-700 border-green-200 text-xs shadow-sm"
                            >
                              {signal}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Investor Fit */}
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 shadow-sm">
                        <div className="text-sm">
                          <span className="text-blue-700 font-medium">💡 Investor Fit: </span>
                          <span className="text-slate-700">{startup.investorFit}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedDeal(startup)}
                          className="gap-2 shadow-md"
                        >
                          View Full Analysis
                        </Button>

                        <Button variant="outline" className="shadow-sm">
                          Generate Outreach Email
                        </Button>

                        <Button variant="ghost" size="icon" aria-label="Open external link">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Expanded Deal Details */}
      {selectedDeal && (
        <DealDetailDialog
          startup={selectedDeal}
          open={!!selectedDeal}
          onOpenChange={(open) => !open && setSelectedDeal(null)}
        />
      )}

    </div>
  );
}
