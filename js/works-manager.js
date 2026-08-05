/* =========================================================
   IFB Service Center Anantapur — works-manager.js
   Manages Past Works & Upcoming Works photo gallery & client photo uploads
   ========================================================= */

const STORAGE_KEY = 'ifb_works_photos_v2';

const DEFAULT_WORKS = [
  {
    id: 'work-jd1',
    title: 'Our IFB Certified Technician — Ready for Doorstep Service',
    category: 'washing-machine',
    type: 'past',
    description: 'Meet our IFB-trained technician, always in uniform and ready with tools for on-site appliance repair.',
    date: '2024-02-07',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #0f3460, #2563eb)',
    image: 'images/justdial/photo1.jpg'
  },
  {
    id: 'work-jd2',
    title: 'Genuine IFB Spare Parts — Always in Stock',
    category: 'washing-machine',
    type: 'past',
    description: 'We keep genuine IFB spare parts ready at our center for fast same-day repairs.',
    date: '2024-02-07',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #1a0533, #6a29a8)',
    image: 'images/justdial/photo2.jpg'
  },
  {
    id: 'work-jd3',
    title: 'Our Service Center Office — Anantapur',
    category: 'installation',
    type: 'past',
    description: 'Inside our service center office — where we manage bookings, parts inventory, and customer support.',
    date: '2024-03-04',
    icon: '🔩',
    bg: 'linear-gradient(135deg, #1c3a1a, #2d6a28)',
    image: 'images/justdial/photo3.jpg'
  },
  {
    id: 'work-jd4',
    title: 'IFB Care — Authorized Service Partner',
    category: 'washing-machine',
    type: 'past',
    description: 'We are a registered IFB Care service partner — trusted for quality repairs with genuine parts.',
    date: '2024-01-15',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
    image: 'images/justdial/photo4.jpg'
  },
  {
    id: 'work-jd5',
    title: 'IFB Elite Aqua SX — Front Load Washing Machine',
    category: 'washing-machine',
    type: 'past',
    description: 'IFB Elite Aqua SX 7kg front load with 3D Wash, Crescent Moon Drum — serviced and installed by our team.',
    date: '2024-03-10',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #854d0e, #eab308)',
    image: 'images/justdial/photo5.jpg'
  },
  {
    id: 'work-1',
    title: 'IFB Front Load — Drum Bearing Replacement',
    category: 'washing-machine',
    type: 'past',
    description: 'Replaced rusted drum bearing & oil seal. Restored smooth & silent spinning operation.',
    date: '2026-07-20',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #0f3460, #2563eb)',
    image: 'images/service-washing-machine.png'
  },
  {
    id: 'work-2',
    title: 'Upcoming: Free AC Health Inspection Camp — Anantapur Town',
    category: 'ac',
    type: 'upcoming',
    description: 'Upcoming multi-point AC checkup camp covering cooling efficiency, gas pressure & electrical safety.',
    date: '2026-08-10',
    icon: '📅',
    bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    image: 'images/service-ac-repair.png'
  },
  {
    id: 'work-3',
    title: 'LG Split AC — R32 Gas Refill & Deep Coil Cleaning',
    category: 'ac',
    type: 'past',
    description: 'Resolved cooling issues by restoring refrigerant pressure and pressure-cleaning condenser coils.',
    date: '2026-07-18',
    icon: '❄️',
    bg: 'linear-gradient(135deg, #0d2247, #1a4d8f)',
    image: 'images/service-ac-repair.png'
  },
  {
    id: 'work-4',
    title: 'Upcoming: Monsoon Washing Machine Care Drive',
    category: 'washing-machine',
    type: 'upcoming',
    description: 'Special upcoming service drive for moisture protection, door seal cleaning & inlet filter flushing.',
    date: '2026-08-15',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #311042, #7c3aed)',
    image: 'images/service-washing-machine.png'
  },
  {
    id: 'work-5',
    title: 'Samsung Double Door — Inverter Compressor Swap',
    category: 'refrigerator',
    type: 'past',
    description: 'Installed genuine digital inverter compressor with complete nitrogen flushing & gas recharge.',
    date: '2026-07-12',
    icon: '🧊',
    bg: 'linear-gradient(135deg, #0a2744, #0f5f8a)',
    image: 'images/service-refrigerator.png'
  },
  {
    id: 'work-6',
    title: 'IFB Washing Machine — Wall Mount & Anti-Vibration Setup',
    category: 'installation',
    type: 'past',
    description: 'Complete unboxing, leveling, plumbing attachment, and anti-vibration pad installation.',
    date: '2026-07-05',
    icon: '🔩',
    bg: 'linear-gradient(135deg, #1c3a1a, #2d6a28)',
    image: 'images/hero-technician.png'
  },
  {
    id: 'work-7',
    title: 'Upcoming: Commercial Refrigerator AMC Maintenance Project',
    category: 'refrigerator',
    type: 'upcoming',
    description: 'Scheduled preventive maintenance drive for hotel & restaurant commercial refrigeration units.',
    date: '2026-08-20',
    icon: '🧊',
    bg: 'linear-gradient(135deg, #064e3b, #10b981)',
    image: 'images/service-refrigerator.png'
  },
  {
    id: 'work-8',
    title: 'IFB Executive Washing Machine — PCB Repair',
    category: 'washing-machine',
    type: 'past',
    description: 'Diagnosed and fixed power circuit error on main control board. Tested for 3 full cycles.',
    date: '2026-06-28',
    icon: '🫧',
    bg: 'linear-gradient(135deg, #1a0533, #6a29a8)',
    image: 'images/service-washing-machine.png'
  },
  {
    id: 'work-9',
    title: 'Daikin 1.5 Ton AC — Outdoor Fan Motor Replacement',
    category: 'ac',
    type: 'past',
    description: 'Replaced jammed outdoor condenser fan motor and run capacitor. Restored instant cooling.',
    date: '2026-06-22',
    icon: '❄️',
    bg: 'linear-gradient(135deg, #3a1a0a, #c05a10)',
    image: 'images/service-ac-repair.png'
  },
  {
    id: 'work-10',
    title: 'Upcoming: Multi-Split AC Installation Project in New Apartments',
    category: 'installation',
    type: 'upcoming',
    description: 'New upcoming installation project of 12 multi-split AC units with concealed copper piping.',
    date: '2026-09-01',
    icon: '🔩',
    bg: 'linear-gradient(135deg, #78350f, #d97706)',
    image: 'images/service-center-store.png'
  }
];

