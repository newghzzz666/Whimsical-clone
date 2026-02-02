/**
 * AI Service for content generation
 */

export const generateAIContent = async (prompt: string, context?: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        context,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate content');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
};

/**
 * Check if API is available (mock for local development)
 */
export const isAIAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/ai/health', { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
};
