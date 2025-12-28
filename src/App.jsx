import { useState } from 'react';
import axios from 'axios';
import { Search, FileText, Copy, Check, Download } from 'lucide-react';

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
      // Usando a API pública do Jina que transforma sites em Markdown para IA
      // Isso resolve o problema de conexão com o localhost na Vercel
      const response = await axios.get(`https://r.jina.ai/${url}`);
      
      if (response.data) {
        setContent(response.data);
      } else {
        alert("Página retornou conteúdo vazio.");
      }
    } catch (error) {
      console.error("Erro ao extrair:", error);
      alert("Erro ao limpar a página. Verifique a URL e tente novamente.");
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
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "conteudo-didatico.md";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Research Companion</h1>
        <p className="text-slate-600 text-lg">Apoio ao Professor: Extração de conteúdo web sem anúncios ou lixo visual.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Barra de Pesquisa */}
        <div className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <input 
            type="text" 
            placeholder="Cole aqui o link (ex: https://wikipedia.org/...)" 
            className="flex-1 p-4 rounded-xl text-slate-700 outline-none focus:bg-slate-50 transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleScrape}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:bg-indigo-300 font-bold"
          >
            {loading ? (
              <span className="animate-pulse">Limpando...</span>
            ) : (
              <><Search size={20}/> Extrair Conteúdo</>
            )}
          </button>
        </div>

        {/* Área de Resultado */}
        {content && (
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-indigo-900 font-bold flex items-center gap-2">
                <FileText size={20}/> Texto Higienizado
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  title="Copiar texto"
                  className="bg-white text-indigo-600 p-2 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition flex items-center gap-1 text-sm font-medium"
                >
                  {copied ? <><Check size={18}/> Copiado!</> : <><Copy size={18}/> Copiar</>}
                </button>
                <button 
                  onClick={downloadTxt}
                  title="Baixar Markdown"
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 text-sm font-medium"
                >
                  <Download size={18}/> Baixar .md
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-slate-800 leading-relaxed font-sans text-base">
                {content}
              </pre>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-slate-400 text-sm">
        <p>Desenvolvido para facilitar a curadoria de materiais didáticos.</p>
      </footer>
    </div>
  );
}

export default App;