const WorksManager = {
  getWorks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      let storedWorks = [];
      if (data) {
        storedWorks = JSON.parse(data);
      }
      
      // Ensure all DEFAULT_WORKS are present and have their latest images
      const storedMap = new Map(storedWorks.map(w => [w.id, w]));
      const mergedDefaults = DEFAULT_WORKS.map(def => {
        const stored = storedMap.get(def.id);
        if (!stored) return def;
        return { ...stored, image: def.image || stored.image };
      });
      
      // Include any user-created custom items (not in DEFAULT_WORKS)
      const defaultIds = new Set(DEFAULT_WORKS.map(d => d.id));
      const customItems = storedWorks.filter(w => !defaultIds.has(w.id));
      
      const result = [...mergedDefaults, ...customItems];
      this.saveWorks(result);
      return result;
    } catch (e) {
      console.warn('Could not read works from localStorage:', e);
      return DEFAULT_WORKS;
    }
  },

  saveWorks(works) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    } catch (e) {
      console.error('Failed to save works to localStorage:', e);
    }
  },

  addWork(item) {
    const works = this.getWorks();
    const newItem = {
      id: 'work-' + Date.now(),
      title: item.title,
      category: item.category || 'washing-machine',
      type: item.type || 'past',
      description: item.description || '',
      date: item.date || new Date().toISOString().split('T')[0],
      icon: item.type === 'upcoming' ? '📅' : (item.category === 'ac' ? '❄️' : (item.category === 'refrigerator' ? '🧊' : (item.category === 'installation' ? '🔩' : '🫧'))),
      bg: item.type === 'upcoming' ? 'linear-gradient(135deg, #1e3a8a, #0284c7)' : 'linear-gradient(135deg, #0f3460, #2563eb)',
      image: item.image || ''
    };
    works.unshift(newItem);
    this.saveWorks(works);
    return newItem;
  },

  deleteWork(id) {
    let works = this.getWorks();
    works = works.filter(w => w.id !== id);
    this.saveWorks(works);
    return works;
  },

  resetDefaults() {
    this.saveWorks(DEFAULT_WORKS);
    return DEFAULT_WORKS;
  }
};

window.WorksManager = WorksManager;
