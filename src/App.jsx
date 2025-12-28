import { useState } from 'react';
import axios from 'axios';
import { Search, FileText, Copy } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    try {
      // Usando o endereço padrão do Deepcrawl rodando localmente
      const response = await axios.post('/scrape', { url: url });
        url: url,
        options: {
          extractorFormat: 'markdown' // Formato limpo para professores
        }
      });
      
      // Ajuste: Dependendo da versão do Deepcrawl, o retorno pode estar em response.data.data ou response.data.content
      const extractedContent = response.data.content || response.data.data || "Conteúdo não encontrado";
      setContent(extractedContent);
    } catch (error) {
      console.error("Erro ao extrair:", error);
      alert("Erro ao conectar com a API. Verifique se o Deepcrawl está rodando na porta 3000.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-indigo-700">Research Companion</h1>
        <p className="text-gray-600">Transforme qualquer site em conteúdo didático limpo.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Cole o link do artigo aqui..." 
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleScrape}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            {loading ? "Processando..." : <><Search size={20}/> Extrair</>}
          </button>
        </div>

        {content && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2"><FileText size={20}/> Conteúdo Limpo</h2>
              <button 
                onClick={() => navigator.clipboard.writeText(content)}
                className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full"
              >
                <Copy size={20}/>
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
              {content}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;