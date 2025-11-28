import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { DOCTORS } from '../constants';

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

const initializeChat = () => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct a context string about the clinic and doctors
  const doctorsContext = DOCTORS.map(d => 
    `- ${d.name} (${d.specialty}), الخبرة: ${d.experience}, السعر: ${d.price} جنيه`
  ).join('\n');

  const systemInstruction = `
    أنت المساعد الذكي لمجمع هنا الطبي (HMC).
    دورك هو مساعدة المرضى في العثور على الطبيب المناسب بناءً على أعراضهم، والإجابة عن استفساراتهم حول العيادة.
    
    قائمة الأطباء المتاحين:
    ${doctorsContext}

    تعليمات مهمة:
    1. تحدث باللغة العربية بأسلوب مهذب واحترافي.
    2. لا تقدم تشخيصاً طبياً نهائياً أبداً. إذا سأل المريض عن تشخيص، قل: "أنا مساعد ذكي ولا يمكنني تقديم تشخيص طبي دقيق. أنصحك بحجز موعد مع الطبيب المختص."
    3. اقترح الطبيب المناسب بناءً على الشكوى (مثلاً: ألم في الصدر -> د. أحمد المنصوري طبيب القلب).
    4. شجع المستخدم على حجز موعد.
    5. كن موجزاً ومفيداً.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<AsyncGenerator<string, void, unknown> | null> => {
  if (!chatSession) {
    chatSession = initializeChat();
  }

  if (!chatSession) {
    return null; // Handle case where API key is missing
  }

  try {
    const responseStream = await chatSession.sendMessageStream({ message });
    
    // Create a generator to yield text chunks
    async function* streamGenerator() {
      if (!responseStream) return;
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    }

    return streamGenerator();
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};