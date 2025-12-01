// frontend/src/components/ThesisSettings.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Target, TrendingUp, Globe, DollarSign, Users, Sparkles, Edit, Trash2 } from 'lucide-react';

export function ThesisSettings({ open, onOpenChange, onReconfigure }) {
  const [thesis, setThesis] = useState(null);

  useEffect(() => {
    const storedThesis = localStorage.getItem('fundThesis');
    if (storedThesis) {
      setThesis(JSON.parse(storedThesis));
    }
  }, [open]);

  const handleReconfigure = () => {
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('fundThesis');
    onOpenChange(false);
    onReconfigure();
  };

  if (!thesis) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Fund Thesis Configuration</DialogTitle>
          <DialogDescription>
            Your current investment criteria and preferences
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Investment Stage */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-5 text-blue-600" />
                <h3 className="text-sm">Investment Stages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {thesis.investmentStage.map((stage) => (
                  <Badge key={stage} variant="secondary" className="bg-blue-100 text-blue-700">
                    {stage}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Check Size & Fund Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="size-5 text-green-600" />
                <h3 className="text-sm">Fund & Check Size</h3>
              </div>
              <div className="space-y-2">
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Typical Check Size</span>
                    <span className="text-sm">{thesis.checkSize}</span>
                  </div>
                </Card>
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Fund Size</span>
                    <span className="text-sm">{thesis.fundSize}</span>
                  </div>
                </Card>
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Target Portfolio Size</span>
                    <span className="text-sm">{thesis.portfolioSize}</span>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Geography */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="size-5 text-purple-600" />
                <h3 className="text-sm">Geographies</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {thesis.geography.map((geo) => (
                  <Badge key={geo} variant="secondary" className="bg-purple-100 text-purple-700">
                    {geo}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sectors */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="size-5 text-orange-600" />
                <h3 className="text-sm">Sector Focus</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {thesis.sectors.map((sector) => (
                  <Badge key={sector} variant="secondary" className="bg-orange-100 text-orange-700">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Key Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-5 text-yellow-600" />
                <h3 className="text-sm">Key Metrics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {thesis.keyMetrics.map((metric) => (
                  <Badge key={metric} variant="secondary" className="bg-yellow-100 text-yellow-700">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Deal Breakers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="size-5 text-red-600" />
                <h3 className="text-sm">Deal Breakers</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {thesis.dealBreakers.map((breaker) => (
                  <Badge key={breaker} variant="secondary" className="bg-red-100 text-red-700">
                    {breaker}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleReconfigure} className="gap-2">
            <Edit className="size-4" />
            Reconfigure Thesis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
