import React from 'react';
import { CoachingInsights } from '../types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface CoachingCardProps {
  coaching: CoachingInsights;
}

const CoachingCard: React.FC<CoachingCardProps> = ({ coaching }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="font-semibold text-emerald-900">Winning Moments</h3>
        </div>
        <ul className="space-y-3">
          {coaching.positives.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-emerald-800">
              <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Missed Opportunities */}
      <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <AlertCircle size={20} />
          </div>
          <h3 className="font-semibold text-amber-900">Missed Opportunities</h3>
        </div>
        <ul className="space-y-3">
          {coaching.improvements.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-amber-800">
              <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Summary */}
      <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
         <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-indigo-500" />
          <h3 className="font-semibold text-slate-800">Executive Summary</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          {coaching.summary}
        </p>
      </div>
    </div>
  );
};

export default CoachingCard;