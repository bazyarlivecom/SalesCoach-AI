import React from 'react';
import { TranscriptSegment } from '../types';
import { User, Phone } from 'lucide-react';

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript }) => {
  return (
    <div className="h-[600px] overflow-y-auto transcript-scroll p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="space-y-6">
        {transcript.map((segment, index) => {
          const isSalesperson = segment.speaker.toLowerCase().includes('sales') || segment.speaker === 'Speaker A';
          
          return (
            <div key={index} className={`flex gap-4 ${isSalesperson ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isSalesperson ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {isSalesperson ? <Phone size={16} /> : <User size={16} />}
              </div>
              
              <div className={`flex flex-col max-w-[80%] ${isSalesperson ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-700">{segment.speaker}</span>
                  <span className="text-xs text-slate-400">{segment.timestamp}</span>
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  isSalesperson 
                    ? 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100' 
                    : 'bg-indigo-50 text-indigo-900 rounded-tr-none border border-indigo-100'
                }`}>
                  {segment.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptViewer;