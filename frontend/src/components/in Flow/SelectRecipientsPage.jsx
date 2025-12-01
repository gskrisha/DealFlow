// frontend/src/components/in Flow/SelectRecipientsPage.jsx
import { useState } from "react";
import { ArrowLeft, Send, Check, X, Sparkles, Mail, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const allRecipients = [
  {
    id: "1",
    name: "Sarah Chen",
    firm: "Sequoia Capital",
    avatar: "SC",
    matchScore: 96,
    sectors: ["AI/ML", "FinTech"],
    recommended: true,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    firm: "Andreessen Horowitz",
    avatar: "MR",
    matchScore: 92,
    sectors: ["FinTech", "Blockchain"],
    recommended: true,
  },
  {
    id: "3",
    name: "Emily Thompson",
    firm: "Accel Partners",
    avatar: "ET",
    matchScore: 88,
    sectors: ["SaaS", "AI/ML"],
    recommended: true,
  },
  {
    id: "4",
    name: "David Park",
    firm: "Lightspeed Venture",
    avatar: "DP",
    matchScore: 85,
    sectors: ["AI/ML", "HealthTech"],
    recommended: false,
  },
  {
    id: "5",
    name: "Jessica Wu",
    firm: "Kleiner Perkins",
    avatar: "JW",
    matchScore: 82,
    sectors: ["Consumer", "FinTech"],
    recommended: false,
  },
  {
    id: "6",
    name: "Robert Kumar",
    firm: "Index Ventures",
    avatar: "RK",
    matchScore: 79,
    sectors: ["SaaS", "Enterprise"],
    recommended: false,
  },
];

export function SelectRecipientsPage({ onClose, onBack, dealName }) {
  const [selectedRecipients, setSelectedRecipients] = useState(
    new Set(allRecipients.filter(r => r.recommended).map(r => r.id))
  );
  const [message, setMessage] = useState(
    `Hi! I came across this deal that I think would be a great fit for your portfolio. ${dealName} is raising their Series A and showing impressive traction. Would love to hear your thoughts!`
  );
  const [shareMethod, setShareMethod] = useState("email");
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const toggleRecipient = (id) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecipients(newSelected);
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      setShareSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };

  if (shareSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="border-emerald-200 max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-white" size={40} />
            </div>
            <h2 className="text-slate-900 mb-2">Deal Shared Successfully!</h2>
            <p className="text-slate-600">
              {dealName} has been shared with {selectedRecipients.size} contacts
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-slate-600 hover:text-slate-900">
                <ArrowLeft size={20} className="mr-2" />
                Back
              </Button>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <h1 className="text-slate-900">Select Recipients</h1>
                <p className="text-slate-600 text-sm">{selectedRecipients.size} contacts selected</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} size="icon">
              <X size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipient List */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Recommended */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-600" size={20} />
                <h2 className="text-slate-900">AI Recommended</h2>
                <Badge className="bg-indigo-100 text-indigo-700 border-0">Best Match</Badge>
              </div>
              <div className="space-y-3">
                {allRecipients.filter(r => r.recommended).map((recipient) => (
                  <Card
                    key={recipient.id}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedRecipients.has(recipient.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => toggleRecipient(recipient.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedRecipients.has(recipient.id)}
                          onCheckedChange={() => toggleRecipient(recipient.id)}
                        />
                        <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shrink-0">
                          {recipient.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-slate-900">{recipient.name}</h3>
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                              {recipient.matchScore}% match
                            </Badge>
                          </div>
                          <p className="text-slate-600 text-sm mb-2">{recipient.firm}</p>
                          <div className="flex items-center gap-2">
                            {recipient.sectors.map((sector) => (
                              <Badge key={sector} variant="outline" className="text-xs border-slate-300">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Other Contacts */}
            <div>
              <h2 className="text-slate-900 mb-4">Other Contacts</h2>
              <div className="space-y-3">
                {allRecipients.filter(r => !r.recommended).map((recipient) => (
                  <Card
                    key={recipient.id}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedRecipients.has(recipient.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => toggleRecipient(recipient.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedRecipients.has(recipient.id)}
                          onCheckedChange={() => toggleRecipient(recipient.id)}
                        />
                        <div className="w-12 h-12 bg-linear-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white shrink-0">
                          {recipient.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-slate-900">{recipient.name}</h3>
                            <span className="text-slate-600 text-xs">{recipient.matchScore}% match</span>
                          </div>
                          <p className="text-slate-600 text-sm mb-2">{recipient.firm}</p>
                          <div className="flex items-center gap-2">
                            {recipient.sectors.map((sector) => (
                              <Badge key={sector} variant="outline" className="text-xs border-slate-300">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Share Method */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-slate-700 text-sm mb-3">Share Method</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={shareMethod === "email" ? "default" : "outline"}
                    onClick={() => setShareMethod("email")}
                    className={shareMethod === "email" ? "bg-indigo-600" : "border-slate-300"}
                  >
                    <Mail size={16} className="mr-2" />
                    Email
                  </Button>
                  <Button
                    variant={shareMethod === "message" ? "default" : "outline"}
                    onClick={() => setShareMethod("message")}
                    className={shareMethod === "message" ? "bg-indigo-600" : "border-slate-300"}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Message */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-700 text-sm">Your Message</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 text-xs h-auto p-0"
                    onClick={() => {
                      const selectedNames = Array.from(selectedRecipients)
                        .map(id => allRecipients.find(r => r.id === id)?.name.split(' ')[0])
                        .join(', ');
                      setMessage(
                        `Hi! Based on our history of co-investing in similar AI/FinTech deals, I thought ${dealName} would be perfect for your portfolio. They're showing 85% MoM growth and have 3 Fortune 500 customers. Would love to discuss this opportunity with you!`
                      );
                    }}
                  >
                    <Sparkles size={12} className="mr-1" />
                    AI Personalize
                  </Button>
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-40 mb-3"
                  placeholder="Add a personal note..."
                />
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-indigo-900 mb-2">
                    <Sparkles size={12} className="inline mr-1" />
                    Smart Suggestions based on relationships:
                  </p>
                  <button
                    className="text-left w-full text-xs text-slate-700 hover:text-indigo-700 transition-colors"
                    onClick={() => setMessage(
                      `Hi! Based on your strong interest in FinTech and our successful co-investment in PayFlow, I think ${dealName} is a perfect fit. They're disrupting credit risk assessment with AI. Let's discuss!`
                    )}
                  >
                    → "Based on our successful co-investment in PayFlow..."
                  </button>
                  <button
                    className="text-left w-full text-xs text-slate-700 hover:text-indigo-700 transition-colors"
                    onClick={() => setMessage(
                      `Quick share - ${dealName} matches your AI/ML thesis perfectly. Series A, $2M ARR, 85% MoM growth. Remember when we passed on DataFlow? This one's even better. Worth a look!`
                    )}
                  >
                    → "Matches your AI/ML thesis perfectly..."
                  </button>
                  <button
                    className="text-left w-full text-xs text-slate-700 hover:text-indigo-700 transition-colors"
                    onClick={() => setMessage(
                      `Hey! You shared that great HealthTech deal with me last month. Here's ${dealName} - AI-powered credit risk that's seeing massive traction. Thought you'd want first look given your Series A focus.`
                    )}
                  >
                    → "You shared that great deal with me last month..."
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  A link to the deal and pitch deck will be automatically included
                </p>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-indigo-200 bg-linear-to-br from-indigo-50 to-white">
              <CardContent className="p-4">
                <h3 className="text-slate-900 mb-3">Share Summary</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Deal</span>
                    <span className="text-slate-900">{dealName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Recipients</span>
                    <span className="text-slate-900">{selectedRecipients.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Method</span>
                    <span className="text-slate-900 capitalize">{shareMethod}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button
                  onClick={handleShare}
                  disabled={selectedRecipients.size === 0 || isSharing}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isSharing ? (
                    <>
                      <Sparkles className="mr-2 animate-spin" size={16} />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Share Deal
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-300"
                  onClick={() => setSelectedRecipients(new Set(allRecipients.map(r => r.id)))}
                >
                  <Check size={14} className="mr-2" />
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-300"
                  onClick={() => setSelectedRecipients(new Set(allRecipients.filter(r => r.recommended).map(r => r.id)))}
                >
                  <Sparkles size={14} className="mr-2" />
                  Select Recommended
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-slate-300"
                  onClick={() => setSelectedRecipients(new Set())}
                >
                  <X size={14} className="mr-2" />
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}