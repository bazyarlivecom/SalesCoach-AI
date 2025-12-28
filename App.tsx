import React, { useState } from 'react';
import { AnalysisResult, AppState } from './types';
import { analyzeAudio } from './services/geminiService';
import AudioInput from './components/AudioInput';
import TranscriptViewer from './components/TranscriptViewer';
import SentimentChart from './components/SentimentChart';
import CoachingCard from './components/CoachingCard';
import { BrainCircuit, RotateCcw, BarChart3, MessageSquareText } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setState(AppState.ANALYZING);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        // Strip the data:audio/xyz;base64, part
        const base64Content = base64Data.split(',')[1];
        const mimeType = file.type || 'audio/mp3'; // Default fallback

        try {
          const result = await analyzeAudio(base64Content, mimeType);
          setAnalysis(result);
          setState(AppState.DASHBOARD);
        } catch (err) {
          console.error(err);
          setError("Failed to analyze audio. The model might be overloaded or the file is too complex. Please try again.");
          setState(AppState.ERROR);
        }
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setState(AppState.ERROR);
      };
    } catch (err) {
      setError("An unexpected error occurred.");
      setState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setState(AppState.UPLOAD);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SalesCoach AI</h1>
          </div>
          {state === AppState.DASHBOARD && (
            <button 
              onClick={resetApp}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={16} />
              New Analysis
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* UPLOAD / LOADING STATE */}
          {(state === AppState.UPLOAD || state === AppState.ANALYZING || state === AppState.ERROR) && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
               <div className="text-center mb-8 max-w-2xl">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Transform Sales Conversations into Revenue</h2>
                 <p className="text-lg text-slate-600">
                   Upload your sales calls to get instant AI-powered coaching, sentiment analysis, and diarized transcripts.
                 </p>
               </div>
               
               <AudioInput 
                  onAnalyze={handleAnalyze} 
                  isProcessing={state === AppState.ANALYZING} 
               />

               {state === AppState.ERROR && (
                 <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                   <span>{error}</span>
                   <button onClick={() => setState(AppState.UPLOAD)} className="underline font-semibold hover:text-red-800">Try Again</button>
                 </div>
               )}
            </div>
          )}

          {/* DASHBOARD STATE */}
          {state === AppState.DASHBOARD && analysis && (
            <div className="animate-in slide-in-from-bottom-4 duration-700 space-y-6">
              
              {/* Top Row: Chart & Coaching */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
                {/* Sentiment Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <BarChart3 size={20} />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900">Engagement Sentiment</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                         Positive
                      </div>
                    </div>
                  </div>
                  <SentimentChart data={analysis.sentiment_curve} />
                </div>

                {/* Quick Stats / Summary - Reuse Coaching Card partly or make distinct? Let's use Coaching Card here but stack it nicely */}
                <div className="lg:col-span-1">
                   <div className="h-full">
                      <CoachingCard coaching={analysis.coaching} />
                   </div>
                </div>
              </div>

              {/* Bottom Row: Transcript */}
              <div className="grid grid-cols-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                          <MessageSquareText size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Diarized Transcript</h2>
                     </div>
                     <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-500 shadow-sm">
                       {analysis.transcript.length} turns
                     </span>
                   </div>
                   <div className="p-0">
                      <TranscriptViewer transcript={analysis.transcript} />
                   </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;