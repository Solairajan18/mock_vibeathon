import { prisma } from './prisma';

// A simple fallback RAG implementation using keyword matching
// In a real production app, this would use pgvector and embeddings
export async function getRelevantFAQs(query: string, limit: number = 2) {
  const allFAQs = await prisma.knowledgeBase.findMany();
  
  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  
  // Score FAQs based on how many words from the query match the question/answer
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
  
  const scoredFAQs = allFAQs.map(faq => {
    let score = 0;
    const faqText = (faq.question + " " + faq.answer + " " + faq.category).toLowerCase();
    
    queryWords.forEach(word => {
      if (faqText.includes(word)) {
        score += 1;
      }
    });
    
    return { ...faq, score };
  });

  // Sort by score descending and filter out zeros
  const relevantFAQs = scoredFAQs
    .filter(faq => faq.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return relevantFAQs;
}
