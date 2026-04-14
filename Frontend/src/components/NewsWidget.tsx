import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, TrendingUp, Image as ImageIcon } from 'lucide-react';

export const NewsWidget = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = '4fece8ab18be41388349554fef2f8b89'; 
  const URL = `https://newsapi.org/v2/everything?q=recursos+humanos+OR+empleo&language=es&sortBy=publishedAt&pageSize=8&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(URL);
        const data = await res.json();
        if (data.articles) {
          const valid = data.articles.filter((a: any) => a.title && a.title !== "[Removed]");
          setNews(valid.slice(0, 5));
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center h-[480px] transition-colors">
      <Loader2 className="animate-spin text-indigo-500 mb-2" />
      <p className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-center">Sincronizando Feed...</p>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col min-h-[480px] transition-colors">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Newspaper size={18} />
          </div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.2em]">Tendencias Laborales</h3>
        </div>
        <TrendingUp size={16} className="text-slate-300 dark:text-slate-600" />
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">
        {news.length > 0 ? news.map((article, i) => (
          <a 
            key={i} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex gap-4 group p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-700/50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
          >
            {/* Contenedor de Imagen */}
            <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
              {article.urlToImage ? (
                <img 
                  src={article.urlToImage} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }} 
                />
              ) : null}
              <ImageIcon size={16} className="text-slate-400 dark:text-slate-600 absolute z-0" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                {article.source.name}
              </span>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                {new Date(article.publishedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </a>
        )) : (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm italic">
                No hay noticias disponibles en este momento
            </div>
        )}
      </div>
    </div>
  );
};