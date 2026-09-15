import { categoryIntent } from './alashi-matching';

export function classifyIntent(message: string) {
  const q = message.toLowerCase().replace(/[’]/g, "'").trim();
  if (/\b(your goal|your purpose|your aim|who is (ibrahim|zubair|tawassul|dani|samiullah)|tell me about (ibrahim|zubair|tawassul|dani|samiullah))\b/.test(q)) return 'identity';
  if (/damaged|broken|wrong item|wrong colou?r|late|delayed|refund|unhappy|disappointed|not happy|isn't what i ordered|faulty|complaint|cancel|change my order|where's my order|track.*order|speak.*(owner|human)|talk to someone/.test(q)) return 'owner';
  if (/samiullah.*(marketing|good person)|politic|joke|weather|single|favorite colou?r|homework|unrelated|something else$/.test(q) && !/show me/.test(q)) return 'offtopic';
  if (/owner|who owns|who are you|about.*company|are you.*(bot|real|human|ai)/.test(q)) return 'identity';
  if (/discount|cheaper|lower|best price|best offer|too expensive|too much|reduce|negotia|final price|any deals|promotion|can you do better/.test(q)) return 'negotiation';
  if (/^(yes|yeah|yep|yup|sure|ok(ay)?|confirm(ed)?|sounds good|let's do it|go ahead|perfect|that works|i'm in|deal|agreed|alright)\b/.test(q) && !/thanks|thank you/.test(q) || /i want (to order|this)|i'll take|that's the one|confirm my order/.test(q)) return 'confirmation';
  if (/no thanks|not interested|not what i wanted|don't like|too big|too small|not this|never mind|^no\b|^nah\b|maybe later|think about it|not for me/.test(q)) return 'rejection';
  if (/appointment|visit|showroom/.test(q)) return 'appointment';
  if (/delivery|shipping|dispatch|arrive|postcode|deliver|assembly|assemble|\bcod\b|cash on delivery|not home/.test(q)) return 'delivery';
  if (/checkout|basket|cart|order two|another item|remove.*order/.test(q)) return 'order';
  if (/colou?r|size|dimension|material|fabric|leather|velvet|texture|comfortable|comfort|warranty|guarantee|durability|quality|last|photos|price/.test(q) && !/something|nice sofa/.test(q)) return 'spec';
  if (categoryIntent(q)) return 'product';
  if (/sofa|furniture|living room|recommend|surprise me|something (nice|comfortable|modern|classic)|don't know what i want|show me options|help me choose/.test(q)) return 'vague';
  if (/another|different|show me something else|alternatives?/.test(q)) return 'product';
  if (/thank|cheers|appreciate|no problem|no worries/.test(q)) return 'thanks';
  if (/\bhi\b|hello|hey|hiya|salam|assalam|morning|afternoon|evening|howdy|\byo\b|how are|how's it going|good to see|nice to meet|what's up|you good/.test(q)) return 'greeting';
  return 'unclear';
}
