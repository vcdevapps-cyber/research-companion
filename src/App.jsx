import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, Copy, Check, Download, BookOpen, Sparkles, Globe, DownloadCloud } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setContent('');
    try {
      const response = await axios.get(`https://r.jina.ai/${url}`);
      setContent(response.data);
    } catch (error) {
      alert("Erro ao extrair conteúdo. Verifique o link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center">
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-4xl px-6 py-12 flex flex-col items-center">
        {/* Logo / Icon */}
        <div className="mb-6 text-indigo-400">
          <BookOpen size={48} />
        </div>

        {/* Header Centralizado */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Assistente de <span className="text-indigo-500">Pesquisa</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Ferramenta de apoio ao professor. Transforme artigos em material didático limpo.
            Curadoria de qualquer fonte de web em um corpo de texto ideal para o ensino rápido.
          </p>
        </header>

        {/* Search Box Centralizada (Glassmorphism) */}
        <section className="w-full max-w-2xl bg-[#1e1e1e]/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center bg-white rounded-xl px-4 py-1">
              <Globe className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Cole o link do artigo aqui..." 
                className="w-full py-3 bg-transparent text-gray-800 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              onClick={handleScrape}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Processando..." : <><Sparkles size={20}/> Extrair Conteúdo</>}
            </button>
          </div>
        </section>

        {/* Banner PWA Centralizado */}
        {deferredPrompt && (
          <div className="w-full max-w-md bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between mb-12 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <DownloadCloud size={24} className="text-indigo-400" />
              <p className="text-sm text-indigo-100 font-medium">Instale no seu Zorin OS!</p>
            </div>
            <button onClick={handleInstallClick} className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold">Instalar</button>
          </div>
        )}

        {/* Grid de Funcionalidades */}
        {!content && (
          <div className="w-full grid md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: <Globe />, title: "Cole qualquer link", desc: "Pronto para portais de notícias e blogs." },
              { icon: <Sparkles />, title: "Limpeza I.A.", desc: "Conteúdo focado no que importa para o ensino." },
              { icon: <FileText />, title: "Limpeza automática", desc: "Transforma qualquer artigo de forma rápida." }
            ].map((item, i) => (
              <div key={i} className="bg-[#f1f3f4] p-8 rounded-3xl text-center flex flex-col items-center">
                <div className="text-indigo-600 mb-4">{item.icon}</div>
                <h3 className="text-gray-900 font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Área de Resultado Estilizada */}
        {content && (
          <div className="w-full bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden mt-8">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <h2 className="font-bold">Texto Extraído</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-300 font-sans text-lg leading-relaxed italic">
                {content}
              </pre>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto py-8 text-gray-500 text-sm">
        Assistente de Pesquisa &copy; 2025 | Ferramenta Gratuita para Educadores
      </footer>
    </div>
  );
}

export default App;