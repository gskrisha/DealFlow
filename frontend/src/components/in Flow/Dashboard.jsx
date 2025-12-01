// frontend/src/components/in Flow/Dashboard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageFeed } from "./MessageFeed";
import { HotDeals } from "./HotDeals";
import { AIInsights } from "./AIInsights";
import { FilterBar } from "./FilterBar";
import { LogoScroll } from "./LogoScroll";
import { DealCard } from "./DealCard";
import { PipelineStages } from "./PipelineStages";
import { QuickActions } from "./QuickActions";
import { UploadDeckPage } from "./UploadDeckPage";
import { CircleSharePage } from "./CircleSharePage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Zap, TrendingUp, Sparkles, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { mockDeals } from "./data/mockDeals";

export function Dashboard() {
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [sortBy, setSortBy] = useState("ai-priority");
  const [showUploadDeck, setShowUploadDeck] = useState(false);
  const [showCircleShare, setShowCircleShare] = useState(false);

  if (showUploadDeck) {
    return <UploadDeckPage onClose={() => setShowUploadDeck(false)} />;
  }

  if (showCircleShare) {
    return <CircleSharePage onClose={() => setShowCircleShare(false)} />;
  }

  // Motion variants
  const containerVariants = { show: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };
  const headerVariants = { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 } };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
         <LogoScroll />
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="initial"
        animate="animate"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-semibold mb-1">In Bound Deals</h1>
          <p className="text-slate-500">Incoming opportunities and investor communications</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition"
            onClick={() => setShowUploadDeck(true)}
          >
            <Mail className="w-4 h-4" />
            Upload Deck
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowCircleShare(true)}
          >
            <Sparkles className="w-4 h-4" />
            Share
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-md border border-indigo-200 hover:shadow-xl transition rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Unread Messages</div>
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-1">247</div>
              <div className="text-sm text-green-600">+28 this week</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-md border border-emerald-200 hover:shadow-xl transition rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Hot Deals</div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-1">18</div>
              <div className="text-sm text-green-600">+6 this week</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-md border border-violet-200 hover:shadow-xl transition rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">AI Confidence</div>
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-1">94%</div>
              <div className="text-sm text-green-600">+2% this week</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-md border border-orange-200 hover:shadow-xl transition rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Response Rate</div>
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-1">72%</div>
              <div className="text-sm text-green-600">+5% vs last month</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Message Feed */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 space-y-6"
        >
          <Card className="border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-slate-200 bg-slate-50 px-6 pt-4">
                <TabsList className="bg-white border border-slate-200 rounded-lg">
                  <TabsTrigger 
                    value="all"
                    className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all"
                  >
                    All Messages
                  </TabsTrigger>
                  <TabsTrigger 
                    value="linkedin"
                    className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all"
                  >
                    LinkedIn
                  </TabsTrigger>
                  <TabsTrigger 
                    value="email"
                    className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all"
                  >
                    Email
                  </TabsTrigger>
                  <TabsTrigger 
                    value="whatsapp"
                    className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all"
                  >
                    WhatsApp
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <FilterBar
                selectedSector={selectedSector}
                setSelectedSector={setSelectedSector}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
              
              <TabsContent value="all" className="m-0">
                <div className="max-h-[1100px] overflow-y-auto">
                  <MessageFeed source="all" sector={selectedSector} sortBy={sortBy} />
                </div>
              </TabsContent>
              <TabsContent value="linkedin" className="m-0">
                <div className="max-h-[1100px] overflow-y-auto">
                  <MessageFeed source="linkedin" sector={selectedSector} sortBy={sortBy} />
                </div>
              </TabsContent>
              <TabsContent value="email" className="m-0">
                <div className="max-h-[1100px] overflow-y-auto">
                  <MessageFeed source="email" sector={selectedSector} sortBy={sortBy} />
                </div>
              </TabsContent>
              <TabsContent value="whatsapp" className="m-0">
                <div className="max-h-[1100px] overflow-y-auto">
                  <MessageFeed source="whatsapp" sector={selectedSector} sortBy={sortBy} />
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Deals with Pitch Decks Section */}
          <Card className="border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Deal Submissions</CardTitle>
              <p className="text-slate-600 text-sm mt-1">Deals with pitch decks ready for review</p>
            </CardHeader>
            <CardContent>
              <div className="max-h-[920px] overflow-y-auto">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {mockDeals.slice(0, 6).map((deal) => (
                    <motion.div key={deal.id} variants={itemVariants}>
                      <DealCard deal={deal} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Hot Deals & AI Insights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <QuickActions 
              onUploadDeck={() => setShowUploadDeck(true)}
              onCircleShare={() => setShowCircleShare(true)}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <HotDeals />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PipelineStages />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AIInsights />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}