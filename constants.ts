import { Doctor, Specialty } from './types';

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'د. أحمد المنصوري',
    specialty: Specialty.CARDIOLOGY,
    image: 'https://picsum.photos/id/1005/400/400',
    experience: '١٥ سنة خبرة',
    availability: ['٠٩:٠٠ ص', '١٠:٣٠ ص', '٠١:٠٠ م'],
    price: 400,
  },
  {
    id: '2',
    name: 'د. سارة العلي',
    specialty: Specialty.DERMATOLOGY,
    image: 'https://picsum.photos/id/1027/400/400',
    experience: '١٠ سنوات خبرة',
    availability: ['١١:٠٠ ص', '٠٢:٠٠ م', '٠٤:٣٠ م'],
    price: 350,
  },
  {
    id: '3',
    name: 'د. عمر خالد',
    specialty: Specialty.PEDIATRICS,
    image: 'https://picsum.photos/id/1012/400/400',
    experience: '٨ سنوات خبرة',
    availability: ['٠٩:٣٠ ص', '١٢:٠٠ م', '٠٣:٠٠ م'],
    price: 250,
  },
  {
    id: '4',
    name: 'د. ليلى حسن',
    specialty: Specialty.DENTISTRY,
    image: 'https://picsum.photos/id/342/400/400',
    experience: '١٢ سنة خبرة',
    availability: ['١٠:٠٠ ص', '٠١:٣٠ م', '٠٥:٠٠ م'],
    price: 300,
  },
  {
    id: '5',
    name: 'د. فهد السالم',
    specialty: Specialty.ORTHOPEDICS,
    image: 'https://picsum.photos/id/1001/400/400',
    experience: '٢٠ سنة خبرة',
    availability: ['٠٨:٠٠ ص', '١١:٠٠ ص'],
    price: 450,
  },
  {
    id: '6',
    name: 'د. مريم عبدالله',
    specialty: Specialty.GENERAL,
    image: 'https://picsum.photos/id/64/400/400',
    experience: '٥ سنوات خبرة',
    availability: ['طوال اليوم'],
    price: 150,
  },
];

export const NAV_LINKS = [
  { id: 'HOME', label: 'الرئيسية' },
  { id: 'DOCTORS', label: 'أطباؤنا' },
  { id: 'CONTACT', label: 'اتصل بنا' },
];