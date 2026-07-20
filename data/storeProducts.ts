import {
  BadgeCheck,
  BatteryCharging,
  BookOpen,
  Cable,
  CheckCircle2,
  Code2,
  Cpu,
  Cuboid,
  Eye,
  Gauge,
  Radar,
  ShieldCheck,
  ShoppingCart,
  Users,
  Wrench,
} from 'lucide-react';

export const smartDoorProduct = {
  id: 'smart-door',
  slug: 'smart-door',
  title: 'Engineering Smart Door',
  subtitle: 'Build a smart door from idea to working prototype.',
  status: 'Pilot product',
  state: 'First store version',
  type: 'Course + maker adventure + physical kit',
  levelLabel: 'Level to confirm after pilot',
  priceLabel: 'Pilot offer to confirm',
  heroImage: '/images/makerlab/smart-door/smart-door-commercial-hero-v2.png',
  unboxingImage: '/images/makerlab/smart-door/smart-door-unboxing-kit-v1.png',
  packagingImage: '/images/makerlab/smart-door/smart-door-packaging-front-v1.png',
  description:
    'A guided STEM adventure where a learner designs the idea, understands the electronics, simulates the circuit, programs the behavior, assembles the MDF smart door, tests it, and can improve or customize the design.',
  storeCardText:
    'Not just a box to assemble. This is a course-guided maker adventure with CAD, circuit simulation, robotics, coding, assembly, testing and optional custom fabrication support.',
  promise:
    'Your child does not just follow instructions. They learn how a smart product is imagined, designed, coded, built, tested and improved.',
  highlights: ['Course + kit', 'CAD + simulation', 'micro:bit robotics', 'Customizable'],
  productSystem: [
    'CAD and laser-cut structure',
    'Electronics and code',
    'Printed guide and packaging',
    'Workshop and kit path',
  ],
  outcomes: [
    'Understand how a sensor can detect movement or distance',
    'Learn why the micro:bit, shield, servo, battery and wires are used',
    'Create or adapt a CAD version of the smart door',
    'Simulate the circuit before building',
    'Program the door behavior with a clear robotics logic',
    'Assemble, test and improve a real working prototype',
  ],
  components: [
    { icon: Cpu, label: 'micro:bit', note: 'Controller for the smart door behavior' },
    { icon: ShieldCheck, label: 'Shield / breakout', note: 'Cleaner connections for the build' },
    { icon: Gauge, label: '180-degree servo', note: 'Moves the sliding door mechanism' },
    { icon: Radar, label: 'Ultrasonic sensor', note: 'Detects distance for interaction tests' },
    { icon: BatteryCharging, label: 'Battery pack', note: 'Power source to confirm for final kit' },
    { icon: Cable, label: 'Wires + USB cable', note: 'Connect and program the micro:bit' },
    { icon: Cuboid, label: 'Laser-cut MDF parts', note: 'Real MakerLab CAD-based structure' },
    { icon: BookOpen, label: 'Robotics playbook guide', note: 'Design, simulate, code, build, test' },
  ],
  journey: [
    {
      icon: Cuboid,
      label: 'Design the door',
      text: 'Start from the Smart Door model, then understand the structure and how the sliding mechanism works. Starter version can use Tinkercad; advanced version can use Fusion 360.',
    },
    {
      icon: Eye,
      label: 'Simulate the circuit',
      text: 'Map the micro:bit, shield, ultrasonic sensor, servo, battery and wires before touching the physical parts.',
    },
    {
      icon: BookOpen,
      label: 'Learn the robotics idea',
      text: 'Use the playbook guide to understand what each component does and why the door needs it.',
    },
    {
      icon: Code2,
      label: 'Program the behavior',
      text: 'Create the logic: detect, decide, move the servo, test again, then improve the response.',
    },
    {
      icon: Wrench,
      label: 'Assemble the kit',
      text: 'Build the MDF structure, connect the electronics, and bring the digital work into the real world.',
    },
    {
      icon: CheckCircle2,
      label: 'Test and customize',
      text: 'Try the smart door, explain how it works, improve one part, then request MakerLab fabrication support for a custom CAD version if needed.',
    },
  ],
  difference: [
    {
      title: 'A course, not only parts',
      text: 'The guide teaches the product idea, the robotics logic, the circuit and the build process.',
    },
    {
      title: 'A real maker workflow',
      text: 'Learners move from CAD to simulation to code to assembly, like a small product studio.',
    },
    {
      title: 'Customization is part of the story',
      text: 'The learner can adapt the design, upload a CAD version, or ask MakerLab to print or laser-cut it.',
    },
  ],
  formats: [
    {
      title: 'Course + kit at home',
      status: 'Pilot setup',
      text: 'For families who want the guide, parts and electronics prepared as one adventure that can be completed with parent support.',
      action: 'Join the pilot waitlist',
      to: '/contact?subject=smart-door-kit',
      icon: ShoppingCart,
    },
    {
      title: 'Build it at MakerLab',
      status: 'Best first launch path',
      text: 'A guided session where learners design, build, ask questions, test the project and take the Smart Door home.',
      action: 'Ask for next session',
      to: '/contact?subject=smart-door-workshop',
      icon: Users,
    },
    {
      title: 'Customize and fabricate',
      status: 'MakerLab support',
      text: 'For learners who want to upload or bring a modified CAD version and ask MakerLab to print or laser-cut it.',
      action: 'Request custom support',
      to: '/contact?subject=smart-door-custom-cad',
      icon: BadgeCheck,
    },
  ],
} as const;

