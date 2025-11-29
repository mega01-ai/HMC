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
    مساعدة المرضى في حجز المواعيد والرد على استفساراتهم. لديك القدرة على حجز المواعيد فعلياً باستخدام أداة "bookAppointment".

    قائمة الأطباء وبياناتهم:
    ${doctorsContext}

    قواعد العمل:
    1. تحدث باللغة العربية بأسلوب مهذب واحترافي.
    2. لحجز موعد، يجب أن تحصل من المستخدم على المعلومات التالية: (الاسم، رقم الهاتف، الطبيب، التاريخ، الوقت).
    3. إذا طلب المستخدم حجز موعد، اسأله عن البيانات الناقصة خطوة بخطوة أو معاً.
    4. بمجرد توفر جميع البيانات، قم باستدعاء الدالة "bookAppointment" فوراً ولا تخبر المستخدم أنك ستحجز، بل احجز مباشرة.
    5. إذا سأل المريض عن تشخيص، قل: "أنا مساعد ذكي ولا يمكنني تقديم تشخيص طبي دقيق. أنصحك بحجز موعد مع الطبيب المختص."
    6. التواريخ: افهم مصطلحات "اليوم" و"غداً" وحولها لتاريخ تقريبي أو اقبلها كما هي.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [bookAppointmentTool] }],
    },
  });
};

// Mock function to simulate booking execution on the client side
const executeBooking = async (args: any) => {
  console.log("Booking Request Received:", args);
  // In a real app, this would be an API call to your backend
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    status: 'success',
    bookingId: Math.floor(Math.random() * 10000),
    message: `تم تأكيد الحجز بنجاح للمريض ${args.patientName} مع ${args.doctorName} في ${args.date} الساعة ${args.time}.`
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
    // We send the user message. We act on the response to see if it's a tool call or text.
    let response = await chatSession.sendMessage({ message });
    
    // Check for Function Calls
    const functionCalls = response.functionCalls;
    
    if (functionCalls && functionCalls.length > 0) {
        // Handle the function call
        const call = functionCalls[0];
        if (call.name === 'bookAppointment') {
            // Yield a temporary message to the UI (optional, but good UX)
            // yield "جاري تأكيد الحجز..."; 
            
            // Execute the function
            const result = await executeBooking(call.args);
            
            // Send the result back to Gemini
            response = await chatSession.sendToolResponse({
                functionResponses: [{
                    id: call.id,
                    name: call.name,
                    response: { result: result }
                }]
            });
        }
    }

    // Create a generator to yield the final text
    async function* streamGenerator() {
      if (response.text) {
        // Simple simulation of streaming for the final block of text
        // since we used sendMessage (blocking) to handle tools easily.
        const words = response.text.split(' ');
        for (const word of words) {
            yield word + ' ';
            await new Promise(r => setTimeout(r, 20)); // tiny delay for effect
        }
      }
    }

    return streamGenerator();

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    // Reset session on error just in case
    chatSession = null;
    throw error;
  }
};