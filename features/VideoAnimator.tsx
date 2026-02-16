import React, { useState, useRef } from 'react';
import { generateVideoVeo } from '../services/geminiService';
import Button from '../components/Button';

const VideoAnimator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("文件过大，请选择 5MB 以下的图片。");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResultVideo(null);

    try {
      const videoUrl = await generateVideoVeo(prompt, selectedImage, aspectRatio);
      setResultVideo(videoUrl);
    } catch (e: any) {
      setError(e.message || "视频生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Veo 创意工坊</h2>
        <p className="text-slate-500 text-sm mb-6">
          让单词动起来。上传图片让它动起来，或者使用 <strong>Veo 3.1</strong> 从头创作视频。
        </p>

        <div className="space-y-4">
          {/* Image Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedImage ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <div className="relative w-full h-32">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                <button 
                  className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ) : (
              <>
                 <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 <span className="text-sm text-slate-500">点击上传参考图片 (可选)</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">提示词</label>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
              rows={2}
              placeholder={selectedImage ? "描述图片应该如何运动..." : "描述你想生成的视频内容..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">画幅比例</label>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${aspectRatio === '16:9' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  横屏 (16:9)
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${aspectRatio === '9:16' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  竖屏 (9:16)
                </button>
             </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            isLoading={loading} 
            fullWidth 
            disabled={!prompt.trim() && !selectedImage}
          >
            {loading ? '正在生成...' : '使用 Veo 生成'}
          </Button>
           <p className="text-xs text-center text-slate-400">注意：视频生成可能需要一两分钟。</p>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
        </div>
      </div>

      {resultVideo && (
        <div className="bg-black p-1 rounded-2xl shadow-lg overflow-hidden">
          <video 
            src={resultVideo} 
            controls 
            autoPlay 
            loop 
            className="w-full h-auto rounded-xl"
          />
          <div className="p-3 bg-slate-900 flex justify-between items-center">
             <span className="text-slate-300 text-xs">Generated by Veo</span>
             <a 
               href={resultVideo} 
               download={`veo-creation-${Date.now()}.mp4`}
               className="text-indigo-400 text-xs hover:text-indigo-300 font-medium"
             >
               下载 MP4
             </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnimator;