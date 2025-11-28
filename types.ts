export enum Specialty {
  GENERAL = 'طب عام',
  CARDIOLOGY = 'القلب والأوعية الدموية',
  DERMATOLOGY = 'الجلدية والتجميل',
  PEDIATRICS = 'طب الأطفال',
  DENTISTRY = 'طب الأسنان',
  ORTHOPEDICS = 'العظام والمفاصل',
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  image: string;
  experience: string;
  availability: string[];
  price: number;
}

export interface Appointment {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
}

export type ViewState = 'HOME' | 'DOCTORS' | 'BOOKING' | 'CONTACT';
