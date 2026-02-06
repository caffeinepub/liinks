/**
 * Local, offline bio suggestion generator
 * Provides template-based bio suggestions without external API calls
 */

interface BioSuggestionParams {
  prompt: string;
  category: string;
}

/**
 * Generates a bio suggestion based on user input and template category
 * Uses rule-based templates and text manipulation - no external API calls
 */
export function generateBioSuggestion(params: BioSuggestionParams): string {
  const { prompt, category } = params;
  
  // Extract key information from the prompt
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect focus areas
  const isSustainable = lowerPrompt.includes('sustainable') || lowerPrompt.includes('eco') || lowerPrompt.includes('green');
  const isLuxury = lowerPrompt.includes('luxury') || lowerPrompt.includes('premium') || lowerPrompt.includes('high-end');
  const isMinimalist = lowerPrompt.includes('minimal') || lowerPrompt.includes('simple') || lowerPrompt.includes('clean');
  const isBold = lowerPrompt.includes('bold') || lowerPrompt.includes('vibrant') || lowerPrompt.includes('colorful');
  
  // Extract follower count if mentioned
  const followerMatch = lowerPrompt.match(/(\d+)k?\s*(followers?|subs?|audience)/i);
  const hasFollowers = followerMatch !== null;
  
  // Build bio components based on category and detected themes
  const bioComponents = {
    identity: getIdentityLine(category, { isSustainable, isLuxury, isMinimalist, isBold }),
    proof: getProofLine(category, hasFollowers),
    brand: getBrandLine(category, { isSustainable, isLuxury, isMinimalist, isBold }),
    cta: getCtaLine(category),
  };
  
  // Combine components into a complete bio
  return `${bioComponents.identity}\n${bioComponents.proof}\n${bioComponents.brand}\n${bioComponents.cta}`;
}

function getIdentityLine(
  category: string,
  themes: { isSustainable: boolean; isLuxury: boolean; isMinimalist: boolean; isBold: boolean }
): string {
  const identityTemplates: Record<string, string[]> = {
    'Fashion': [
      themes.isSustainable ? '🌿 Sustainable Fashion Advocate' : '👗 Fashion Creator',
      themes.isLuxury ? '✨ Luxury Style Curator' : '💫 Style Enthusiast',
      themes.isMinimalist ? '🤍 Minimalist Wardrobe Expert' : '🎨 Fashion Storyteller',
    ],
    'Digital Creators': [
      '📱 Digital Content Creator',
      themes.isBold ? '🎬 Bold Visual Storyteller' : '✨ Creative Mind',
      '🚀 Digital Innovation Enthusiast',
    ],
    'Video & Photography': [
      '📸 Visual Storyteller',
      themes.isMinimalist ? '🎥 Minimalist Photographer' : '🎬 Content Creator',
      '🌟 Capturing Life\'s Moments',
    ],
    'Music & Performances': [
      '🎵 Music Creator',
      '🎤 Performance Artist',
      '🎸 Sound & Soul',
    ],
    'Travel': [
      '✈️ Travel Enthusiast',
      themes.isLuxury ? '🌍 Luxury Travel Curator' : '🗺️ Adventure Seeker',
      '📍 Exploring the World',
    ],
    'Food': [
      '🍽️ Food Creator',
      themes.isSustainable ? '🌱 Sustainable Food Advocate' : '👨‍🍳 Culinary Explorer',
      '🥘 Taste & Tell',
    ],
    'Fitness & Coaching': [
      '💪 Fitness Coach',
      '🏋️ Wellness Advocate',
      '🧘 Mind & Body Transformation',
    ],
    'Beauty & Skincare': [
      themes.isMinimalist ? '✨ Minimalist Beauty Advocate' : '💄 Beauty Creator',
      themes.isSustainable ? '🌿 Clean Beauty Enthusiast' : '💅 Skincare Expert',
      '🌸 Glow & Grow',
    ],
    'Tech & Gaming': [
      '🎮 Gaming Creator',
      '💻 Tech Enthusiast',
      '🕹️ Digital Explorer',
    ],
    'Business & Entrepreneurship': [
      '💼 Entrepreneur',
      '📈 Business Strategist',
      '🚀 Building Dreams',
    ],
    'Real Estate': [
      '🏡 Real Estate Professional',
      themes.isLuxury ? '🏰 Luxury Property Specialist' : '🔑 Your Home Guide',
      '📍 Making Dreams Home',
    ],
    'Education & Coaching': [
      '📚 Educator',
      '🎓 Knowledge Sharer',
      '💡 Empowering Minds',
    ],
    'Lifestyle': [
      themes.isMinimalist ? '🤍 Minimalist Living' : '✨ Lifestyle Creator',
      themes.isLuxury ? '💎 Luxury Lifestyle' : '🌟 Daily Inspiration',
      '🌈 Living Intentionally',
    ],
  };
  
  const templates = identityTemplates[category] || ['✨ Creator & Influencer'];
  return templates[Math.floor(Math.random() * templates.length)];
}

