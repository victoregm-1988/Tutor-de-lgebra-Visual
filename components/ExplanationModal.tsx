import React, { useEffect, useRef } from 'react';

interface ExplanationModalProps {
  onClose: () => void;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Close modal on outside click
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && event.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div
            ref={modalRef}
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="explanation-title"
        >
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slide-up {
                from { transform: translateY(20px) scale(0.98); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
              }
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full transform animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 id="explanation-title" className="text-2xl sm:text-3xl font-bold text-blue-800">
                        💡 Como Resolver "ax + b = c"
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors text-3xl font-light leading-none"
                        aria-label="Fechar"
                    >
                        &times;
                    </button>
                </div>
                <div className="text-slate-700 space-y-4 text-base sm:text-lg">
                    <p>
                        Resolver uma equação como <code className="bg-blue-100 p-1 rounded font-mono">ax + b = c</code> significa descobrir o valor de <code className="bg-blue-100 p-1 rounded font-mono">x</code>. O nosso objetivo é deixar o <code className="bg-blue-100 p-1 rounded font-mono">x</code> sozinho de um lado do sinal de igual (=).
                    </p>
                    <p>
                        Pense nisso como uma balança: para mantê-la equilibrada, tudo o que você faz de um lado, precisa fazer igual do outro lado.
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-gray-50 border-l-4 border-blue-400 rounded-r-lg">
                            <h3 className="font-bold text-lg text-blue-700 mb-2">Passo 1: Isolar o termo com 'x'</h3>
                            <p>Primeiro, queremos remover o número que está somando ou subtraindo do lado do <code className="bg-blue-100 p-1 rounded font-mono">x</code> (o termo <code className="bg-blue-100 p-1 rounded font-mono">b</code>). Para isso, fazemos a operação inversa.</p>
                             <div className="mt-2 p-3 bg-blue-100 rounded-lg">
                                <p className="font-semibold">Equação original:</p>
                                <code className="text-xl font-mono block text-center my-1">{`ax + b = c`}</code>
                                <p className="font-semibold">Subtraia <code className="font-mono">b</code> dos dois lados:</p>
                                <code className="text-xl font-mono block text-center my-1">{`ax + b - b = c - b`}</code>
                                <p className="font-semibold">Resultado:</p>
                                <code className="text-xl font-mono block text-center my-1">{`ax = c - b`}</code>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-l-4 border-blue-400 rounded-r-lg">
                            <h3 className="font-bold text-lg text-blue-700 mb-2">Passo 2: Encontrar o valor de 'x'</h3>
                            <p>Agora, o <code className="bg-blue-100 p-1 rounded font-mono">x</code> está sendo multiplicado por <code className="bg-blue-100 p-1 rounded font-mono">a</code>. Para deixá-lo sozinho, fazemos a operação inversa: a divisão.</p>
                            <div className="mt-2 p-3 bg-blue-100 rounded-lg">
                                <p className="font-semibold">Equação atual:</p>
                                <code className="text-xl font-mono block text-center my-1">{`ax = c - b`}</code>
                                <p className="font-semibold">Divida os dois lados por <code className="font-mono">a</code>:</p>
                                <code className="text-xl font-mono block text-center my-1">{`(ax) / a = (c - b) / a`}</code>
                                <p className="font-semibold">Solução Final:</p>
                                <code className="text-xl font-mono block text-center my-1">{`x = (c - b) / a`}</code>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-l-4 border-green-400 rounded-r-lg">
                            <h3 className="font-bold text-lg text-green-700 mb-2">Exemplo Prático: Resolvendo 2x + 4 = 10</h3>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>
                                    <strong>Começamos com:</strong>
                                    <br />
                                    <code className="bg-green-100 p-1 rounded font-mono">2x + 4 = 10</code>
                                </li>
                                <li>
                                    <strong>Subtraímos 4 dos dois lados (Passo 1):</strong>
                                    <br />
                                    <code className="bg-green-100 p-1 rounded font-mono">2x = 10 - 4</code>
                                    <br />
                                    <code className="bg-green-100 p-1 rounded font-mono">2x = 6</code>
                                </li>
                                <li>
                                    <strong>Dividimos por 2 dos dois lados (Passo 2):</strong>
                                    <br />
                                    <code className="bg-green-100 p-1 rounded font-mono">x = 6 / 2</code>
                                </li>
                                <li>
                                    <strong>E o resultado é:</strong>
                                    <br />
                                    <code className="bg-green-100 p-1 rounded font-mono font-bold text-lg">x = 3</code>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-right">
                     <button
                        onClick={onClose}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Entendi!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExplanationModal;
