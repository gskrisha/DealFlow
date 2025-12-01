import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  ExternalLink, 
  Users, 
  TrendingUp, 
  Target,
  Network,
  Mail,
  Calendar,
  FileText,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export function DealDetailDialog({ startup, open, onOpenChange }) {
  if (!startup) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{startup.name}</DialogTitle>
              <DialogDescription className="text-base text-slate-600">{startup.tagline}</DialogDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-slate-50 text-slate-700 border-slate-100">{startup.sector}</Badge>
                <Badge className="bg-slate-50 text-slate-700 border-slate-100">{startup.stage}</Badge>
                <Badge variant="outline" className="border-slate-200">{startup.location}</Badge>
              </div>
            </div>
            <div className="w-24 h-24 rounded-xl flex flex-col items-center justify-center text-white shrink-0"
                 style={{ background: 'linear-gradient(180deg,#3b82f6,#8b5cf6)', boxShadow: '0 10px 30px rgba(59,130,246,0.12)' }}>
              <div className="text-4xl font-semibold">{startup.score}</div>
              <div className="text-xs opacity-90">AI Score</div>
            </div>
          </div>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Company Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{startup.description}</p>
                </CardContent>
              </Card>

              {/* Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className='border-r border-2 p-4 rounded-2xl'>
                      <div className="text-sm text-slate-600 mb-1">Revenue</div>
                      <div className="text-xl">{startup.metrics.revenue}</div>
                    </div>
                    <div className='border-r border-2 p-4 rounded-2xl'>
                      <div className="text-sm text-slate-600 mb-1">Growth</div>
                      <div className="text-xl text-green-600">{startup.metrics.growth}</div>
                    </div>
                    <div className='border-r border-2 p-4 rounded-2xl'>
                      <div className="text-sm text-slate-600 mb-1">Users</div>
                      <div className="text-xl">{startup.metrics.users}</div>
                    </div>
                    <div className='border-r border-2 p-4 rounded-2xl'>
                      <div className="text-sm text-slate-600 mb-1">Funding</div>
                      <div className="text-xl">{startup.metrics.funding}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Signals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Growth Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {startup.signals.map((signal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-slate-700">{signal}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Data Sources */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Data sources:</span>
                {startup.sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              {startup.founders.map((founder, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shrink-0"
                           style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)' }}>
                        {founder.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{founder.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{founder.role}</p>
                        <p className="text-slate-700 mb-3">{founder.background}</p>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="w-3 h-3" />
                          View LinkedIn
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {startup.mutualConnections > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Network className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="mb-1">Network Intelligence</h4>
                        <p className="text-sm text-slate-700">
                          You have {startup.mutualConnections} mutual connections with this team
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View Connections
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(startup.scoreBreakdown).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="capitalize">{category}</span>
                        <span className="text-lg">{score}/100</span>
                      </div>
                      <Progress value={score} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Investor Fit */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Investor Fit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{startup.investorFit}</p>
                </CardContent>
              </Card>

              {/* Unicorn Probability */}
              {startup.unicornProbability && (
                <Card className="bg-linear-to-br from-yellow-50 to-orange-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Unicorn Probability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">🦄</div>
                      <div className="flex-1">
                        <div className="text-3xl mb-2">{startup.unicornProbability}%</div>
                        <Progress value={startup.unicornProbability} className="mb-2" />
                        <p className="text-sm text-slate-700">
                          Based on growth trajectory, team pedigree, and market dynamics
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Reasoning */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Reasoning (SHAP Explainability)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <div>Strong founding team with relevant exits</div>
                      <div className="text-sm text-slate-600">+8 points to team score</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <div>Exceptional revenue growth trajectory</div>
                      <div className="text-sm text-slate-600">+12 points to traction score</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <div>Large addressable market ($50B+ TAM)</div>
                      <div className="text-sm text-slate-600">+10 points to market score</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                    <div>
                      <div>Outside primary geography</div>
                      <div className="text-sm text-slate-600">-5 points to fit score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-3" size="lg">
                    <Mail className="w-5 h-5" />
                    Generate Personalized Outreach Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                    <Calendar className="w-5 h-5" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                    <FileText className="w-5 h-5" />
                    Generate 1-Pager Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                    <Network className="w-5 h-5" />
                    View Network Graph
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add to Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className='border-2 rounded-2xl' variant="outline">Interested</Button>
                    <Button className='border-2 rounded-2xl' variant="outline">Pass</Button>
                    <Button className='border-2 rounded-2xl' variant="outline">Watch</Button>
                    <Button className='border-2 rounded-2xl' variant="outline">Deep Dive</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