function getProofLine(category: string, hasFollowers: boolean): string {
  if (hasFollowers) {
    return '📊 Building a community of engaged followers';
  }
  
  const proofTemplates: Record<string, string[]> = {
    'Fashion': ['Featured in top fashion blogs', 'Styling 100+ clients', 'Creating trends, not following them'],
    'Digital Creators': ['Creating content that resonates', 'Helping brands tell their story', 'Trusted by leading brands'],
    'Video & Photography': ['10K+ photos captured', 'Working with global brands', 'Award-winning visuals'],
    'Music & Performances': ['Performed at 50+ venues', 'Original compositions', 'Connecting through music'],
    'Travel': ['Visited 30+ countries', 'Travel tips & guides', 'Authentic travel experiences'],
    'Food': ['500+ recipes shared', 'Culinary school graduate', 'Making cooking accessible'],
    'Fitness & Coaching': ['Certified trainer', 'Transformed 100+ lives', 'Science-backed methods'],
    'Beauty & Skincare': ['Licensed esthetician', 'Honest product reviews', 'Glowing skin advocate'],
    'Tech & Gaming': ['Pro gamer', 'Tech reviews & tutorials', 'Building the future'],
    'Business & Entrepreneurship': ['Built 3 successful ventures', 'Helping entrepreneurs scale', 'From idea to impact'],
    'Real Estate': ['Closed 100+ deals', 'Your trusted advisor', 'Making home ownership easy'],
    'Education & Coaching': ['Certified coach', 'Taught 1000+ students', 'Transforming lives through learning'],
    'Lifestyle': ['Living with purpose', 'Sharing daily inspiration', 'Authentic & real'],
  };
  
  const templates = proofTemplates[category] || ['Creating meaningful content'];
  return templates[Math.floor(Math.random() * templates.length)];
}

function getBrandLine(
  category: string,
  themes: { isSustainable: boolean; isLuxury: boolean; isMinimalist: boolean; isBold: boolean }
): string {
  if (themes.isSustainable) {
    return '🌍 Committed to sustainable practices & ethical choices';
  }
  if (themes.isLuxury) {
    return '💎 Curating premium experiences & timeless elegance';
  }
  if (themes.isMinimalist) {
    return '🤍 Less is more | Quality over quantity';
  }
  if (themes.isBold) {
    return '🎨 Bold, vibrant, unapologetically me';
  }
  
  const brandTemplates: Record<string, string[]> = {
    'Fashion': ['Style is a way to say who you are', 'Confidence is the best outfit', 'Fashion fades, style is eternal'],
    'Digital Creators': ['Creating content that matters', 'Authenticity over perfection', 'Stories that inspire'],
    'Video & Photography': ['Every frame tells a story', 'Capturing emotions, not just moments', 'Visual poetry'],
    'Music & Performances': ['Music is my language', 'Creating sounds that move you', 'Rhythm & soul'],
    'Travel': ['Collect moments, not things', 'Adventure awaits', 'Wanderlust & wonder'],
    'Food': ['Food is love made visible', 'Cooking with passion', 'Flavor & joy'],
    'Fitness & Coaching': ['Strong body, strong mind', 'Your journey, my guidance', 'Progress over perfection'],
    'Beauty & Skincare': ['Beauty starts with self-care', 'Glow from within', 'Confidence in every step'],
    'Tech & Gaming': ['Level up your game', 'Innovation & creativity', 'Tech for everyone'],
    'Business & Entrepreneurship': ['Dream big, start small', 'Building legacies', 'Success through strategy'],
    'Real Estate': ['Finding your perfect space', 'Home is where your story begins', 'Keys to your dreams'],
    'Education & Coaching': ['Knowledge is power', 'Unlock your potential', 'Learning never stops'],
    'Lifestyle': ['Living my best life', 'Intentional & inspired', 'Everyday magic'],
  };
  
  const templates = brandTemplates[category] || ['Creating with purpose'];
  return templates[Math.floor(Math.random() * templates.length)];
}

function getCtaLine(category: string): string {
  const ctaTemplates = [
    '👇 Check out my links below',
    '⬇️ Explore my world',
    '💌 Let\'s connect',
    '🔗 Links & resources below',
    '✨ Discover more',
  ];
  
  return ctaTemplates[Math.floor(Math.random() * ctaTemplates.length)];
}
