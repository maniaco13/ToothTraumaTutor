import React from 'react';
import { ReactionResponse } from '../types';
import { AlertCircle, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface InfoPanelProps {
  reaction: ReactionResponse | null;
  loading: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ reaction, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-slate-200 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-20 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (!reaction) {
    return (
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-slate-200 text-center">
        <p className="text-slate-500">Select a substance to see how the tooth reacts.</p>
      </div>
    );
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Safe": return "text-green-600 bg-green-50 border-green-200";
      case "Highly Recommended": return "text-green-700 bg-green-100 border-green-300";
      case "Use with Caution": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Unsafe": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Safe": case "Highly Recommended": return <CheckCircle className="w-5 h-5 mr-2" />;
      case "Use with Caution": return <AlertTriangle className="w-5 h-5 mr-2" />;
      case "Unsafe": return <AlertCircle className="w-5 h-5 mr-2" />;
      default: return <ShieldCheck className="w-5 h-5 mr-2" />;
    }
  };

  const getPainColorClass = (level: number) => {
    if (level > 7) return 'bg-red-500';
    if (level > 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPainTextColorClass = (level: number) => {
    if (level > 7) return 'text-red-600';
    if (level > 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPainDescription = (level: number) => {
    if (level === 0) return "No pain. Perfectly comfortable.";
    if (level <= 3) return "Mild discomfort. Noticeable but easy to ignore.";
    if (level <= 6) return "Moderate pain. Distracting ache, throbbing.";
    if (level <= 8) return "Severe pain. Intense, sharp, difficult to focus.";
    return "Agonizing. Unbearable, immediate emergency.";
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
      {/* Header / Pain Meter */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-slate-700">Reaction Analysis</h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pain Level</span>
        </div>
        
        {/* Pain Bar Container with Tooltip */}
        <div className="relative group cursor-help w-full">
            <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className={`h-full transition-all duration-700 ease-out rounded-full ${getPainColorClass(reaction.painLevel)}`}
                        style={{ width: `${Math.max(5, reaction.painLevel * 10)}%` }} // Ensure at least a sliver shows
                    ></div>
                </div>
                <span className={`font-bold text-sm w-10 text-right ${getPainTextColorClass(reaction.painLevel)}`}>
                    {reaction.painLevel}/10
                </span>
            </div>

            {/* Tooltip Content */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-center transform translate-y-2 group-hover:translate-y-0">
                <p className="font-semibold mb-1">Pain Scale: {reaction.painLevel}</p>
                <p className="text-slate-300 leading-tight">{getPainDescription(reaction.painLevel)}</p>
                {/* Arrow Indicator */}
                <div className="absolute bottom-full left-1/2 -ml-2 border-4 border-transparent border-b-slate-800"></div>
            </div>
        </div>

      </div>

      <div className="p-6 space-y-6">
        {/* Sensation */}
        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Subjective Experience</h4>
          <p className="text-lg text-slate-800 leading-relaxed italic">"{reaction.sensationDescription}"</p>
        </div>

        {/* Science */}
        <div>
           <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Scientific Mechanism</h4>
           <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
             {reaction.scientificEffect}
           </p>
        </div>

        {/* Verdict Badge */}
        <div className={`flex items-center p-3 rounded-lg border ${getVerdictColor(reaction.verdict)}`}>
            {getVerdictIcon(reaction.verdict)}
            <span className="font-bold">{reaction.verdict}</span>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;