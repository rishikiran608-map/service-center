/* =========================================================
   IFB Service Center Anantapur — services-manager.js
   Manages client custom services, default services, and localStorage persistence
   ========================================================= */

const SERVICES_STORAGE_KEY = 'ifb_custom_services_v1';

const DEFAULT_SERVICES = [
  {
    id: 'washing-machine',
    title: 'Washing Machine Repair',
    icon: '🫧',
    image: 'images/service-washing-machine.png',
    priceRange: '₹299 – ₹3,500',
    description: 'We service all washing machine types — IFB, LG, Samsung, Whirlpool, Godrej, Bosch — front load, top load, and semi-automatic. Our technicians carry common spare parts for same-day fixes.',
    issues: ['Not spinning', 'Water not draining', 'Drum noise / vibration', 'Door latch broken', 'PCB / control board failure', 'Motor not working', 'Water leaking', 'Error codes', 'Drum bearing worn', 'Inlet valve blocked'],
    pricing: [
      { name: 'Diagnosis / Inspection', cost: '₹299 (adjusted if repaired)' },
      { name: 'Minor repairs (belts, valves)', cost: '₹500 – ₹1,200' },
      { name: 'PCB / Motor replacement', cost: '₹1,500 – ₹3,500' }
    ]
  },
  {
    id: 'ac',
    title: 'AC Repair & Gas Refill',
    icon: '❄️',
    image: 'images/service-ac-repair.png',
    priceRange: '₹399 – ₹4,500',
    description: 'Complete air conditioner repair, servicing, gas charging (R32, R410A, R22), and jet pump coil washing for Split and Window ACs of all tonnage.',
    issues: ['Not cooling properly', 'Gas leak / low refrigerant', 'Water leakage from indoor unit', 'Foul smell or low airflow', 'Compressor tripping', 'Noise from outdoor unit', 'Remote control / sensor issue', 'Capacitor failure'],
    pricing: [
      { name: 'General Wet / Foam Service', cost: '₹499' },
      { name: 'Gas Charging (R32/R410A)', cost: '₹2,200 – ₹2,800' },
      { name: 'Compressor / Motor Repair', cost: '₹2,500 – ₹4,500' }
    ]
  },
  {
    id: 'refrigerator',
    title: 'Refrigerator Repair',
    icon: '🧊',
    image: 'images/service-refrigerator.png',
    priceRange: '₹349 – ₹3,800',
    description: 'Expert repair for Single Door, Double Door, and Side-by-Side Inverter refrigerators. Gas charging, compressor replacement, thermostat & defrost timer fixes.',
    issues: ['Refrigerator not cooling', 'Freezer frosting excessively', 'Water leaking on floor', 'Loud humming / clicking sound', 'Compressor not starting', 'Thermostat faulty', 'Door seal / gasket damaged'],
    pricing: [
      { name: 'Inspection & General Checkup', cost: '₹349' },
      { name: 'Gas Charging & Sealed System Repair', cost: '₹1,800 – ₹2,600' },
      { name: 'Inverter Compressor Swap', cost: '₹2,800 – ₹3,800' }
    ]
  },
  {
    id: 'installation',
    title: 'Installation & Unboxing',
    icon: '🔩',
    image: 'images/hero-technician.png',
    priceRange: '₹499 – ₹1,800',
    description: 'Professional unboxing, wall mounting, plumbing connection, leveling, and testing for new and relocated washing machines and AC units.',
    issues: ['New Front Load installation', 'Split AC full unit mounting', 'Demounting & relocation', 'Copper piping & insulation', 'Drain pipe plumbing connection'],
    pricing: [
      { name: 'Washing Machine Unbox & Leveling', cost: '₹499' },
      { name: 'Split AC Wall Mount Installation', cost: '₹1,499' },
      { name: 'Demounting Service', cost: '₹699' }
    ]
  },
  {
    id: 'amc',
    title: 'Annual Maintenance Contract (AMC)',
    icon: '🛡️',
    image: 'images/service-center-store.png',
    priceRange: '₹1,499 / year',
    description: 'Protect your appliances year-round. Includes 2 free preventive maintenance visits, priority service within 2 hours, and 15% discount on all spare parts.',
    issues: ['2 Free Wet Servicings per year', 'Zero labor charges on repairs', '15% discount on genuine spare parts', 'Priority technician dispatch within 2 hours', 'Complete safety and electrical inspection'],
    pricing: [
      { name: 'Washing Machine AMC Plan', cost: '₹1,499 / year' },
      { name: 'Split AC AMC Plan', cost: '₹1,999 / year' },
      { name: 'Combo Appliance AMC (Washing + AC + Fridge)', cost: '₹3,999 / year' }
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