export const novaQuestMiniProduct = {
  id: 'nova-quest-mini',
  slug: 'nova-quest-mini',
  title: 'Nova Quest Mini',
  subtitle: 'Build your own rover robot from idea to exploration mission.',
  status: 'Pilot product',
  state: 'Second store prototype',
  type: 'Course + rover adventure + physical kit',
  levelLabel: 'Level to confirm after pilot',
  priceLabel: 'Pilot offer to confirm',
  heroImage: '/images/makerlab/nova-quest-mini/nova-quest-mini-commercial-hero-v1.png',
  unboxingImage: '/images/makerlab/nova-quest-mini/nova-quest-mini-commercial-hero-v1.png',
  packagingImage: '/images/makerlab/nova-quest-mini/nova-quest-mini-commercial-hero-v1.png',
  description:
    'A guided robotics adventure where a learner designs the rover chassis, places components, plans fabrication, simulates the circuit, programs movement with MakeCode, assembles the real MDF robot, tests it, and creates exploration challenges.',
  storeCardText:
    'A real MakerLab rover mission: CAD/design, laser-cut MDF structure, micro:bit electronics, circuit simulation, MakeCode programming, assembly, testing and mission challenges.',
  promise:
    'Your child learns how a robot is designed, powered, wired, programmed, built and tested - then turns it into an exploration mission.',
  highlights: ['Course + rover kit', 'CAD + laser cut', 'micro:bit + shield', 'MakeCode robotics'],
  productSystem: [
    'Laser-cut MDF rover chassis',
    'micro:bit electronics and wiring',
    'Circuit simulation and MakeCode',
    'Workshop, home and fabrication support path',
  ],
  outcomes: [
    'Understand the robot body, brain, energy, motors and software',
    'Design or adapt the rover chassis',
    'Place components and plan cable paths',
    'Simulate the battery, micro:bit and motor connections',
    'Program forward, backward and turning behavior',
    'Assemble, test and improve a real rover robot',
  ],
  components: [
    { icon: Cuboid, label: 'Laser-cut MDF chassis', note: 'Boxy real MakerLab rover body' },
    { icon: Gauge, label: 'Two side wheel motors/servos', note: 'Movement system to verify before final BOM' },
    { icon: Cpu, label: 'micro:bit', note: 'The robot brain and LED matrix' },
    { icon: ShieldCheck, label: 'micro:bit shield', note: 'Expansion board with easier connections' },
    { icon: BatteryCharging, label: 'Battery / power connection', note: 'Energy source to confirm for final kit' },
    { icon: Cable, label: 'Wires + USB cable', note: 'Connect and program the rover' },
    { icon: Wrench, label: 'Screws, spacers and accessories', note: 'Assembly hardware for the robot body' },
    { icon: BookOpen, label: 'Robotics playbook guide', note: 'Design, simulate, code, build, test' },
  ],
  journey: [
    {
      icon: Eye,
      label: 'Discover rover missions',
      text: 'Explore how robots can move through a mission area, avoid mistakes and complete challenges.',
    },
    {
      icon: Cuboid,
      label: 'Design the chassis',
      text: 'Understand the MDF body, wheel placement, component space and cable paths. Starter version can use prepared files; advanced version can adapt the CAD.',
    },
    {
      icon: Wrench,
      label: 'Prepare fabrication',
      text: 'Use prepared laser-cut parts or export a flat vector file when MakerLab fabrication support is available.',
    },
    {
      icon: ShieldCheck,
      label: 'Simulate the circuit',
      text: 'Plan battery, micro:bit shield and motor connections before wiring the real robot.',
    },
    {
      icon: Code2,
      label: 'Program movement',
      text: 'Use MakeCode blocks to make the rover move forward, backward and turn.',
    },
    {
      icon: CheckCircle2,
      label: 'Assemble and test',
      text: 'Build the rover, test it on the floor, fix wiring or movement problems, then create an exploration course.',
    },
  ],
  difference: [
    {
      title: 'A rover course, not a toy car',
      text: 'The learner studies body, energy, motors, electronics and software before the rover moves.',
    },
    {
      title: 'A fabrication workflow',
      text: 'The project connects CAD, vector export, laser cutting or prepared MDF parts, then physical assembly.',
    },
    {
      title: 'A mission challenge',
      text: 'The final robot is tested through obstacle paths, exploration goals and improvement rounds.',
    },
  ],
  formats: [
    {
      title: 'Course + rover kit at home',
      status: 'Pilot setup',
      text: 'For families who want the guide, prepared rover parts and electronics as one robotics adventure.',
      action: 'Join the pilot waitlist',
      to: '/contact?subject=nova-quest-mini-kit',
      icon: ShoppingCart,
    },
    {
      title: 'Build it at MakerLab',
      status: 'Best first launch path',
      text: 'A guided session where learners build, wire, code and test the rover with MakerLab support.',
      action: 'Ask for next session',
      to: '/contact?subject=nova-quest-mini-workshop',
      icon: Users,
    },
    {
      title: 'Design and fabricate',
      status: 'MakerLab support',
      text: 'For learners who want to adapt the rover chassis and ask MakerLab to laser-cut a custom version.',
      action: 'Request fabrication support',
      to: '/contact?subject=nova-quest-mini-custom-cad',
      icon: BadgeCheck,
    },
  ],
} as const;

export const storeProducts = [smartDoorProduct, novaQuestMiniProduct] as const;

export const storeConceptProducts = [
  {
    id: 'smart-parking-gate',
    title: 'Smart Parking Gate',
    status: 'Concept à valider',
    mission: 'Construis ton premier système de ville intelligente.',
    story:
      'Concevoir une entrée de parking automatique qui détecte une voiture, ouvre la barrière, compte les entrées et peut afficher quand le parking est complet.',
    learningPath: 'Design CAD de la barrière -> simulation du circuit -> logique du capteur -> mouvement servo -> MakeCode -> test avec voitures',
    likelyComponents: ['micro:bit', 'Shield / breakout', 'Capteur ultrason', 'Servo 180°', 'LED / statut', 'Structure MDF'],
    commercialReason:
      'Très facile à comprendre pour les parents, proche des composants Smart Door, et très fort pour raconter les villes intelligentes et l’automatisation.',
    nextEvidence: 'Créer un premier visuel concept, confirmer le mécanisme de barrière, puis lancer l’intake produit.',
    action: 'Voter pour ce pilote',
    to: '/contact?subject=smart-parking-gate-pilot',
  },
  {
    id: 'smart-delivery-locker',
    title: 'Smart Delivery Locker',
    status: 'Concept à valider',
    mission: 'Conçois et code un mini casier de livraison sécurisé.',
    story:
      'Créer un petit casier qui peut s’ouvrir avec un code, un bouton, une carte ou un déclencheur validé, puis expliquer comment les systèmes de livraison protègent les colis.',
    learningPath: 'Design du casier -> logique d’accès -> verrou servo -> MakeCode -> test de sécurité -> amélioration du parcours utilisateur',
    likelyComponents: ['micro:bit', 'Shield / breakout', 'Verrou servo', 'Boutons ou clavier à confirmer', 'Signal LED / statut', 'Boîte MDF'],
    commercialReason:
      'Moderne et très compréhensible : les parents voient immédiatement l’idée produit réelle, pas seulement l’électronique.',
    nextEvidence: 'Confirmer le mécanisme de verrouillage le plus sûr et décider si un clavier ou module d’accès est nécessaire.',
    action: 'Demander cette mission',
    to: '/contact?subject=smart-delivery-locker-pilot',
  },
  {
    id: 'mini-factory-sorter',
    title: 'Mini Factory Sorter',
    status: 'Concept à valider',
    mission: 'Construis une mini station d’usine automatisée.',
    story:
      'Créer une mini ligne de production qui détecte des objets et les envoie dans différentes zones avec une barrière servo ou un bras de tri.',
    learningPath: 'Défi d’usine -> choix du capteur -> logique de tri -> mécanisme de barrière -> code -> test de production',
    likelyComponents: ['micro:bit', 'Shield / breakout', 'Capteur à confirmer', 'Barrière servo', 'Rail MDF', 'Petits objets de test'],
    commercialReason:
      'Pont parfait entre les kits MakerLab et l’idée Kit Factory : l’enfant comprend l’automatisation en construisant une petite usine.',
    nextEvidence: 'Prototyper un mouvement de tri fiable avant toute promesse store.',
    action: 'Voter pour le sorter',
    to: '/contact?subject=mini-factory-sorter-pilot',
  },
  {
    id: 'eco-greenhouse-guardian',
    title: 'Eco Greenhouse Guardian',
    status: 'Concept à valider',
    mission: 'Construis un gardien intelligent pour plantes.',
    story:
      'Concevoir une mini serre qui observe son environnement et déclenche une alerte ou ouvre une petite ventilation quand la plante a besoin d’aide.',
    learningPath: 'Problème de plante -> lecture capteur -> affichage des données -> ventilation servo ou alerte -> test des conditions',
    likelyComponents: ['micro:bit', 'Capteur à confirmer', 'Ventilation servo ou alerte LED', 'Structure MDF / acrylique', 'Cartes guide'],
    commercialReason:
      'Ajoute une dimension science et environnement au store, utile pour les parents et écoles qui cherchent plus que la robotique pure.',
    nextEvidence: 'Choisir le capteur exact et confirmer une expérience plante sûre pour la maison ou l’école.',
    action: 'Demander la mission éco',
    to: '/contact?subject=eco-greenhouse-guardian-pilot',
  },
  {
    id: 'security-alarm-box',
    title: 'Security Alarm Box',
    status: 'Concept à valider',
    mission: 'Construis ton premier système de sécurité intelligent.',
    story:
      'Créer une mini alarme de pièce qui détecte un mouvement ou une distance, affiche un statut, et demande à l’enfant de réfléchir à des règles de sécurité responsables.',
    learningPath: 'Scénario sécurité -> logique de détection -> comportement de l’alarme -> code -> test des fausses alertes -> amélioration',
    likelyComponents: ['micro:bit', 'Capteur ultrason ou mouvement', 'Buzzer ou alerte LED', 'Shield / breakout', 'Maquette MDF'],
    commercialReason:
      'Simple, excitant et très clair visuellement, tout en permettant d’enseigner une technologie responsable.',
    nextEvidence: 'Confirmer le capteur, la sécurité son/lumière et le vocabulaire du guide autour de l’usage responsable.',
    action: 'Voter pour l’alarme',
    to: '/contact?subject=security-alarm-box-pilot',
  },
] as const;
