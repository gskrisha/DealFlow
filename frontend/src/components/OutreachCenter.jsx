import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Mail,
  Send,
  Sparkles,
  Copy,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  WifiOff,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { useStartups, useOutreach, useOutreachMutations } from '../lib/hooks';
import { useDiscovery } from '../lib/DiscoveryContext';
import { motion } from 'framer-motion';

export function OutreachCenter() {
  const { startups, isLoading: startupsLoading, useMock } = useStartups();
  const { stats: outreachStatsData, messages, isLoading: outreachLoading } = useOutreach();
  const { generateOutreach, sendOutreach, isLoading: generating } = useOutreachMutations();
  const { discoveries } = useDiscovery();
  
  const [selectedStartup, setSelectedStartup] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Set default startup once loaded
  useState(() => {
    if (startups.length > 0 && !selectedStartup) {
      setSelectedStartup(startups[0]?.id || '');
    }
  });

  const startup = useMemo(() => startups.find((s) => s.id === selectedStartup), [startups, selectedStartup]);

  const generateEmail = useCallback(async () => {
    if (!startup) return;

    try {
      // Try to use API
      const result = await generateOutreach({
        startupId: startup.id,
        templateType: 'initial',
        customContext: {}
      });
      setEmailContent(result.content);
    } catch (err) {
      console.warn('API unavailable, using local template:', err);
      // Fallback to local template
      const template = `Subject: Impressed by ${startup.name}'s growth in ${startup.sector}

Hi ${startup.founders?.[0]?.name || 'Founder'},

I came across ${startup.name} and was genuinely impressed by your work in ${startup.sector.toLowerCase()}. ${startup.tagline.toLowerCase()} is exactly the kind of innovation we look for.

A few things that stood out:
• ${startup.signals?.[0] || 'Strong traction'}
• ${startup.signals?.[1] || 'Compelling revenue growth'}
• Your background at ${startup.founders?.[0]?.background?.split(',')?.[0] || 'leading organizations'}

At [Your Firm], we focus on ${startup.stage} companies in ${startup.sector.toLowerCase()}, and I'd love to learn more about your vision and growth plans.

Would you have 20 minutes next week for a quick call?

Best regards,
John Doe
Partner, [Your Firm]`;

      setEmailContent(template);
    }
  }, [startup, generateOutreach]);

  const outreachStats = [
    { label: 'Emails Sent', value: outreachStatsData?.sent?.toString() || '0', change: 'this session' },
    { label: 'Response Rate', value: outreachStatsData?.reply_rate ? `${outreachStatsData.reply_rate}%` : '0%', change: 'total' },
    { label: 'Meetings Booked', value: outreachStatsData?.replied?.toString() || '0', change: 'this session' },
    { label: 'Pending Response', value: (outreachStatsData?.sent - outreachStatsData?.replied)?.toString() || '0', change: 'waiting' }
  ];

  const recentOutreach = discoveries && discoveries.length > 0 
    ? discoveries.slice(0, 4).map((startup, index) => ({
        id: startup.id,
        startup: startup.name,
        status: ['pending', 'replied', 'meeting'][index % 3] || 'pending',
        sentDate: `${index + 1} day${index > 0 ? 's' : ''} ago`,
        founder: startup.founders?.[0]?.name || 'Founder',
        response: index % 2 === 0 ? `Interested in discussing ${startup.sector} opportunities` : null
      }))
    : [];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback or error handling
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Outreach Center</h1>
        <p className="text-slate-500">
          AI-powered personalized outreach to high-score startups
          {useMock && (
            <Badge variant="outline" className="ml-2 text-xs bg-amber-50 border-amber-200 text-amber-700">
              <WifiOff className="w-3 h-3 mr-1 inline" />
              Demo Mode
            </Badge>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {outreachStats.map((stat) => (
          <motion.div key={stat.label} initial="hidden" animate="show" variants={fadeIn}>
            <Card className="p-0">
              <CardContent className="p-6">
                <div className="text-3xl font-semibold mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600">{stat.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Email Generator */}
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Generate Personalized Email</CardTitle>
              <CardDescription>AI creates custom outreach based on startup insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Select Startup</label>
                <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                  <SelectTrigger>
                    <SelectValue placeholder={startupsLoading ? "Loading..." : "Select a startup"} />
                  </SelectTrigger>
                  <SelectContent>
                    {startupsLoading ? (
                      <SelectItem value="loading" disabled>Loading startups...</SelectItem>
                    ) : (
                      startups.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} - Score: {s.score}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {startup && (
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-medium">Quick Facts:</h4>
                  <div className="text-sm text-slate-700 space-y-1">
                    <div>• Sector: {startup.sector}</div>
                    <div>• Stage: {startup.stage}</div>
                    <div>• Founder: {startup.founders[0].name} ({startup.founders[0].role})</div>
                    <div>• Key Signal: {startup.signals[0]}</div>
                    <div>• Mutual Connections: {startup.mutualConnections}</div>
                  </div>
                </div>
              )}

              <Button 
                className="w-full gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white" 
                onClick={generateEmail}
                disabled={!startup || generating}
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {generating ? 'Generating...' : 'Generate AI Email'}
              </Button>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm">Email Content</label>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={generateEmail} aria-label="Regenerate email" disabled={generating}>
                      <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(emailContent)} aria-label="Copy email">
                      {copied ? <CheckCheck className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Click 'Generate AI Email' to create personalized outreach"
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2 bg-linear-to-r from-green-600 to-emerald-600 text-white">
                  <Send className="w-4 h-4" />
                  Send via Gmail
                </Button>
                <Button variant="outline" className="flex-1">Save Draft</Button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  💡 <span className="font-medium">Pro Tip:</span> Emails mentioning mutual connections have 3x higher response rates
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Outreach */}
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Outreach</CardTitle>
              <CardDescription>Track responses and follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOutreach.length > 0 ? (
                <div className="space-y-4">
                  {recentOutreach.map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 font-medium">{item.startup}</h4>
                          <p className="text-sm text-slate-600">To: {item.founder}</p>
                        </div>
                        <Badge
                          variant={
                            item.status === 'replied' ? 'default' :
                            item.status === 'meeting' ? 'default' :
                            'secondary'
                          }
                          className={
                            item.status === 'replied' ? 'bg-green-500 text-white' :
                            item.status === 'meeting' ? 'bg-blue-500 text-white' :
                            ''
                          }
                        >
                          {item.status === 'pending' && <Clock className="w-3 h-3 mr-1 inline-block" />}
                          {item.status === 'replied' && <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />}
                          {item.status === 'meeting' && <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>

                      {item.response && (
                        <div className="bg-green-50 border border-green-100 rounded p-2 text-sm">
                          <span className="text-green-700">"{item.response}"</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Sent {item.sentDate}</span>
                        <Button variant="ghost" size="sm">View Thread</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No outreach yet</p>
                  <p className="text-xs mt-1">Run AI Discovery to find and reach out to companies</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Email Templates */}
      <motion.div initial="hidden" animate="show" variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Pre-built templates optimized for response rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Initial Outreach',
                  description: 'First contact with founders',
                  responseRate: '65%'
                },
                {
                  name: 'Follow-up',
                  description: 'Gentle reminder after 5 days',
                  responseRate: '42%'
                },
                {
                  name: 'Warm Introduction',
                  description: 'Leverage mutual connections',
                  responseRate: '78%'
                }
              ].map((template, index) => (
                <motion.div key={index} variants={fadeIn} className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden border">
                  <Card className="p-0">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium">{template.name}</h4>
                        <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                          {template.responseRate}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{template.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
