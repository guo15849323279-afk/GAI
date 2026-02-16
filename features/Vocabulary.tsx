import React, { useState, useEffect } from 'react';
import { VocabLevel, WordItem } from '../types';
import { generateVocabulary } from '../services/geminiService';
import Button from '../components/Button';
import WordCard from '../components/WordCard';

const Vocabulary: React.FC = () => {
  const [level, setLevel] = useState<VocabLevel>(VocabLevel.CET4);
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchWords = async () => {
    setLoading(true);
    setWords([]); // Clear previous
    try {
      const data = await generateVocabulary(level);
      setWords(data);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
      alert("获取单词失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch only on manual trigger or first mount if empty
    if (words.length === 0 && !loading) {
       fetchWords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const confirmLoad = window.confirm("太棒了！要再学 5 个词吗？");
      if (confirmLoad) fetchWords();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header / Filter */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">今日打卡</h2>
        <select 
          value={level} 
          onChange={(e) => setLevel(e.target.value as VocabLevel)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
        >
          {Object.values(VocabLevel).map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500 animate-pulse">AI 正在为你准备单词...</p>
          </div>
        ) : words.length > 0 ? (
          <div className="w-full max-w-md">
             <div className="mb-4 flex justify-between text-sm text-slate-400 font-medium px-2">
                <span>进度 {currentIndex + 1} / {words.length}</span>
                <span>{level}</span>
             </div>
             <WordCard wordData={words[currentIndex]} />
             
             <div className="flex gap-4 mt-8">
               <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="flex-1">
                 上一个
               </Button>
               <Button variant="primary" onClick={handleNext} className="flex-1">
                 {currentIndex === words.length - 1 ? '完成今日' : '下一个'}
               </Button>
             </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-500 mb-4">准备好开始学习了吗？</p>
            <Button onClick={fetchWords}>开始打卡</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;