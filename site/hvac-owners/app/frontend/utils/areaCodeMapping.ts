/**
 * Maps US area codes to climate regions (hot/cold) for HVAC emergency prioritization
 * South = Hot climate (AC emergencies prioritized)
 * North = Cold climate (Furnace emergencies prioritized)
 */

// Southern/Hot climate states area codes
const SOUTHERN_AREA_CODES = [
  // Florida
  239, 305, 321, 352, 386, 407, 561, 727, 754, 772, 786, 813, 850, 863, 904, 941, 954,
  // Texas
  210, 214, 254, 281, 325, 361, 409, 430, 432, 469, 512, 682, 713, 737, 806, 817, 830, 832, 903, 915, 936, 940, 956, 972, 979,
  // Arizona
  480, 520, 602, 623, 928,
  // Louisiana
  225, 318, 337, 504, 985,
  // Alabama
  205, 251, 256, 334, 938,
  // Mississippi
  228, 601, 662, 769,
  // Georgia
  229, 404, 470, 478, 678, 706, 762, 770, 912,
  // South Carolina
  803, 843, 854, 864,
  // Arkansas
  479, 501, 870,
  // New Mexico
  505, 575,
  // Oklahoma
  405, 539, 580, 918,
  // Nevada (Southern, Las Vegas area)
  702, 725,
];

// Northern/Cold climate states area codes
const NORTHERN_AREA_CODES = [
  // New York
  212, 315, 347, 516, 518, 585, 607, 631, 646, 680, 716, 718, 838, 845, 914, 917, 929, 934,
  // Massachusetts
  339, 351, 413, 508, 617, 774, 781, 857, 978,
  // Pennsylvania
  215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878,
  // Illinois (Northern)
  217, 224, 309, 312, 331, 630, 708, 773, 779, 815, 847, 872,
  // Ohio
  216, 220, 234, 283, 330, 380, 419, 440, 513, 567, 614, 740, 937,
  // Michigan
  231, 248, 269, 313, 517, 586, 616, 734, 810, 906, 947, 989,
  // Wisconsin
  262, 414, 534, 608, 715, 920,
  // Minnesota
  218, 320, 507, 612, 651, 763, 952,
  // North Dakota
  701,
  // South Dakota
  605,
  // Montana
  406,
  // Wyoming
  307,
  // Idaho
  208, 986,
  // Vermont
  802,
  // New Hampshire
  603,
  // Maine
  207,
  // Connecticut
  203, 475, 860, 959,
  // Rhode Island
  401,
  // Iowa
  319, 515, 563, 641, 712,
  // Nebraska
  308, 402, 531,
  // Kansas
  316, 620, 785, 913,
  // Colorado
  303, 719, 720, 970,
  // Utah
  385, 435, 801,
  // Nevada (Northern, Reno area)
  775,
  // Washington
  206, 253, 360, 425, 509, 564,
  // Oregon
  458, 503, 541, 971,
  // Alaska
  907,
];

export interface RegionInfo {
  region: 'south' | 'north';
  climate: 'hot' | 'cold';
  priorityEmergency: 'AC' | 'Furnace';
}

/**
 * Extracts area code from a phone number string
 * Handles formats like: +12345678901, 1234567890, (123) 456-7890, 123-456-7890
 */
export function extractAreaCode(phoneNumber: string): number | null {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Handle US numbers (10 or 11 digits with leading 1)
  if (digits.length === 10) {
    return parseInt(digits.substring(0, 3), 10);
  } else if (digits.length === 11 && digits[0] === '1') {
    return parseInt(digits.substring(1, 4), 10);
  }

  return null;
}

/**
 * Infers the climate region based on phone number area code
 * Defaults to 'south' if area code is not recognized
 */
export function inferRegionFromPhone(phoneNumber: string): RegionInfo {
  const areaCode = extractAreaCode(phoneNumber);

  if (!areaCode) {
    // Default to south if we can't extract area code
    return {
      region: 'south',
      climate: 'hot',
      priorityEmergency: 'AC'
    };
  }

  if (NORTHERN_AREA_CODES.includes(areaCode)) {
    return {
      region: 'north',
      climate: 'cold',
      priorityEmergency: 'Furnace'
    };
  }

  // Default to south for southern codes and unrecognized codes
  return {
    region: 'south',
    climate: 'hot',
    priorityEmergency: 'AC'
  };
}

/**
 * Gets a user-friendly description of the climate zone
 */
export function getClimateDescription(phoneNumber: string): string {
  const { climate, priorityEmergency } = inferRegionFromPhone(phoneNumber);

  if (climate === 'hot') {
    return `Hot climate region - ${priorityEmergency} emergencies prioritized during heat waves`;
  } else {
    return `Cold climate region - ${priorityEmergency} emergencies prioritized during cold snaps`;
  }
}
