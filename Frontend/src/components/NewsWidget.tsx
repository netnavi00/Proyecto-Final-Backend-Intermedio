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
          // Filtramos solo los que tienen título real
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
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center h-[480px]">
      <Loader2 className="animate-spin text-indigo-500 mb-2" />
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Sincronizando Feed...</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col min-h-[480px]">
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
        {news.length > 0 ? news.map((article, i) => (
          <a 
            key={i} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            {/* Contenedor de Imagen con Fallback para el error 403 */}
            <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center relative">
              {article.urlToImage ? (
                <img 
                  src={article.urlToImage} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  // Si da error 403, ocultamos la imagen y queda el fondo gris con el icono
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }} 
                />
              ) : null}
              <ImageIcon size={16} className="text-slate-300 absolute z-0" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-wider block mb-1">
                {article.source.name}
              </span>
              <h4 className="text-[11px] font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-[9px] text-slate-400 mt-1 font-medium">
                {new Date(article.publishedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </a>
        )) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                No hay noticias disponibles en este momento
            </div>
        )}
      </div>
    </div>
  );
};