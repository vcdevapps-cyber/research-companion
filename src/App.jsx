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
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setContent('');
    try {
      const response = await axios.get(`https://r.jina.ai/${url}`);
      setContent(response.data);
    } catch (error) {
      alert("Erro ao extrair conteúdo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center justify-start overflow-x-hidden">
      {/* Glow de Fundo */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-4xl px-4 py-20 flex flex-col items-center text-center">
        
        {/* Ícone de Topo */}
        <div className="mb-8 p-4 bg-white/5 rounded-3xl border border-white/10 text-indigo-400">
          <BookOpen size={48} />
        </div>

        {/* Título e Subtítulo */}
        <header className="mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Assistente de <span className="text-indigo-500">Pesquisa</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Ferramenta de apoio ao professor. Transforme artigos em material didático limpo. 
            Curadoria de qualquer fonte web pronta para o ensino rápido.
          </p>
        </header>

        {/* Container de Busca Centralizado */}
        <div className="w-full max-w-2xl bg-[#1e1e1e]/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-4 mb-16">
          <div className="flex items-center bg-white rounded-2xl px-5 py-2 shadow-inner">
            <Globe className="text-gray-400 mr-3" size={24} />
            <input 
              type="text" 
              placeholder="Cole o link do artigo aqui..." 
              className="w-full py-3 bg-transparent text-gray-900 font-medium outline-none placeholder:text-gray-400"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            onClick={handleScrape}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <><Sparkles size={22}/> Extrair Conteúdo</>}
          </button>
        </div>

        {/* Banner de Instalação */}
        {deferredPrompt && (
          <div className="flex items-center gap-4 bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-2xl mb-12">
             <DownloadCloud size={24} className="text-indigo-400" />
             <span className="text-sm font-medium">Instalar no Zorin OS para acesso rápido?</span>
             <button onClick={() => deferredPrompt.prompt()} className="bg-indigo-600 px-4 py-1.5 rounded-lg text-sm font-bold">Instalar</button>
          </div>
        )}

        {/* Grid de Funcionalidades (Abaixo) */}
        {!content && (
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            {[
              { icon: <Globe />, title: "Cole qualquer link", desc: "Blogs, notícias ou portais." },
              { icon: <Sparkles />, title: "Limpeza I.A.", desc: "Foco no que importa." },
              { icon: <FileText />, title: "Limpeza automática", desc: "Transformação imediata." }
            ].map((item, i) => (
              <div key={i} className="bg-[#f8f9fa] p-10 rounded-[35px] flex flex-col items-center text-center group hover:bg-white transition-all shadow-sm">
                <div className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-gray-900 font-extrabold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Resultado Final */}
        {content && (
          <div className="w-full max-w-3xl bg-[#1e1e1e] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden mt-8 text-left animate-in fade-in zoom-in-95">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <span className="font-bold text-indigo-400">Conteúdo Extraído</span>
              <button onClick={() => {navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
                {copied ? <Check className="text-green-400" size={20}/> : <Copy size={20} />}
              </button>
            </div>
            <div className="p-10 max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-300 font-sans text-lg italic leading-relaxed">
                {content}
              </pre>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto py-10 text-gray-600 text-sm font-medium">
        Assistente de Pesquisa &copy; 2025 | Ferramenta Gratuita para Educadores
      </footer>
    </div>
  );
}

export default App;