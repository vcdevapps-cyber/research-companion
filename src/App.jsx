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
      alert("Não foi possível extrair o conteúdo. Verifique o link.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "material-pesquisa.md";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-indigo-500/30">
      {/* Detalhe de luz no fundo */}
      <div className="fixed top-[-10%] left-[50%] translate-x-[-50%] w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header Traduzido */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-6 border border-indigo-500/20">
            <BookOpen size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            Assistente de <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Pesquisa</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Ferramenta de apoio ao professor. Transforme artigos da web em material didático limpo, sem anúncios e pronto para aula.
          </p>
        </header>

        {/* Barra de Pesquisa Estilizada */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="bg-[#1e1e1e] p-2 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-2 transition-all focus-within:border-indigo-500/50">
            <div className="flex-1 flex items-center px-4 gap-3 text-gray-500">
              <Globe size={22} />
              <input 
                type="text" 
                placeholder="Cole o link do artigo aqui..." 
                className="w-full py-4 bg-transparent text-white outline-none placeholder:text-gray-600"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              onClick={handleScrape}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={20}/> Extrair Conteúdo</>}
            </button>
          </div>
        </section>

        {/* Banner PWA Traduzido */}
        {deferredPrompt && (
          <div className="max-w-3xl mx-auto mb-12 p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-3">
              <DownloadCloud className="text-indigo-400" size={24} />
              <p className="text-indigo-100 font-medium">Deseja instalar como aplicativo no Zorin OS?</p>
            </div>
            <button onClick={handleInstallClick} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-500 transition shadow-lg">Instalar</button>
          </div>
        )}

        {/* Cards Informativos */}
        {!content && !loading && (
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Globe />, title: "Cole qualquer link", desc: "Funciona com blogs, notícias e portais educativos." },
              { icon: <Sparkles />, title: "Limpeza I.A.", desc: "Removemos menus, banners e poluição visual automaticamente." },
              { icon: <FileText />, title: "Pronto para Aula", desc: "Copie o texto limpo para seus slides ou documentos." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#1e1e1e]/50 border border-white/5 text-center hover:bg-[#1e1e1e] transition-colors">
                <div className="text-indigo-400 flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Resultado */}
        {content && (
          <div className="bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 bg-white/5 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><FileText size={20} /></div>
                <h2 className="text-lg font-bold">Conteúdo Processado</h2>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={copyToClipboard} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#2a2a2a] border border-white/10 rounded-xl hover:bg-[#333] transition-all">
                  {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>} {copied ? "Copiado!" : "Copiar Texto"}
                </button>
                <button onClick={downloadTxt} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all">
                  <Download size={18}/> Baixar .MD
                </button>
              </div>
            </div>
            <div className="p-8 md:p-12 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <pre className="whitespace-pre-wrap text-gray-300 font-sans text-lg leading-relaxed antialiased">
                {content}
              </pre>
            </div>
          </div>
        )}
      </div>

      <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5 mt-12">
        <p>Assistente de Pesquisa &copy; 2025 | Desenvolvido para Educadores</p>
      </footer>
    </div>
  );
}

export default App;