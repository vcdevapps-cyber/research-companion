import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, Copy, Check, Download, BookOpen, Sparkles, Globe, MonitorArrowDown } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Lógica para detectar se o app pode ser instalado
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setContent('');
    try {
      // API Jina para extrair conteúdo limpo via GET
      const response = await axios.get(`https://r.jina.ai/${url}`);
      setContent(response.data);
    } catch (error) {
      alert("Não foi possível acessar este site. Verifique o link e tente novamente.");
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
    element.download = "material-didatico.md";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"></div>
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl text-center">
            Research <span className="text-indigo-600">Companion</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Transforme artigos poluídos em materiais de leitura estruturados para seus alunos.
          </p>
        </header>

        {/* Input Section */}
        <section className="relative max-w-3xl mx-auto mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-3 text-slate-400 focus-within:text-indigo-500 transition-colors">
              <Globe size={20} />
              <input 
                type="text" 
                placeholder="Cole o link do artigo aqui..." 
                className="w-full py-4 bg-transparent text-slate-700 font-medium outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              onClick={handleScrape}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Limpando..." : <><Sparkles size={20}/> Extrair</>}
            </button>
          </div>
        </section>

        {/* Botão de Instalação PWA */}
        {deferredPrompt && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <MonitorArrowDown size={20} />
              </div>
              <p className="text-indigo-900 font-semibold">Instale o App no seu Zorin OS</p>
            </div>
            <button 
              onClick={handleInstallClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
            >
              Instalar
            </button>
          </div>
        )}

        {/* Resultado */}
        {content ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 bg-slate-50 border-b border-slate-200 gap-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-indigo-600" size={20} /> Conteúdo Higienizado
              </h2>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  {copied ? <Check size={18}/> : <Copy size={18}/>} {copied ? "Copiado" : "Copiar"}
                </button>
                <button 
                  onClick={downloadTxt}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Download size={18}/> Baixar .md
                </button>
              </div>
            </div>
            <div className="p-8 md:p-12 max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-slate-700 font-sans text-lg leading-relaxed antialiased">
                {content}
              </pre>
            </div>
          </div>
        ) : !loading && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center opacity-60">
            <div className="p-6">
              <Globe className="mx-auto mb-2 text-indigo-400" />
              <p className="text-sm font-medium text-slate-500">Cole um link da web</p>
            </div>
            <div className="p-6">
              <Sparkles className="mx-auto mb-2 text-indigo-400" />
              <p className="text-sm font-medium text-slate-500">Remova distrações</p>
            </div>
            <div className="p-6">
              <FileText className="mx-auto mb-2 text-indigo-400" />
              <p className="text-sm font-medium text-slate-500">Use em suas aulas</p>
            </div>
          </div>
        )}
      </div>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>Research Companion &copy; 2025 | Ferramenta para Educadores</p>
      </footer>
    </div>
  );
}

export default App;