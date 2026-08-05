/* =========================================================
   IFB Service Center Anantapur — services-manager.js
   Manages client custom services, default services, and localStorage persistence
   ========================================================= */

const SERVICES_STORAGE_KEY = 'ifb_custom_services_v2';

const DEFAULT_SERVICES = [
  {
    id: 'front-load',
    title: 'Front Load Washing Machine Repair',
    icon: '🫧',
    image: 'images/service-washing-machine.png',
    priceRange: '₹299 – ₹3,500',
    description: 'Specialized doorstep repair for IFB, LG, Samsung, Bosch, Whirlpool front load washing machines. Drum bearing, oil seal, spider arm, PCB control board, and door gasket replacement.',
    issues: ['Not spinning or loud drum noise', 'Water leaking from front door gasket', 'Drain pump blocked / water not draining', 'Door lock error (E01/dE/E4)', 'PCB control board failure', 'Machine vibrating / shaking excessively', 'Child lock / program stuck'],
    pricing: [
      { name: 'Inspection & Diagnosis', cost: '₹299 (free with repair)' },
      { name: 'Drum Bearing & Oil Seal Replacement', cost: '₹1,400 – ₹2,400' },
      { name: 'PCB / Control Board Repair', cost: '₹1,500 – ₹3,500' }
    ]
  },
  {
    id: 'top-load',
    title: 'Top Load & Semi-Auto Repair',
    icon: '🫧',
    image: 'images/service-washing-machine.png',
    priceRange: '₹299 – ₹2,800',
    description: 'Expert repair for Top Load Fully Automatic and Semi-Automatic washing machines. Gearbox replacement, motor rewinding, agitator fix, and water inlet valve service.',
    issues: ['Wash / Spin tub not rotating', 'Drain valve stuck or leaking', 'Pulsator / Agitator loose', 'Motor humming sound without spinning', 'Water filling continuously', 'Spin dryer vibration'],
    pricing: [
      { name: 'Inspection & Diagnosis', cost: '₹299' },
      { name: 'Gearbox / Clutch Assembly', cost: '₹1,200 – ₹2,200' },
      { name: 'Spin & Wash Motor Repair', cost: '₹1,100 – ₹2,500' }
    ]
  },
  {
    id: 'installation',
    title: 'Installation & Relocation',
    icon: '🔩',
    image: 'images/hero-technician.png',
    priceRange: '₹499 – ₹1,200',
    description: 'Professional unboxing, wall mounting, plumbing connection, precision leveling, anti-vibration pad setup, and test run for new and relocated washing machines.',
    issues: ['New Front Load unboxing & transit bolt removal', 'Water inlet tap adapter fitting', 'Drain hose plumbing attachment', 'Machine leveling & anti-vibration setup', 'Relocation & demounting service'],
    pricing: [
      { name: 'Washing Machine Unbox & Setup', cost: '₹499' },
      { name: 'Transit Bolt Removal & Leveling', cost: '₹399' },
      { name: 'Complete Demounting & Relocation', cost: '₹799 – ₹1,200' }
    ]
  },
  {
    id: 'amc',
    title: 'Annual Maintenance Contract (AMC)',
    icon: '🛡️',
    image: 'images/service-center-store.png',
    priceRange: '₹1,499 / year',
    description: 'Protect your washing machine year-round. Includes 2 free preventive maintenance visits, descaling & drum cleaning, priority service within 2 hours, and 15% discount on all spare parts.',
    issues: ['2 Free Preventive Servicings per year', 'Free Tub Descaling & Drum Flush', 'Zero labor charges on all repairs', '15% discount on genuine OEM spare parts', 'Priority technician dispatch within 2 hours'],
    pricing: [
      { name: 'Front Load Washing Machine AMC', cost: '₹1,499 / year' },
      { name: 'Top Load Washing Machine AMC', cost: '₹1,199 / year' },
      { name: 'Semi-Automatic Washing Machine AMC', cost: '₹899 / year' }
    ]
  }
];

const ServicesManager = {
  getServices() {
    try {
      const data = localStorage.getItem(SERVICES_STORAGE_KEY);
      if (data) {
        let services = JSON.parse(data);
        let updated = false;
        services = services.map(s => {
          if (!s.image) {
            const def = DEFAULT_SERVICES.find(d => d.id === s.id);
            if (def && def.image) {
              updated = true;
              return { ...s, image: def.image };
            }
          }
          return s;
        });
        if (updated) this.saveServices(services);
        return services;
      }
    } catch (e) {
      console.warn('Could not read custom services from localStorage:', e);
    }
    // Seed default services
    this.saveServices(DEFAULT_SERVICES);
    return DEFAULT_SERVICES;
  },

  saveServices(services) {
    try {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save custom services to localStorage:', e);
    }
  },

  addService(service) {
    const services = this.getServices();
    const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newService = {
      id: slug + '-' + Date.now().toString().slice(-4),
      title: service.title,
      icon: service.icon || '🛠️',
      priceRange: service.priceRange || '₹299 – ₹2,500',
      description: service.description || '',
      issues: Array.isArray(service.issues) ? service.issues : (service.issues ? service.issues.split(',').map(s => s.trim()).filter(Boolean) : []),
      pricing: service.pricing || [
        { name: 'Inspection & Diagnosis', cost: '₹299' },
        { name: 'Standard Repair', cost: service.priceRange || '₹500 – ₹1,500' }
      ]
    };
    services.push(newService);
    this.saveServices(services);
    return newService;
  },

  deleteService(id) {
    let services = this.getServices();
    services = services.filter(s => s.id !== id);
    this.saveServices(services);
    return services;
  },

  resetDefaults() {
    this.saveServices(DEFAULT_SERVICES);
    return DEFAULT_SERVICES;
  }
};

window.ServicesManager = ServicesManager;
