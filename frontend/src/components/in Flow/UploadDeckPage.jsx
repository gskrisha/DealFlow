// frontend/src/components/UploadDeckPage.jsx
import { useState } from "react";
import { ArrowLeft, Upload, FileText, Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { CompanyPortfolio } from "./CompanyPortfolio";
import { motion } from "framer-motion";

export function UploadDeckPage({ onClose }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  if (showAnalysis) {
    return <CompanyPortfolio onClose={onClose} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onClose} className="text-slate-600 hover:text-slate-900">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <h1 className="text-slate-900">AI Pitch Deck Analyzer</h1>
                <p className="text-slate-600 text-sm">Upload a deck to get instant AI insights</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} size="icon">
              <X size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <Sparkles className="text-white" size={40} />
          </div>
          <h2 className="text-slate-900 mb-2">Analyze Pitch Deck with AI</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload any pitch deck and our AI will extract key information, analyze the business model,
            assess market opportunity, and provide investment recommendations.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.ppt,.pptx"
            />
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-6 rounded-full mb-4">
                <Upload className="text-indigo-600" size={40} />
              </div>
              <h3 className="text-slate-900 mb-2">
                {uploadedFile ? uploadedFile.name : "Drop your pitch deck here or click to browse"}
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Supported formats: PDF, PPT, PPTX (Max 50MB)
              </p>
              {!uploadedFile && (
                <Button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose File
                </Button>
              )}
            </div>
          </div>

          {uploadedFile && (
            <div className="mt-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-600" size={24} />
                  <div>
                    <p className="text-slate-900">{uploadedFile.name}</p>
                    <p className="text-slate-600 text-sm">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)} className="text-slate-600">
                  Remove
                </Button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12"
              >
                {isAnalyzing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles className="mr-2 animate-spin inline-block" size={20} />
                  </motion.div>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Analyze Pitch Deck
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="mt-8 bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              {["Extracting company information...", "Analyzing business model and revenue...", "Assessing market opportunity...", "Evaluating team and traction...", "Generating investment recommendation..."].map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    <p className="text-slate-700">{line}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
