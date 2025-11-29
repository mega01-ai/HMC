import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";
import { DOCTORS } from '../constants';

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

// 1. Define the tool (function) the model can call
const bookAppointmentTool: FunctionDeclaration = {
  name: 'bookAppointment',
  description: 'يستخدم لحجز موعد طبي جديد عند توفر كافة البيانات (اسم المريض، اسم الطبيب، التاريخ، الوقت، رقم الهاتف).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      patientName: {
        type: Type.STRING,
        description: 'اسم المريض الكامل',
      },
      doctorName: {
        type: Type.STRING,
        description: 'اسم الطبيب المراد الحجز معه',
      },
      date: {
        type: Type.STRING,
        description: 'تاريخ الموعد (مثال: 2024-05-20 أو غداً، اليوم)',
      },
      time: {
        type: Type.STRING,
        description: 'وقت الموعد (مثال: 10:00 صباحاً)',
      },
      phoneNumber: {
        type: Type.STRING,
        description: 'رقم هاتف المريض للتواصل',
      },
    },
    required: ['patientName', 'doctorName', 'date', 'time', 'phoneNumber'],
  },
};

const initializeChat = () => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct a context string about the clinic and doctors
  const doctorsContext = DOCTORS.map(d => 
    `- ${d.name} (${d.specialty}), الخبرة: ${d.experience}, السعر: ${d.price} جنيه, المواعيد المتاحة: [${d.availability.join(', ')}]`
  ).join('\n');

  const systemInstruction = `
    أنت المساعد الذكي لمجمع هنا الطبي (HMC).
    
    الهدف:
    مساعدة المرضى في حجز المواعيد والرد على استفساراتهم.

    قائمة الأطباء وبياناتهم:
    ${doctorsContext}

    قواعد العمل:
    1. تحدث باللغة العربية بأسلوب مهذب واحترافي.
    2. لحجز موعد، اجمع البيانات التالية: (الاسم، رقم الهاتف، الطبيب، التاريخ، الوقت).
    3. بمجرد توفر البيانات، استدع الدالة "bookAppointment".
    4. ملاحظة هامة: بعد استدعاء الدالة، سيقوم النظام بإنشاء رابط واتساب. أخبر المستخدم: "لقد جهزت لك رابط الحجز، يرجى الضغط عليه لإرسال التفاصيل للعيادة عبر واتساب."
    5. إذا سأل المريض عن تشخيص، قل: "أنا مساعد ذكي ولا يمكنني تقديم تشخيص طبي دقيق. أنصحك بحجز موعد مع الطبيب المختص."
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [bookAppointmentTool] }],
    },
  });
};

// Mock function that returns a WhatsApp Link instead of a fake ID
const executeBooking = async (args: any) => {
  console.log("Booking Request Received:", args);
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  const message = encodeURIComponent(
      `*حجز موعد عبر المساعد الذكي* 🤖\n\n` +
      `👤 *الاسم:* ${args.patientName}\n` +
      `📱 *الهاتف:* ${args.phoneNumber}\n` +
      `👨‍⚕️ *الدكتور:* ${args.doctorName}\n` +
      `📅 *التاريخ:* ${args.date}\n` +
      `⏰ *الوقت:* ${args.time}`
    );
  
  // Updated WhatsApp number
  const whatsappLink = `https://wa.me/201148497474?text=${message}`;

  return {
    status: 'pending_confirmation',
    action: 'open_whatsapp',
    link: whatsappLink,
    message: `رائع! لتوكيد الحجز، يرجى إرسال هذه البيانات عبر واتساب من خلال هذا الرابط: ${whatsappLink}`
  };
};

export const sendMessageToGemini = async (message: string): Promise<AsyncGenerator<string, void, unknown> | null> => {
  if (!chatSession) {
    chatSession = initializeChat();
  }

  if (!chatSession) {
    return null;
  }

  try {
    let response = await chatSession.sendMessage({ message });
    
    const functionCalls = response.functionCalls;
    
    if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'bookAppointment') {
            const result = await executeBooking(call.args);
            
            // Send the result back to Gemini so it can incorporate the link in its text
            response = await chatSession.sendToolResponse({
                functionResponses: [{
                    id: call.id,
                    name: call.name,
                    response: { result: result }
                }]
            });
        }
    }

    async function* streamGenerator() {
      if (response.text) {
        const words = response.text.split(' ');
        for (const word of words) {
            yield word + ' ';
            await new Promise(r => setTimeout(r, 10));
        }
      }
    }

    return streamGenerator();

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    chatSession = null;
    throw error;
  }
};