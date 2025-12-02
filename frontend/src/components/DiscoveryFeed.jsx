import { useState, useMemo, useCallback } from 'react';
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
  Sparkles,
  Loader2,
  RefreshCw,
  WifiOff,
  Zap,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useStartups } from '../lib/hooks';
import { useDiscovery } from '../lib/DiscoveryContext';
import { DealDetailDialog } from './DealDetailDialog';
import { motion } from 'framer-motion';

export function DiscoveryFeed() {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterSector, setFilterSector] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBannerDismissed, setFilterBannerDismissed] = useState(false);

  // Fetch startups from API (with mock fallback)
  const { startups, isLoading, error, refetch, useMock } = useStartups();
  
  // Get discovered startups from context
  const { 
    discoveredStartups, 
    discoveryInProgress, 
    jobProgress, 
    jobError, 
    jobStatus, 
    passOnStartup, 
    saveDealFromDiscovery,
    filtersMatched,
    appliedFilters
  } = useDiscovery();
  
  // Use discovered startups if available, otherwise use regular startups
  const displayStartups = discoveredStartups.length > 0 ? discoveredStartups : startups;

  const filteredStartups = useMemo(() => {
    return displayStartups.filter((startup) => {
      const matchesSector = filterSector === 'all' || startup.sector === filterSector;
      const matchesStage = filterStage === 'all' || startup.stage === filterStage;
      const matchesSearch =
        searchQuery === '' ||
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesStage && matchesSearch;
    });
  }, [displayStartups, filterSector, filterStage, searchQuery]);

  const sectors = useMemo(() => Array.from(new Set(displayStartups.map((s) => s.sector))), [displayStartups]);
  const stages = useMemo(() => Array.from(new Set(displayStartups.map((s) => s.stage))), [displayStartups]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSaveDeal = async (startup) => {
    await saveDealFromDiscovery(startup);
  };

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
          {useMock && (
            <Badge variant="outline" className="text-sm bg-amber-50 border-amber-200 text-amber-700 shadow-sm">
              <WifiOff className="w-3 h-3 mr-1" />
              Demo Mode
            </Badge>
          )}
          <Badge variant="outline" className="text-sm bg-white/40 border-white/30 shadow-sm">
            {discoveredStartups.length > 0 ? `${discoveredStartups.length} discovered` : 'Ready to discover'}
          </Badge>

          {discoveryInProgress && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
              <Loader2 className="w-3 h-3 animate-spin" />
              Discovering... {jobProgress}%
            </div>
          )}

          <Button
            onClick={handleRefresh}
            disabled={isLoading || discoveryInProgress}
            className="gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isLoading ? 'Refreshing...' : 'Refresh Feed'}
          </Button>
        </div>
      </motion.div>

      {/* Discovery Progress */}
      {discoveryInProgress && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">AI Discovery in Progress</h3>
                  <p className="text-sm text-slate-600 mt-1">Analyzing and fetching startups from multiple sources...</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">Progress</span>
                      <span className="text-xs font-bold text-blue-600">{jobProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${jobProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error Message */}
      {jobError && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-red-200 bg-red-50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Discovery Error</p>
                <p className="text-sm text-red-700">{jobError}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600">Loading startups...</p>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-600 mb-2">No startups found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
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
                              <MapPin className="w-4 h-4" /> {startup.location || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" /> {startup.founders?.length || 0} founders
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> {startup.metrics?.revenue || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" /> {startup.metrics?.growth || 'N/A'}
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
                              {startup.scoreBreakdown?.[key] || Math.floor(60 + Math.random() * 30)}
                            </div>
                          </div>
                        ))}
                      </motion.div>

                      {/* Signals */}
                      <div className="mb-4">
                        <div className="text-sm text-slate-600 mb-2">Key Signals:</div>
                        <div className="flex flex-wrap gap-2">
                          {(startup.signals || [startup.sector, startup.stage, startup.source].filter(Boolean)).map((signal, index) => (
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
                          <span className="text-slate-700">{startup.investorFit || `Strong match in ${startup.sector || 'this sector'}`}</span>
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

                        {discoveredStartups.length > 0 && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="gap-1"
                              onClick={() => handleSaveDeal(startup)}
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="gap-1"
                              onClick={() => passOnStartup(startup.id)}
                            >
                              <X className="w-4 h-4" />
                              Pass
                            </Button>
                          </>
                        )}

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
        )}
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
