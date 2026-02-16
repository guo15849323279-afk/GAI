import React, { useState } from 'react';
import { WordItem } from '../types';

interface WordCardProps {
  wordData: WordItem;
}

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group perspective-1000 w-full h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-indigo-500 tracking-wider uppercase mb-2">每日单词</div>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">{wordData.word}</h2>
          {wordData.pronunciation && (
            <p className="text-slate-500 font-mono text-lg mb-6">/{wordData.pronunciation}/</p>
          )}
          <p className="text-slate-400 text-sm mt-auto">点击查看释义</p>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 rounded-2xl shadow-xl p-8 flex flex-col justify-between text-left">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{wordData.word}</h3>
            {/* Chinese Definition */}
            <p className="text-white text-lg font-medium mb-1">
              {wordData.definition_cn}
            </p>
            {/* English Definition */}
            <p className="text-slate-400 text-sm mb-4 leading-snug">
              {wordData.definition_en}
            </p>
            
            <div className="bg-slate-700/50 p-3 rounded-lg border-l-4 border-indigo-400">
              <p className="text-slate-200 italic text-sm">"{wordData.example}"</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">同义词</p>
            <div className="flex flex-wrap gap-2">
              {wordData.synonyms.map((syn, idx) => (
                <span key={idx} className="bg-slate-700 text-indigo-200 px-2 py-1 rounded text-xs font-medium">
                  {syn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;