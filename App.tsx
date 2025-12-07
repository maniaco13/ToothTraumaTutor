import React, { useState, useEffect, useRef } from 'react';
import ToothCharacter from './components/ToothCharacter';
import InfoPanel from './components/InfoPanel';
import { RemedyType, ToothState, ReactionResponse, ToothCondition } from './types';
import { getRemedyReaction } from './services/geminiService';
import { Beaker, FlaskConical, Droplet, Ban, Info, Sparkles, Waves, Snowflake, Zap, Bone, Search, ChevronDown, Check } from 'lucide-react';

const App: React.FC = () => {
  const [condition, setCondition] = useState<ToothCondition>('BROKEN');
  const [selectedRemedy, setSelectedRemedy] = useState<string>(RemedyType.NONE);
  const [customInput, setCustomInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [toothState, setToothState] = useState<ToothState>({
    painLevel: 5,
    mood: 'neutral',
    animation: 'throb',
    visualEffect: 'none'
  });
  const [reactionData, setReactionData] = useState<ReactionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Initial load
  useEffect(() => {
    // Reset when condition changes
    handleRemedyChange(RemedyType.NONE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConditionToggle = (newCondition: ToothCondition) => {
      if (newCondition === condition) return;
      setCondition(newCondition);
      // State reset handled by useEffect
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInput.trim()) return;
    
    handleRemedyChange(customInput);
    setIsDropdownOpen(false);
    setCustomInput(''); // Clear input after submit
  };

  const handleRemedyChange = async (remedy: string) => {
    setSelectedRemedy(remedy);
    setLoading(true);

    // Immediate Visual Feedback (Optimistic UI) before AI generates text
    let tempMood: ToothState['mood'] = 'neutral';
    let tempAnim: ToothState['animation'] = 'idle';
    let tempEffect: ToothState['visualEffect'] = 'none';

    switch (remedy) {
        case RemedyType.RUBBING_ALCOHOL:
        case RemedyType.MOUTHWASH:
            // Burning sensation
            tempMood = 'agony';
            tempAnim = 'shiver'; // Fast vibration
            tempEffect = 'sweat'; // Dehydrating / Sweating reaction
            break;
        case RemedyType.VINEGAR:
            // Acidic reaction
            tempMood = 'agony';
            tempAnim = 'shiver';
            tempEffect = 'acid-fumes';
            break;
        case RemedyType.HYDROGEN_PEROXIDE:
            // Bubbling and potential shock
            tempMood = 'shock';
            tempAnim = 'jolt'; // Sudden movement
            tempEffect = 'bubbles';
            break;
        case RemedyType.ORAJEL:
            // Numbing / Dizzy
            tempMood = 'numb';
            tempAnim = 'sway';
            tempEffect = 'none';
            break;
        case RemedyType.SALT_WATER:
        case RemedyType.BAKING_SODA:
            // Soothing
            tempMood = 'relief';
            tempAnim = 'float';
            tempEffect = 'sparkles';
            break;
        case RemedyType.TOOTHPASTE:
            // Cleaning
            tempMood = 'neutral';
            tempAnim = 'idle';
            tempEffect = 'sparkles';
            break;
        case RemedyType.NONE:
            tempMood = 'neutral';
            tempAnim = 'throb';
            tempEffect = 'none';
            break;
        default:
            // Custom or unknown input optimistic state
            tempMood = 'shock';
            tempAnim = 'shiver';
            tempEffect = 'sweat';
            break;
    }

    setToothState({
        painLevel: 5, // placeholder until API returns
        mood: tempMood,
        animation: tempAnim,
        visualEffect: tempEffect
    });

    // Fetch educational data with condition context
    const reaction = await getRemedyReaction(remedy, condition);
    
    setReactionData(reaction);
    setToothState(prev => {
        let nextAnim = prev.animation;
        let nextEffect = prev.visualEffect;

        // For custom inputs, we need to update the animation based on the AI's actual findings.
        const isPreset = Object.values(RemedyType).includes(remedy as RemedyType);
        
        if (!isPreset) {
             if (reaction.mood === 'relief') {
                 nextAnim = 'float';
                 nextEffect = 'sparkles';
             } else if (reaction.mood === 'neutral') {
                 nextAnim = 'idle';
                 nextEffect = 'none';
             } else if (reaction.mood === 'agony') {
                 nextAnim = 'shiver'; 
                 nextEffect = 'sweat'; 
             } else if (reaction.mood === 'shock') {
                 nextAnim = 'jolt';
                 nextEffect = 'electric';
             } else if (reaction.mood === 'numb') {
                 nextAnim = 'sway';
                 nextEffect = 'none';
             }
        }

        return {
            ...prev,
            painLevel: reaction.painLevel,
            mood: reaction.mood,
            animation: nextAnim,
            visualEffect: nextEffect
        };
    });
    
    setLoading(false);
  };

  const getRemedyIcon = (remedyName: string) => {
    switch (remedyName) {
        case RemedyType.HYDROGEN_PEROXIDE: return <FlaskConical className="w-5 h-5 text-blue-500" />;
        case RemedyType.RUBBING_ALCOHOL: return <Ban className="w-5 h-5 text-red-500" />;
        case RemedyType.ORAJEL: return <Droplet className="w-5 h-5 text-teal-500" />;
        case RemedyType.VINEGAR: return <Beaker className="w-5 h-5 text-yellow-600" />;
        case RemedyType.SALT_WATER: return <Beaker className="w-5 h-5 text-sky-500" />;
        case RemedyType.TOOTHPASTE: return <Sparkles className="w-5 h-5 text-indigo-500" />;
        case RemedyType.MOUTHWASH: return <Waves className="w-5 h-5 text-blue-600" />;
        case RemedyType.BAKING_SODA: return <Snowflake className="w-5 h-5 text-slate-400" />;
        case RemedyType.NONE: return <Ban className="w-5 h-5 text-slate-400" />;
        default: return <Search className="w-5 h-5 text-slate-400" />;
    }
  };

  // Filter presets based on search
  const filteredRemedies = Object.values(RemedyType).filter(r => 
      r !== RemedyType.NONE && r.toLowerCase().includes(customInput.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <header className="mb-6 text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Tooth Trauma Tutor</h1>
        <p className="text-slate-600 text-lg">
          An educational simulation. See how a damaged tooth reacts to common household substances.
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-full border border-yellow-200">
           <Info className="w-4 h-4 mr-2" />
           <span>Educational Demo Only. Not Medical Advice.</span>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Left Column: Visual & Controls */}
        <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6">
            
            {/* Mode Switcher */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full max-w-[400px]">
                <button 
                    onClick={() => handleConditionToggle('BROKEN')}
                    className={`flex-1 flex items-center justify-center py-3 rounded-lg transition-all ${condition === 'BROKEN' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="font-bold text-sm">Broken Tooth</span>
                </button>
                <button 
                    onClick={() => handleConditionToggle('CAVITY')}
                    className={`flex-1 flex items-center justify-center py-3 rounded-lg transition-all ${condition === 'CAVITY' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Bone className="w-4 h-4 mr-2" />
                    <span className="font-bold text-sm">Cavity</span>
                </button>
            </div>

            {/* The Stage */}
            <div className="relative w-full aspect-square max-w-[400px] bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-slate-200 overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 to-slate-200">
                <ToothCharacter state={toothState} condition={condition} />
                
                {/* Labels for exposed parts */}
                <div className="absolute top-4 left-6 pointer-events-none opacity-50">
                    <div className="flex items-center mb-1">
                        <div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div>
                        <span className="text-xs text-slate-500 font-mono uppercase">Enamel</span>
                    </div>
                     <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                        <span className="text-xs text-slate-500 font-mono uppercase">
                            {condition === 'BROKEN' ? 'Exposed Pulp' : 'Decayed Dentin'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-[400px] z-50 relative" ref={dropdownRef}>
                <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                    Treat {condition === 'BROKEN' ? 'Broken Tooth' : 'Cavity'} With:
                </label>
                
                {/* Dropdown Trigger Button */}
                <button 
                    onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
                    disabled={loading}
                    className={`w-full bg-white text-left px-4 py-4 rounded-xl shadow-sm border-2 transition-all flex justify-between items-center group
                        ${isDropdownOpen ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                            {loading ? <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : getRemedyIcon(selectedRemedy)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Selected Solution</span>
                            <span className="font-bold text-slate-800 text-lg truncate pr-2">
                                {selectedRemedy === RemedyType.NONE ? 'Select a Remedy...' : selectedRemedy}
                            </span>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform origin-top animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Search Bar at Top */}
                        <div className="p-3 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                            <form onSubmit={handleCustomSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                <input 
                                    autoFocus
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium" 
                                    placeholder="Search or type custom solution..."
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                />
                            </form>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {/* Custom Option Logic */}
                            {customInput && (
                                <button 
                                    onClick={(e) => handleCustomSubmit(e)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-slate-100"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-blue-600 font-bold uppercase">Custom Analysis</span>
                                        <span className="text-slate-700 font-medium">Use custom: "{customInput}"</span>
                                    </div>
                                </button>
                            )}

                            {/* Preset List */}
                            {filteredRemedies.length > 0 ? (
                                filteredRemedies.map((remedy) => (
                                    <button
                                        key={remedy}
                                        onClick={() => {
                                            handleRemedyChange(remedy);
                                            setIsDropdownOpen(false);
                                            setCustomInput('');
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getRemedyIcon(remedy)}
                                            <span className="text-slate-700 font-medium">{remedy}</span>
                                        </div>
                                        {selectedRemedy === remedy && <Check className="w-4 h-4 text-green-500" />}
                                    </button>
                                ))
                            ) : (
                                !customInput && (
                                    <div className="p-4 text-center text-slate-400 text-sm">No presets found. Type to use a custom solution.</div>
                                )
                            )}
                            
                            {/* Reset Option */}
                            <div className="border-t border-slate-100 mt-1">
                                <button
                                     onClick={() => {
                                        handleRemedyChange(RemedyType.NONE);
                                        setIsDropdownOpen(false);
                                        setCustomInput('');
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-3"
                                >
                                    <Ban className="w-4 h-4" />
                                    Reset / Do Nothing
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Educational Output */}
        <div className="flex flex-col items-center w-full lg:w-1/2 z-0">
            <InfoPanel reaction={reactionData} loading={loading} />
            
            {/* Quick Tips */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <h5 className="font-bold text-orange-800 text-sm mb-1">
                        {condition === 'BROKEN' ? 'Why is air painful?' : 'Why do cavities hurt?'}
                    </h5>
                    <p className="text-orange-700 text-xs">
                        {condition === 'BROKEN' 
                            ? "When enamel breaks, temperature changes can directly stimulate the nerve endings inside the pulp."
                            : "Decay creates holes that trap food and bacteria, irritating the nerve and causing inflammation."}
                    </p>
                </div>
                 <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h5 className="font-bold text-blue-800 text-sm mb-1">What is the Pulp?</h5>
                    <p className="text-blue-700 text-xs">The center of the tooth containing living connective tissue, blood vessels, and large nerves.</p>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;