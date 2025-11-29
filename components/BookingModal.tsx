import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Doctor } from '../types';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep(3);
    }, 1000);
    setStep(2); // Loading state if needed, jumping to success for demo
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-700">
        
        {/* Header */}
        <div className="bg-primary-700 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">حجز موعد</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 shadow-sm" />
                <div>
                  <p className="text-sm text-gray-400 font-medium">أنت تحجز مع</p>
                  <h3 className="text-lg font-bold text-white">{doctor.name}</h3>
                  <p className="text-sm text-primary-400">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">الاسم الكامل</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">رقم الهاتف</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">التاريخ</label>
                    <div className="relative">
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition [color-scheme:dark]"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                      <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">الوقت</label>
                    <select 
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    >
                      <option value="">اختر الوقت</option>
                      {doctor.availability.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1">ملاحظات إضافية (اختياري)</label>
                   <textarea 
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                   ></textarea>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-900/30 transition-all transform active:scale-[0.98]"
              >
                تأكيد الحجز
              </button>
            </form>
          )}

          {step === 2 && (
             <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="w-12 h-12 border-4 border-primary-900/50 border-t-primary-500 rounded-full animate-spin"></div>
                <p className="text-gray-400">جاري معالجة طلبك...</p>
             </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in zoom-in-50 duration-300">
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">تم الحجز بنجاح!</h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  شكراً لك {formData.name}. تم حجز موعدك مع {doctor.name} يوم {formData.date} الساعة {formData.time}.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition"
              >
                إغلاق
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;