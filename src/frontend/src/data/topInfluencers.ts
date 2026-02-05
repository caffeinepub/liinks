// Curated top influencers dataset with Instagram handles grouped by category
export interface Influencer {
  displayName: string;
  instagramHandle: string;
  category: string;
}

export const TOP_INFLUENCERS: Influencer[] = [
  // Digital Creators
  { displayName: 'Emma Chamberlain', instagramHandle: 'emmachamberlain', category: 'Digital Creators' },
  { displayName: 'David Dobrik', instagramHandle: 'daviddobrik', category: 'Digital Creators' },
  { displayName: 'Liza Koshy', instagramHandle: 'lizakoshy', category: 'Digital Creators' },
  { displayName: 'Casey Neistat', instagramHandle: 'caseyneistat', category: 'Digital Creators' },
  { displayName: 'Marques Brownlee', instagramHandle: 'mkbhd', category: 'Digital Creators' },

  // Video & Photography
  { displayName: 'Peter McKinnon', instagramHandle: 'petermckinnon', category: 'Video & Photography' },
  { displayName: 'Brandon Woelfel', instagramHandle: 'brandonwoelfel', category: 'Video & Photography' },
  { displayName: 'Jessica Kobeissi', instagramHandle: 'jessicakobeissi', category: 'Video & Photography' },
  { displayName: 'Manny Ortiz', instagramHandle: 'mannyortizphoto', category: 'Video & Photography' },
  { displayName: 'Sam Kolder', instagramHandle: 'samkolder', category: 'Video & Photography' },

  // Music & Performances
  { displayName: 'Billie Eilish', instagramHandle: 'billieeilish', category: 'Music & Performances' },
  { displayName: 'The Weeknd', instagramHandle: 'theweeknd', category: 'Music & Performances' },
  { displayName: 'Ariana Grande', instagramHandle: 'arianagrande', category: 'Music & Performances' },
  { displayName: 'Post Malone', instagramHandle: 'postmalone', category: 'Music & Performances' },
  { displayName: 'Dua Lipa', instagramHandle: 'dualipa', category: 'Music & Performances' },

  // Brand & Commerce
  { displayName: 'Gary Vaynerchuk', instagramHandle: 'garyvee', category: 'Brand & Commerce' },
  { displayName: 'Huda Kattan', instagramHandle: 'hudabeauty', category: 'Brand & Commerce' },
  { displayName: 'Kylie Jenner', instagramHandle: 'kyliejenner', category: 'Brand & Commerce' },
  { displayName: 'Jeffree Star', instagramHandle: 'jeffreestar', category: 'Brand & Commerce' },
  { displayName: 'Chiara Ferragni', instagramHandle: 'chiaraferragni', category: 'Brand & Commerce' },

  // Communities
  { displayName: 'Nas Daily', instagramHandle: 'nasdaily', category: 'Communities' },
  { displayName: 'Prince Ea', instagramHandle: 'prince_ea', category: 'Communities' },
  { displayName: 'Jay Shetty', instagramHandle: 'jayshetty', category: 'Communities' },
  { displayName: 'Lilly Singh', instagramHandle: 'lilly', category: 'Communities' },

  // Fitness & Coaching
  { displayName: 'Kayla Itsines', instagramHandle: 'kayla_itsines', category: 'Fitness & Coaching' },
  { displayName: 'Joe Wicks', instagramHandle: 'thebodycoach', category: 'Fitness & Coaching' },
  { displayName: 'Simeon Panda', instagramHandle: 'simeonpanda', category: 'Fitness & Coaching' },
  { displayName: 'Jen Selter', instagramHandle: 'jenselter', category: 'Fitness & Coaching' },
  { displayName: 'Michelle Lewin', instagramHandle: 'michelle_lewin', category: 'Fitness & Coaching' },

  // Travel & Real Estate
  { displayName: 'Murad Osmann', instagramHandle: 'muradosmann', category: 'Travel & Real Estate' },
  { displayName: 'Jack Morris', instagramHandle: 'doyoutravel', category: 'Travel & Real Estate' },
  { displayName: 'Lauren Bullen', instagramHandle: 'gypsea_lust', category: 'Travel & Real Estate' },
  { displayName: 'Chris Burkard', instagramHandle: 'chrisburkard', category: 'Travel & Real Estate' },
  { displayName: 'Ryan Serhant', instagramHandle: 'ryanserhant', category: 'Travel & Real Estate' },

  // Fashion
  { displayName: 'Aimee Song', instagramHandle: 'aimeesong', category: 'Fashion' },
  { displayName: 'Camila Coelho', instagramHandle: 'camilacoelho', category: 'Fashion' },
  { displayName: 'Negin Mirsalehi', instagramHandle: 'negin_mirsalehi', category: 'Fashion' },
  { displayName: 'Olivia Palermo', instagramHandle: 'oliviapalermo', category: 'Fashion' },
  { displayName: 'Danielle Bernstein', instagramHandle: 'weworewhat', category: 'Fashion' },

  // Food
  { displayName: 'Gordon Ramsay', instagramHandle: 'gordongram', category: 'Food' },
  { displayName: 'Jamie Oliver', instagramHandle: 'jamieoliver', category: 'Food' },
  { displayName: 'Rosanna Pansino', instagramHandle: 'rosannapansino', category: 'Food' },
  { displayName: 'Molly Yeh', instagramHandle: 'mollyyeh', category: 'Food' },
  { displayName: 'Tasty', instagramHandle: 'buzzfeedtasty', category: 'Food' },

  // Clothing
  { displayName: 'Virgil Abloh', instagramHandle: 'virgilabloh', category: 'Clothing' },
  { displayName: 'Aleali May', instagramHandle: 'aleali', category: 'Clothing' },
  { displayName: 'Tan France', instagramHandle: 'tanfrance', category: 'Clothing' },
  { displayName: 'Jenn Im', instagramHandle: 'imjennim', category: 'Clothing' },

  // Design
  { displayName: 'Jessica Walsh', instagramHandle: 'jessicavwalsh', category: 'Design' },
  { displayName: 'Aaron Draplin', instagramHandle: 'draplin', category: 'Design' },
  { displayName: 'Paula Scher', instagramHandle: 'paulascherdesign', category: 'Design' },
  { displayName: 'Baugasm', instagramHandle: 'baugasm', category: 'Design' },

  // Tech & Gaming
  { displayName: 'Ninja', instagramHandle: 'ninja', category: 'Tech & Gaming' },
  { displayName: 'PewDiePie', instagramHandle: 'pewdiepie', category: 'Tech & Gaming' },
  { displayName: 'Pokimane', instagramHandle: 'pokimanelol', category: 'Tech & Gaming' },
  { displayName: 'Shroud', instagramHandle: 'shroud', category: 'Tech & Gaming' },
  { displayName: 'Valkyrae', instagramHandle: 'valkyrae', category: 'Tech & Gaming' },

  // Influencers & Bloggers
  { displayName: 'Zoe Sugg', instagramHandle: 'zoesugg', category: 'Influencers & Bloggers' },
  { displayName: 'Tanya Burr', instagramHandle: 'tanyaburr', category: 'Influencers & Bloggers' },
  { displayName: 'Bethany Mota', instagramHandle: 'bethanynoelm', category: 'Influencers & Bloggers' },
  { displayName: 'Tyler Oakley', instagramHandle: 'tyleroakley', category: 'Influencers & Bloggers' },
  { displayName: 'Zoella', instagramHandle: 'zoella', category: 'Influencers & Bloggers' },
];

// Helper function to get influencers by category
export function getInfluencersByCategory(category: string): Influencer[] {
  return TOP_INFLUENCERS.filter(inf => inf.category === category);
}

// Helper function to get all categories with influencers
export function getCategoriesWithInfluencers(): string[] {
  return Array.from(new Set(TOP_INFLUENCERS.map(inf => inf.category)));
}
