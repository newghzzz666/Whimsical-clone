import React, { useState, useRef, useEffect } from 'react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  generatedContent: string | null;
  onApplyContent: (content: string) => void;
}

const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  generatedContent,
  onApplyContent,
}) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      onApplyContent(generatedContent);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">AI Content Generation</h2>
        </div>

        <div className="p-6 space-y-4">
          {!generatedContent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe what you want to generate:
                </label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Create a project roadmap for Q1 2025'"
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors font-medium"
              >
                {isLoading ? 'Generating...' : 'Generate Content'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Content:
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md max-h-48 overflow-y-auto whitespace-pre-wrap text-sm">
                  {generatedContent}
                </div>
              </div>
              <button
                onClick={() => {
                  setPrompt('');
                }}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
              >
                Generate Again
              </button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
          >
            Close
          </button>
          {generatedContent && (
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors font-medium"
            >
              Apply Content
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModal;
