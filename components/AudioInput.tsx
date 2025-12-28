import React, { useState, useRef } from 'react';
import { UploadCloud, Mic, Square, Loader2, FileAudio } from 'lucide-react';

interface AudioInputProps {
  onAnalyze: (file: File) => void;
  isProcessing: boolean;
}

const AudioInput: React.FC<AudioInputProps> = ({ onAnalyze, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyze(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], "recording.webm", { type: 'audio/webm' });
        onAnalyze(file);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 bg-white shadow-sm transition-all hover:border-indigo-400 hover:bg-slate-50">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          
          <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
            {isProcessing ? (
              <Loader2 className="animate-spin" size={32} />
            ) : isRecording ? (
              <div className="relative">
                <Mic size={32} className="text-rose-500" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              </div>
            ) : (
              <UploadCloud size={32} />
            )}
          </div>

          <div className="space-y-2">
            {isProcessing ? (
              <>
                <h3 className="text-xl font-semibold text-slate-800">Analyzing Sales Call...</h3>
                <p className="text-slate-500">Gemini is transcribing and extracting insights.</p>
              </>
            ) : isRecording ? (
              <>
                 <h3 className="text-xl font-semibold text-slate-800">Recording... {formatTime(recordingTime)}</h3>
                 <p className="text-slate-500">Speak clearly into your microphone.</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-slate-800">Upload or Record Call</h3>
                <p className="text-slate-500">Supported formats: MP3, WAV, WebM</p>
              </>
            )}
          </div>

          {!isProcessing && (
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center">
              {isRecording ? (
                 <button 
                  onClick={stopRecording}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 w-full sm:w-auto transition-colors"
                >
                  <Square size={20} className="mr-2" />
                  Stop Recording
                </button>
              ) : (
                <>
                  <label className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto transition-colors">
                    <FileAudio size={20} className="mr-2" />
                    Upload File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="audio/*" 
                      onChange={handleFileChange}
                    />
                  </label>
                  
                  <button 
                    onClick={startRecording}
                    className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto transition-colors"
                  >
                    <Mic size={20} className="mr-2" />
                    Record Mic
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioInput;