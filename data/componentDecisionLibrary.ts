export type ComponentCandidate = {
  id: string;
  project: 'smart-door' | 'nova-quest-mini' | 'shared';
  category: string;
  recommendedName: string;
  quantity: string;
  role: string;
  decisionQuestion: string;
  whySuggested: string;
  sourceLabel: string;
  sourceUrl: string;
  status: 'confirmed' | 'to-confirm' | 'optional';
  notes: string;
};

export const componentDecisionLibrary: ComponentCandidate[] = [
  {
    id: 'microbit-v2-shared',
    project: 'shared',
    category: 'Controller',
    recommendedName: 'BBC micro:bit v2',
    quantity: '1',
    role: 'Main programmable controller / robot brain',
    decisionQuestion: 'Do we standardize all new kits on micro:bit v2?',
    whySuggested:
      'micro:bit v2 is the current common board for MakeCode education and includes the LED matrix, buttons, sensors, speaker and microphone. It is safer to standardize than mixing v1/v2 silently.',
    sourceLabel: 'micro:bit v2 official support details',
    sourceUrl: 'https://support.microbit.org/support/solutions/articles/19000119052-details-of-micro-bit-v2',
    status: 'to-confirm',
    notes: 'Confirm whether MakerLab stock is v1 or v2. Store copy should say micro:bit only until exact version is approved.',
  },
  {
    id: 'keyestudio-sensor-shield-v2-shared',
    project: 'shared',
    category: 'Shield / breakout',
    recommendedName: 'Keyestudio Sensor Shield V2 for BBC micro:bit',
    quantity: '1',
    role: 'Breaks out micro:bit pins into easier 3-pin connections for sensors, servos and modules',
    decisionQuestion: 'Is this the exact shield used in the real prototypes?',
    whySuggested:
      'The yellow pin-header shield visible in the real Nova photos looks like a Keyestudio-style micro:bit sensor/expansion shield. This option is good for general sensor/servo wiring.',
    sourceLabel: 'Keyestudio KS0360 Sensor Shield V2 documentation',
    sourceUrl: 'https://docs.keyestudio.com/projects/KS0360/en/latest/docs/Keyestudio%20Sensor%20Shield%20V2%20for%20BBC%20microbit.html',
    status: 'to-confirm',
    notes: 'Good candidate for Smart Door sensor/servo wiring and Nova Quest if the real board matches. Confirm exact SKU from MakerLab inventory/photo.',
  },
  {
    id: 'keyestudio-motor-driver-shield-nova',
    project: 'nova-quest-mini',
    category: 'Motor driver / robot shield',
    recommendedName: 'Keyestudio micro:bit motor driver expansion board / shield',
    quantity: '1',
    role: 'Controls two DC gear motors for the rover movement',
    decisionQuestion: 'Does Nova Quest use a motor driver shield or a general sensor shield plus separate motor/servo wiring?',
    whySuggested:
      'If Nova Quest uses DC gear motors, a motor driver board is the more correct option than a simple sensor shield.',
    sourceLabel: 'Keyestudio KS4018 motor driver expansion board wiki',
    sourceUrl: 'https://wiki.keyestudio.com/KS4018_Micro%3Abit_Motor_Driver_Expansion_Board',
    status: 'to-confirm',
    notes: 'Use only if the real rover motor system is DC gear motors. The founder/reference photo should decide.',
  },
  {
    id: 'hc-sr04-smart-door',
    project: 'smart-door',
    category: 'Distance sensor',
    recommendedName: 'HC-SR04 ultrasonic distance sensor',
    quantity: '1',
    role: 'Detects distance/object presence for Smart Door interaction',
    decisionQuestion: 'Is the Smart Door sensor the standard HC-SR04 module or another ultrasonic version?',
    whySuggested:
      'The Smart Door reference shows the common two-eye ultrasonic module form factor. HC-SR04 is the standard candidate for that look.',
    sourceLabel: 'SparkFun-hosted HC-SR04 datasheet',
    sourceUrl: 'https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf',
    status: 'to-confirm',
    notes: 'Confirm operating voltage with the chosen shield. Do not finalize wiring/safety until tested.',
  },
  {
    id: 'sg90-smart-door',
    project: 'smart-door',
    category: 'Actuator',
    recommendedName: 'SG90-style 9g micro servo, approximately 180 degree',
    quantity: '1',
    role: 'Moves the Smart Door sliding mechanism',
    decisionQuestion: 'Is the servo exactly SG90/TowerPro-style 9g 180 degree, or another model?',
    whySuggested:
      'The Smart Door needs a small 180 degree servo. SG90 is a common education servo, but exact supplier/model affects torque and reliability.',
    sourceLabel: 'TowerPro SG90 product specifications',
    sourceUrl: 'https://towerpro.com.tw/product/sg90-7/',
    status: 'to-confirm',
    notes: 'Confirm torque is enough for the MDF sliding mechanism and that power is not pulled directly from micro:bit.',
  },
  {
    id: 'usb-cable-shared',
    project: 'shared',
    category: 'Programming cable',
    recommendedName: 'USB cable compatible with selected micro:bit version',
    quantity: '1',
    role: 'Programs the micro:bit from MakeCode and can power it during programming',
    decisionQuestion: 'Do we include the programming cable in every kit?',
    whySuggested:
      'Families may not have the correct cable. Including it reduces support problems.',
    sourceLabel: 'micro:bit feature overview',
    sourceUrl: 'https://microbit.org/get-started/features/overview/',
    status: 'to-confirm',
    notes: 'micro:bit uses USB for code transfer. Confirm cable type for board version and packaging cost.',
  },
  {
    id: 'battery-pack-shared',
    project: 'shared',
    category: 'Power',
    recommendedName: 'External battery pack / power source',
    quantity: '1',
    role: 'Powers the project away from the computer',
    decisionQuestion: 'Which battery format is approved for children and for each shield?',
    whySuggested:
      'Battery choice affects safety, reliability, packaging, cost and delivery rules.',
    sourceLabel: 'micro:bit hardware/power overview',
    sourceUrl: 'https://microbit.org/get-started/features/overview/',
    status: 'to-confirm',
    notes: 'Do not publish battery claims until safety and actual shield voltage requirements are approved.',
  },
  {
    id: 'mdf-laser-cut-shared',
    project: 'shared',
    category: 'Fabrication',
    recommendedName: 'Laser-cut MDF parts from MakerLab CAD files',
    quantity: '1 set',
    role: 'Physical structure of the project',
    decisionQuestion: 'Does the customer receive prepared MDF, editable CAD, or MakerLab fabrication support?',
    whySuggested:
      'The product promise depends on this decision. It controls guide steps, packaging, order workflow and custom design support.',
    sourceLabel: 'MakerLab internal CAD/product truth',
    sourceUrl: '',
    status: 'to-confirm',
    notes: 'Use local CAD/source files as the real source. Do not let AI-generated visuals redefine the physical product.',
  },
];
