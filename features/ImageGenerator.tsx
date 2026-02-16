import React, { useState } from 'react';
import { generateImagePro } from '../services/geminiService';
import Button from '../components/Button';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const base64Image = await generateImagePro(prompt, size);
      setResultImage(base64Image);
    } catch (e: any) {
      setError(e.message || "生成图片失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">AI 视觉助记</h2>
        <p className="text-slate-500 text-sm mb-6">
          使用 <strong>Gemini 3 Pro</strong> 生成高质量图片，通过视觉图像来辅助记忆复杂的单词或概念。
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">提示词</label>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
              rows={3}
              placeholder="例如：一幅超现实主义画作，一只发光的金色蝴蝶停在机器人鼻子上，代表'Serendipity'（意外发现珍宝的运气）。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">分辨率</label>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['1K', '2K', '4K'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      size === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            isLoading={loading} 
            fullWidth 
            disabled={!prompt.trim()}
          >
            {loading ? '正在生成...' : '生成助记图'}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
        </div>
      </div>

      {resultImage && (
        <div className="bg-slate-900 p-2 rounded-2xl shadow-lg animate-fade-in">
           <img src={resultImage} alt="Generated result" className="w-full h-auto rounded-xl object-contain" />
           <div className="mt-2 text-center">
             <a 
               href={resultImage} 
               download={`lingoflow-${Date.now()}.png`}
               className="text-indigo-300 text-xs hover:text-white transition-colors"
             >
               下载图片
             </a>
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;