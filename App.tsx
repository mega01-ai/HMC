import React, { useState } from 'react';
import { 
  Menu, X, Phone, Calendar, Star, MapPin, 
  Stethoscope, Activity, Heart, UserPlus, ArrowRight, Clock,
  Baby, Sparkles, Smile, Filter
} from 'lucide-react';
import { DOCTORS, NAV_LINKS } from './constants';
import { Doctor, Specialty, ViewState } from './types';
import Assistant from './components/Assistant';
import BookingModal from './components/BookingModal';

// Logo URL provided
const LOGO_URL = "https://archive.org/download/334212488-896143051604337-7847414107783077968-n-removebg-preview/334212488_896143051604337_7847414107783077968_n-removebg-preview.png";

interface NavItemProps {
  id: string;
  label: string;
  isMobile?: boolean;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, isMobile = false, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`${
      isActive 
        ? 'text-primary-400 font-bold' 
        : 'text-gray-300 hover:text-primary-400'
    } transition-colors ${isMobile ? 'text-lg py-2' : ''}`}
  >
    {label}
  </button>
);

// Map specialties to icons and descriptions for the UI
const DEPARTMENTS = [
  { id: Specialty.CARDIOLOGY, title: 'القلب والأوعية الدموية', icon: Heart, desc: 'تشخيص وعلاج أمراض القلب بأحدث الأجهزة' },
  { id: Specialty.GENERAL, title: 'طب عام وطوارئ', icon: Stethoscope, desc: 'رعاية فورية للحالات الطارئة على مدار الساعة' },
  { id: Specialty.DERMATOLOGY, title: 'الجلدية والتجميل', icon: Sparkles, desc: 'علاجات تجميلية وعناية متكاملة بالبشرة' },
  { id: Specialty.PEDIATRICS, title: 'طب الأطفال', icon: Baby, desc: 'رعاية شاملة لصحة طفلك ونموه' },
  { id: Specialty.DENTISTRY, title: 'طب الأسنان', icon: Smile, desc: 'خدمات تجميل وعلاج الأسنان المتكاملة' },
  { id: Specialty.ORTHOPEDICS, title: 'العظام والمفاصل', icon: Activity, desc: 'علاج آلام المفاصل والكسور والعمود الفقري' },
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  const handleBookNow = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
    } else {
      setCurrentView('DOCTORS');
      setSelectedSpecialty(null); // Reset filter when clicking generic book now
    }
  };

  const handleNavClick = (id: string, isMobile: boolean) => {
    setCurrentView(id as ViewState);
    if (id === 'DOCTORS') {
      setSelectedSpecialty(null); // Show all doctors when clicking nav link
    }
    if (isMobile) setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDepartmentClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setCurrentView('DOCTORS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter doctors based on view and selection
  const getDisplayedDoctors = () => {
    let list = DOCTORS;
    
    // If on HOME view, we typically show a slice, but let's stick to the list logic
    if (currentView === 'HOME') {
      return list.slice(0, 3);
    }

    // If on DOCTORS view, apply filter if exists
    if (selectedSpecialty) {
      list = list.filter(d => d.specialty === selectedSpecialty);
    }

    return list;
  };

  const displayedDoctors = getDisplayedDoctors();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans text-gray-100">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => {
              setCurrentView('HOME');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative">
              <img 
                src={LOGO_URL} 
                alt="HMC Logo" 
                className="w-12 h-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100 leading-none">مجمع هنا الطبي</h1>
              <span className="text-xs text-primary-500 font-medium tracking-wider">HMC</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <NavItem 
                key={link.id}
                id={link.id}
                label={link.label}
                isActive={currentView === link.id}
                onClick={() => handleNavClick(link.id, false)}
              />
            ))}
            <button 
              onClick={() => handleNavClick('DOCTORS', false)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-primary-900/50"
            >
              حجز موعد
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 absolute w-full flex flex-col gap-2 shadow-xl animate-in slide-in-from-top-5">
            {NAV_LINKS.map(link => (
              <NavItem 
                key={link.id}
                id={link.id}
                label={link.label}
                isMobile
                isActive={currentView === link.id}
                onClick={() => handleNavClick(link.id, true)}
              />
            ))}
            <button 
              onClick={() => {
                handleNavClick('DOCTORS', true);
              }}
              className="mt-2 bg-primary-600 text-white w-full py-3 rounded-xl font-bold"
            >
              حجز موعد
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* HOME VIEW */}
        {currentView === 'HOME' && (
          <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 py-20 lg:py-28">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-6 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-700 text-primary-400 text-sm font-medium animate-in slide-in-from-bottom-3 fade-in duration-700">
                    <Star size={16} className="fill-current" />
                    أفضل رعاية طبية في المنطقة
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                    رعايتكم.. <span className="text-primary-500">أمانتنا</span>
                    <br />
                    وصحتكم أولويتنا
                  </h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    في مجمع هنا الطبي، نجمع بين الخبرة الطبية العريقة وأحدث التقنيات لضمان أفضل رعاية لكم ولعائلتكم. أطباؤنا متاحون لخدمتكم على مدار الساعة.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <button 
                      onClick={() => handleNavClick('DOCTORS', false)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-900/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                      <Calendar size={20} />
                      احجز موعد الآن
                    </button>
                    <button 
                      onClick={() => handleNavClick('CONTACT', false)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-100 border-2 border-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                      <Phone size={20} />
                      تواصل معنا
                    </button>
                  </div>
                </div>
                <div className="relative animate-in slide-in-from-left-10 duration-1000">
                  <div className="absolute inset-0 bg-primary-600 rounded-[3rem] rotate-3 opacity-10 blur-3xl"></div>
                  <img 
                    src="https://archive.org/download/1764392388981/__ia_thumb.jpg" 
                    alt="Happy People" 
                    className="relative rounded-[2.5rem] shadow-2xl w-full object-cover h-[400px] lg:h-[500px]"
                  />
                  
                  {/* Floating Card */}
                  <div className="absolute -bottom-6 -right-6 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hidden lg:block animate-bounce [animation-duration:3s]">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-900/30 p-3 rounded-full text-green-400">
                        <UserPlus size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">أكثر من</p>
                        <p className="text-xl font-bold text-gray-100">١٠,٠٠٠ مريض</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services / Departments Preview */}
            <section className="py-20 bg-gray-950">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">الأقسام الطبية</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">نقدم مجموعة واسعة من الخدمات الطبية المتخصصة بأعلى معايير الجودة</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {DEPARTMENTS.map((dept, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleDepartmentClick(dept.id)}
                      className="group p-8 rounded-3xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-primary-900 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-primary-400 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                        <dept.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-primary-400 transition-colors">{dept.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{dept.desc}</p>
                      <div className="mt-4 flex items-center gap-2 text-primary-400 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                         عرض الأطباء <ArrowRight size={16} className="rtl:rotate-180" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* DOCTORS VIEW */}
        {(currentView === 'DOCTORS' || currentView === 'HOME') && (
          <section id="doctors" className={`py-20 ${currentView === 'HOME' ? 'bg-gray-900' : 'bg-gray-950 pt-10'}`}>
            <div className="container mx-auto px-4 lg:px-8">
              {currentView === 'HOME' && (
                <div className="flex justify-between items-end mb-12">
                   <div>
                      <h2 className="text-3xl font-bold text-white mb-2">نخبة الأطباء</h2>
                      <p className="text-gray-400">اختر طبيبك واحجز موعدك بكل سهولة</p>
                   </div>
                   <button 
                      onClick={() => handleNavClick('DOCTORS', false)}
                      className="hidden md:flex items-center gap-2 text-primary-400 font-bold hover:text-primary-500 transition"
                   >
                      عرض الكل <ArrowRight size={20} className="rtl:rotate-180" />
                   </button>
                </div>
              )}

              {currentView === 'DOCTORS' && (
                <div className="mb-12">
                   <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-4xl font-bold text-white mb-4">قائمة الأطباء</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">فريق طبي متكامل من أفضل الاستشاريين والأخصائيين جاهز لخدمتكم</p>
                  </div>
                  
                  {/* Filter Status */}
                  {selectedSpecialty && (
                    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95">
                      <div className="flex items-center gap-3 bg-primary-900/30 px-6 py-3 rounded-full border border-primary-900">
                        <Filter size={18} className="text-primary-400" />
                        <span className="text-gray-300">تصفح: <span className="font-bold text-primary-300">{selectedSpecialty}</span></span>
                        <button 
                          onClick={() => setSelectedSpecialty(null)}
                          className="mr-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 text-gray-400 transition"
                          title="إلغاء التصنيف"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {displayedDoctors.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedDoctors.map((doctor, idx) => (
                    <div 
                      key={doctor.id} 
                      className="bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-700 hover:shadow-xl hover:border-primary-800 transition-all duration-300 group animate-in zoom-in-50"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-24 h-24 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300 border border-gray-700"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-gray-800">
                            متاح
                          </div>
                        </div>
                        <div className="bg-primary-900/40 text-primary-300 px-3 py-1 rounded-lg text-sm font-semibold border border-primary-900/50">
                          {doctor.specialty}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-100 mb-1">{doctor.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{doctor.experience}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={16} className="text-primary-400" />
                          <span>أقرب موعد: <span className="font-semibold text-gray-200">{doctor.availability[0]}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="font-bold text-gray-200">{doctor.price} جنيه</div>
                          <span className="text-xs">/ كشفية</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleBookNow(doctor)}
                        className="w-full py-3 rounded-xl bg-gray-700 text-gray-200 font-bold hover:bg-primary-600 hover:text-white transition-all duration-300 border border-gray-600 hover:border-transparent"
                      >
                        حجز موعد
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-3xl border border-gray-800">
                   <p className="text-lg">لا يوجد أطباء متاحين في هذا القسم حالياً.</p>
                   <button 
                     onClick={() => setSelectedSpecialty(null)}
                     className="mt-4 text-primary-400 font-bold hover:underline"
                   >
                     عرض جميع الأطباء
                   </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CONTACT VIEW */}
        {currentView === 'CONTACT' && (
          <div className="py-20 container mx-auto px-4 animate-in fade-in">
             <div className="max-w-4xl mx-auto bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-700">
                <div className="grid md:grid-cols-2">
                   <div className="bg-primary-700 p-12 text-white flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-6">تواصل معنا</h2>
                        <p className="text-primary-100 mb-8 leading-relaxed">
                           نحن هنا للإجابة على جميع استفساراتكم. يمكنكم التواصل معنا عبر الهاتف أو زيارة المجمع.
                        </p>
                        
                        <div className="space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="bg-white/10 p-3 rounded-xl">
                                 <Phone size={24} />
                              </div>
                              <div>
                                 <p className="text-sm text-primary-200">رقم الهاتف</p>
                                 <p className="font-bold font-mono text-lg" dir="ltr">+20 10 1234 5678</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="bg-white/10 p-3 rounded-xl">
                                 <MapPin size={24} />
                              </div>
                              <div>
                                 <p className="text-sm text-primary-200">الموقع</p>
                                 <p className="font-bold">القاهرة، مدينة الشروق</p>
                              </div>
                           </div>
                        </div>
                      </div>
                      
                      <div className="mt-12">
                         <p className="text-sm text-primary-200">ساعات العمل</p>
                         <p className="font-bold">السبت - الخميس: ٩:٠٠ ص - ١٠:٠٠ م</p>
                      </div>
                   </div>

                   <div className="p-12 bg-gray-800">
                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                         <h3 className="text-xl font-bold text-gray-100 mb-4">أرسل لنا رسالة</h3>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">الاسم</label>
                            <input type="text" className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="الاسم الكريم" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                            <input type="email" className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="example@email.com" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">الرسالة</label>
                            <textarea rows={4} className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                         </div>
                         <button className="w-full bg-gray-100 text-gray-900 font-bold py-3 rounded-xl hover:bg-white transition">
                            إرسال الرسالة
                         </button>
                      </form>
                   </div>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 border-t border-gray-900">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4 text-white">
               <div className="bg-gray-800 p-1.5 rounded-lg border border-gray-700">
                  <img src={LOGO_URL} alt="HMC Logo" className="w-8 h-8 object-contain" />
               </div>
               <h2 className="text-xl font-bold">مجمع هنا الطبي</h2>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              وجهتكم الأولى للرعاية الطبية المتكاملة. نلتزم بتقديم أفضل الخدمات الطبية بأحدث التقنيات وأفضل الكوادر.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => {
                      setCurrentView(link.id as ViewState);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-primary-500 transition"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              <li>القاهرة، مدينة الشروق، مصر</li>
              <li dir="ltr">info@hmc.eg</li>
              <li dir="ltr">+20 10 1234 5678</li>
            </ul>
          </div>
        </div>

        {/* Strategic Partners Section */}
        <div className="container mx-auto px-4 mt-12 py-8 border-t border-gray-900 flex flex-col items-center justify-center">
           <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-6">شركاء النجاح</p>
           <img 
             src="https://archive.org/download/t-401764392966549/T401764392966549.png" 
             alt="Strategic Partnership" 
             className="h-20 md:h-24 object-contain opacity-80 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0"
           />
        </div>

        <div className="container mx-auto px-4 pt-8 border-t border-gray-900 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} مجمع هنا الطبي (HMC). جميع الحقوق محفوظة.
        </div>
      </footer>

      {/* Floating Elements */}
      <Assistant />
      
      {selectedDoctor && (
        <BookingModal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </div>
  );
}

export default App;