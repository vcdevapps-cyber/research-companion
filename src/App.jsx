import { useState } from 'react';
import axios from 'axios';
import { Search, FileText, Copy, Check, Download, BookOpen, Sparkles, Globe } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setContent('');
    try {
      const response = await axios.get(`https://r.jina.ai/${url}`);
      setContent(response.data);
    } catch (error) {
      alert("Não foi possível acessar este site. Tente uma URL diferente.");
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
      {/* Background Decorativo */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"></div>
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Profissional */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
            Research <span className="text-indigo-600">Companion</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            A ferramenta definitiva para curadoria de conteúdo. Transforme artigos poluídos em materiais de leitura limpos e estruturados para seus alunos.
          </p>
        </header>

        {/* Input Section com Glassmorphism */}
        <section className="relative max-w-3xl mx-auto mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-3 text-slate-400 focus-within:text-indigo-500 transition-colors">
              <Globe size={20} />
              <input 
                type="text" 
                placeholder="Cole o link do artigo (Ex: Wikipedia, Notícias...)" 
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
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processando...
                </div>
              ) : (
                <><Sparkles size={20}/> Limpar Conteúdo</>
              )}
            </button>
          </div>
        </section>

        {/* Grid de Instruções (Só aparece se não houver conteúdo) */}
        {!content && !loading && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            {[
              { icon: <Globe />, title: "Cole o Link", desc: "Qualquer artigo da web ou blog educativo." },
              { icon: <Sparkles />, title: "I.A. Atua", desc: "Removemos anúncios, menus e banners inúteis." },
              { icon: <FileText />, title: "Use em Aula", desc: "Copie para o Word ou salve como Markdown." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-indigo-500 flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Área de Resultado Estilizada */}
        {content && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 bg-slate-50 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Check size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-tight">Texto Higienizado</h2>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Pronto para uso didático</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                >
                  {copied ? <><Check size={18}/> Copiado!</> : <><Copy size={18}/> Copiar Tudo</>}
                </button>
                <button 
                  onClick={downloadTxt}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Download size={18}/> Baixar .MD
                </button>
              </div>
            </div>
            
            <div className="p-8 md:p-12 max-h-[70vh] overflow-y-auto">
              <article className="prose prose-slate lg:prose-xl max-w-none">
                <pre className="whitespace-pre-wrap text-slate-700 font-sans text-lg leading-relaxed antialiased">
                  {content}
                </pre>
              </article>
            </div>
          </div>
        )}
      </div>

      <footer className="py-12 border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 font-medium tracking-tight">
            Research Companion &copy; 2025 | Ferramenta Gratuita para Educadores
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;