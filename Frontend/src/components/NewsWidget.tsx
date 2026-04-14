import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, TrendingUp, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const NewsWidget = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_KEY = '4fece8ab18be41388349554fef2f8b89'; 
  const URL = `https://newsapi.org/v2/everything?q=recursos+humanos+OR+empleo+OR+workplace&language=es&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(URL);
        const data = await res.json();

        if (data.status === "ok" && data.articles) {
          const validArticles = data.articles.filter(
            (a: any) => a.title && a.title !== "[Removed]"
          );
          setNews(validArticles.slice(0, 5));
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center h-full min-h-[450px]">
      <Loader2 className="animate-spin text-indigo-500 mb-2" />
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cargando Imágenes...</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col min-h-[450px]">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <Newspaper size={18} />
          </div>
          <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em]">Tendencias Laborales</h3>
        </div>
        <TrendingUp size={16} className="text-slate-300" />
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">
        {news.map((article, i) => (
          <a 
            key={i} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex gap-3 group p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            {/* IMAGEN DE LA NOTICIA */}
            <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
              {article.urlToImage ? (
                <img 
                  src={article.urlToImage} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => (e.currentTarget.style.display = 'none')} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={16} />
                </div>
              )}
            </div>

            {/* TEXTO DE LA NOTICIA */}
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-wider block mb-1">
                {article.source.name}
              </span>
              <h4 className="text-[11px] font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-[9px] text-slate-400 mt-1">
                {new Date(article.publishedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};