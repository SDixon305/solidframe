"""
Area code to climate region mapping for HVAC emergency prioritization.
Maps US area codes to hot (south) or cold (north) climate regions.
"""
from typing import Optional

# Southern/Hot climate states area codes
SOUTHERN_AREA_CODES = {
    # Florida
    239, 305, 321, 352, 386, 407, 561, 727, 754, 772, 786, 813, 850, 863, 904, 941, 954,
    # Texas
    210, 214, 254, 281, 325, 361, 409, 430, 432, 469, 512, 682, 713, 737, 806, 817, 830, 832, 903, 915, 936, 940, 956, 972, 979,
    # Arizona
    480, 520, 602, 623, 928,
    # Louisiana
    225, 318, 337, 504, 985,
    # Alabama
    205, 251, 256, 334, 938,
    # Mississippi
    228, 601, 662, 769,
    # Georgia
    229, 404, 470, 478, 678, 706, 762, 770, 912,
    # South Carolina
    803, 843, 854, 864,
    # Arkansas
    479, 501, 870,
    # New Mexico
    505, 575,
    # Oklahoma
    405, 539, 580, 918,
    # Nevada (Southern, Las Vegas area)
    702, 725,
}

# Northern/Cold climate states area codes
NORTHERN_AREA_CODES = {
    # New York
    212, 315, 347, 516, 518, 585, 607, 631, 646, 680, 716, 718, 838, 845, 914, 917, 929, 934,
    # Massachusetts
    339, 351, 413, 508, 617, 774, 781, 857, 978,
    # Pennsylvania
    215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878,
    # Illinois (Northern)
    217, 224, 309, 312, 331, 630, 708, 773, 779, 815, 847, 872,
    # Ohio
    216, 220, 234, 283, 330, 380, 419, 440, 513, 567, 614, 740, 937,
    # Michigan
    231, 248, 269, 313, 517, 586, 616, 734, 810, 906, 947, 989,
    # Wisconsin
    262, 414, 534, 608, 715, 920,
    # Minnesota
    218, 320, 507, 612, 651, 763, 952,
    # North Dakota
    701,
    # South Dakota
    605,
    # Montana
    406,
    # Wyoming
    307,
    # Idaho
    208, 986,
    # Vermont
    802,
    # New Hampshire
    603,
    # Maine
    207,
    # Connecticut
    203, 475, 860, 959,
    # Rhode Island
    401,
    # Iowa
    319, 515, 563, 641, 712,
    # Nebraska
    308, 402, 531,
    # Kansas
    316, 620, 785, 913,
    # Colorado
    303, 719, 720, 970,
    # Utah
    385, 435, 801,
    # Nevada (Northern, Reno area)
    775,
    # Washington
    206, 253, 360, 425, 509, 564,
    # Oregon
    458, 503, 541, 971,
    # Alaska
    907,
}


def extract_area_code(phone_number: str) -> Optional[int]:
    """
    Extracts area code from a phone number string.
    Handles formats like: +12345678901, 1234567890, (123) 456-7890, 123-456-7890
    """
    # Remove all non-digit characters
    digits = ''.join(filter(str.isdigit, phone_number))

    # Handle US numbers (10 or 11 digits with leading 1)
    if len(digits) == 10:
        return int(digits[:3])
    elif len(digits) == 11 and digits[0] == '1':
        return int(digits[1:4])

    return None


def infer_region_from_phone(phone_number: str) -> str:
    """
    Infers the climate region ('north' or 'south') based on phone number area code.
    Defaults to 'south' if area code is not recognized.

    Returns:
        'north' for cold climate regions (furnace priority)
        'south' for hot climate regions (AC priority)
    """
    area_code = extract_area_code(phone_number)

    if not area_code:
        # Default to south if we can't extract area code
        return 'south'

    if area_code in NORTHERN_AREA_CODES:
        return 'north'

    # Default to south for southern codes and unrecognized codes
    return 'south'


def get_climate_description(phone_number: str) -> str:
    """
    Gets a user-friendly description of the climate zone.
    """
    region = infer_region_from_phone(phone_number)

    if region == 'north':
        return "Cold climate region - Furnace emergencies prioritized during cold snaps"
    else:
        return "Hot climate region - AC emergencies prioritized during heat waves"


def get_priority_emergency(phone_number: str) -> str:
    """
    Gets the priority emergency type based on region.
    Returns 'AC' for south, 'Furnace' for north.
    """
    region = infer_region_from_phone(phone_number)
    return 'Furnace' if region == 'north' else 'AC'
