export interface ZodiacSign {
  slug: string;
  name: string;
  symbol: string;
  fontChar: string;
  element: "fire" | "earth" | "air" | "water";
  dateRange: string;
}

export const AstroFontSignMapping: Record<string, string> = {
  aries: "x",
  taurus: "c",
  gemini: "v",
  cancer: "b",
  leo: "n",
  virgo: "m",
  libra: "X",
  scorpio: "C",
  sagittarius: "V",
  capricorn: "B",
  aquarius: "N",
  pisces: "M",
};

export const AstroFontBodyMapping: Record<string, string> = {
  sun: "s",
  moon: "a",
  mercury: "f",
  venus: "g",
  mars: "h",
  jupiter: "j",
  saturn: "s",
  uranus: "F",
  neptune: "G",
  pluto: "J",
  northnode: "k",
  southnode: "?",
  ascendant: "1",
  midheaven: "3",
  vulcain: "V",
  earth: "E",
  lilith: "L",
  ceres: "C",
  chiron: "D",
  eastpoint: "2",
  fortune: "L",
  pallas: ":",
  vesta: "_",
  juno: ";",
  vertex: "!",
};

export const AstroFontAspectMapping: Record<string, string> = {
  conjunction: "q",
  opposite: "p",
  square: "t",
  trine: "u",
  sextile: "r",
  inconjunct: "o",
  semisextile: "w",
  semisquare: "e",
  sesquiquadrate: "Ž",
  quintile: "q",
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { slug: "aries", name: "Aries", symbol: "♈", fontChar: "x", element: "fire", dateRange: "Mar 21 – Apr 19" },
  { slug: "taurus", name: "Taurus", symbol: "♉", fontChar: "c", element: "earth", dateRange: "Apr 20 – May 20" },
  { slug: "gemini", name: "Gemini", symbol: "♊", fontChar: "v", element: "air", dateRange: "May 21 – Jun 20" },
  { slug: "cancer", name: "Cancer", symbol: "♋", fontChar: "b", element: "water", dateRange: "Jun 21 – Jul 22" },
  { slug: "leo", name: "Leo", symbol: "♌", fontChar: "n", element: "fire", dateRange: "Jul 23 – Aug 22" },
  { slug: "virgo", name: "Virgo", symbol: "♍", fontChar: "m", element: "earth", dateRange: "Aug 23 – Sep 22" },
  { slug: "libra", name: "Libra", symbol: "♎", fontChar: "X", element: "air", dateRange: "Sep 23 – Oct 22" },
  { slug: "scorpio", name: "Scorpio", symbol: "♏", fontChar: "C", element: "water", dateRange: "Oct 23 – Nov 21" },
  { slug: "sagittarius", name: "Sagittarius", symbol: "♐", fontChar: "V", element: "fire", dateRange: "Nov 22 – Dec 21" },
  { slug: "capricorn", name: "Capricorn", symbol: "♑", fontChar: "B", element: "earth", dateRange: "Dec 22 – Jan 19" },
  { slug: "aquarius", name: "Aquarius", symbol: "♒", fontChar: "N", element: "air", dateRange: "Jan 20 – Feb 18" },
  { slug: "pisces", name: "Pisces", symbol: "♓", fontChar: "M", element: "water", dateRange: "Feb 19 – Mar 20" },
];

export const VALID_SIGN_SLUGS = ZODIAC_SIGNS.map((s) => s.slug);

export function getSign(slug: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((s) => s.slug === slug.toLowerCase());
}

export function isValidSign(slug: string): boolean {
  return VALID_SIGN_SLUGS.includes(slug.toLowerCase());
}
