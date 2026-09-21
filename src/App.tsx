import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Check, 
  Sparkles, 
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Users,
  Mail,
  Star,
  Loader2,
  Copy
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

interface Destination {
  id: string;
  name: string;
  category: 'heritage' | 'nature' | 'coastal';
  badge: string;
  location: string;
  description: string;
  image: string;
  highlights: string[];
  bestTime: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    category: 'heritage',
    badge: 'Capital City',
    location: 'Colombo & West Coast',
    description:
      'The oceanfront capital blending timeless colonial heritage with an ultra-modern coastal skyline.',
    image: '/Photos/Colombo.jpg',
    highlights: [
      'Port City',
      'Light House',
      'Gangaramaya Temple',
      'Colombo Lotus Tower',
      'Arcade Independence Square',
      "St. Anthony's Church",
      'Red Mosque',
    ],
    bestTime: 'December to March',
  },
  {
    id: 'ella',
    name: 'Ella',
    category: 'nature',
    badge: 'Hill Country',
    location: 'Ella & Highlands',
    description: 'A vibrant mountain town nestled in emerald valleys, famous for its lush tea estates and historic railway loops.',
    image: '/Photos/Ella.jpg',
    highlights: [
      'Nine Arch Bridge',
      'Little Adam’s Peak',  
      'Ravana Pool Club',
      'Ravana Falls',
      'Demodara Bridge',
      'Kaludiya Pokuna',
      'Sri Lankan Cooking Class'
    ],
    bestTime: 'January to April'
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    category: 'coastal',
    badge: 'Waterfront',
    location: 'Trincomalee Coast',
    description: 'A breathtaking deep-water natural harbor on the quiet east coast with pristine white beaches and turquoise marine parks.',
    image: '/Photos/Trinconew.jpg',
    highlights: [
      'Seetha Hanuma Lovers Temple',
      'Hot Water Spring',
      'Hindu Temple',
      'Beach'
    ],
    bestTime: 'May to October'
  },
  {
    id: 'galle',
    name: 'Galle Fort',
    category: 'coastal',
    badge: 'Colonial Fort & Coast',
    location: 'South Coast & Galle',
    description: 'A romantic Dutch fort town surrounded by the turquoise Indian Ocean, filled with boutique charm, colonial villas, and scenic ramparts.',
    image: '/Photos/Galle.jpg',
    highlights: ['Galle Fort', 'Market', 'Fish Market', 'Main Harbour', 'Buddhist/Catholic/Hindu Religious Temples'],
    bestTime: 'November to April'
  },
  {
    id: 'kandy',
    name: 'Kandy',
    category: 'heritage',
    badge: 'Sacred Culture',
    location: 'Central Highlands',
    description: 'The spiritual royal capital located amidst lush hills, guarding the nation\'s most sacred tooth relic.',
    image: '/Photos/Kandy.jpg',
    highlights: ['Temple of the Sacred Tooth', 'Royal Botanical Gardens', 'Udawattha Jungle', 'Lake View Point', 'kandy Market / Kandyan Dance Performance'],
    bestTime: 'January to April'
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    category: 'heritage',
    badge: 'Ancient Ruins',
    location: 'Cultural Triangle',
    description: 'The ancient sky fortress built upon a near-vertical 200m lion rock, adorned with magnificent water gardens and frescoes.',
    image: '/Photos/Sigiriya.jpg',
    highlights: ['Sigiriya Rock', 'Elephant Bathing', 'Sigiriya Musueam', 'Pidurangala Rock hike', 'Village'],
    bestTime: 'January to August'
  },
  {
    id: 'yala',
    name: 'Yala',
    category: 'nature',
    badge: 'Safari',
    location: 'Yala National Park',
    description: 'An expansive coastal wildlife sanctuary hosting the world\'s densest population of leopards and majestic elephants.',
    image: '/Photos/Yala.jpg',
    highlights: ['Leopard Tracking Safaris', 'Wild Asian Elephants', 'Rustic Beachfront Camping', 'Migratory Bird Watching'],
    bestTime: 'February to June'
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara eliya',
    category: 'nature',
    badge: 'Tea Highlands',
    location: 'Nuwara Eliya Hills',
    description: 'Sri Lanka\'s highest elevation country wrapped in cool mountain air, colonial-style estates, and vast emerald tea carpets.',
    image: '/Photos/NuwaraEliya.jpg',
    highlights: ['Teacastle estate tours', 'Gregory Lake Boat Cruise', 'Historic Brick Post Office', 'Colonial Golf Course strolls'],
    bestTime: 'February to May'
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    category: 'coastal',
    badge: 'Beach & Whales',
    location: 'South Coast',
    description: 'A tropical crescent bay famous for blue whale watching expeditions, Coconut Tree Hill, and vibrant beach cafes.',
    image: '/Photos/Mirissa.jpg',
    highlights: ['Blue Whale Spotting Cruises', 'Coconut Tree Hill Viewpoint', 'Surfing & Beach Nightlife'],
    bestTime: 'November to April'
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa',
    category: 'heritage',
    badge: 'Ancient Capital',
    location: 'Cultural Triangle',
    description: 'The magnificent medieval royal capital featuring well-preserved stone stupas, colossal Buddha statues, and palace ruins.',
    image: '/Photos/Polonnaruwa.jpg',
    highlights: ['Gal Vihara Rock Temples', 'Royal Palace Ruins', 'Parakrama Samudra Lake', 'Polonnaruwa Quadrangle', 'Hindu Tmple'],
    bestTime: 'May to September'
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    category: 'heritage',
    badge: 'Sacred Citadel',
    location: 'North Central Province',
    description: 'Sri Lanka’s ancient first capital, home to sacred giant dagobas, ancient reservoirs, and the sacred Sri Maha Bodhi tree.',
    image: '/Photos/Anuradhapura.jpg',
    highlights: ['Jaya Sri Maha Bodhi', 'Ruwanwelisaya Dagoba', 'Jetavanaramaya Stupa', 'Kuttam Pokuna Twin Ponds', 'Moonstone', 'Samadhi Statue'],
    bestTime: 'May to September'
  },
  {
    id: 'dambulla',
    name: 'Dambulla',
    category: 'heritage',
    badge: 'Cave Temples',
    location: 'Cultural Triangle',
    description: 'A UNESCO World Heritage cliff complex housing five grand cave sanctuaries filled with ancient murals and 150+ Buddha statues.',
    image: '/Photos/Dambulla.jpg',
    highlights: ['Economic Market', 'Golden Cave Temple'],
    bestTime: 'January to May'
  },
  {
    id: 'arugam-bay',
    name: 'Arugam Bay',
    category: 'coastal',
    badge: 'Surf Haven',
    location: 'East Coast',
    description: 'A world-famous right-hand point break surf destination with laid-back beach vibes, lagoon safaris, and coastal dunes.',
    image: '/Photos/ArugamBay.jpg',
    highlights: ['Main Point & Baby Point Surf', 'Kottukal Lagoon Safari', 'Elephant Rock Sunset Point', 'Pottuvil Lagoon Kayaking', 'Dolphin watching'],
    bestTime: 'May to September'
  },
  {
    id: 'sinharaja',
    name: 'Sinharaja Forest Reserve',
    category: 'nature',
    badge: 'Rainforest UNESCO',
    location: 'South-Western Wet Zone',
    description: 'Sri Lanka’s last viable area of primary tropical rainforest, packed with endemic wildlife, waterfalls, and dense canopy trails.',
    image: '/Photos/Sinharaja.jpg',
    highlights: ['Endemic Bird Watching Trails', 'Mulawella Peak Trek', 'Doolawa Waterfall Dip', 'Guided Jungle Canopy Hikes'],
    bestTime: 'December to April'
  },
  {
    id: 'udawalawe',
    name: 'Udawalawe',
    category: 'nature',
    badge: 'Elephant Sanctuary',
    location: 'Southern & Sabaragamuwa Border',
    description: 'A premier national park surrounding a reservoir, renowned for guaranteed herds of wild Asian elephants and birdlife.',
    image: '/Photos/Udawalawe.jpg',
    highlights: ['Wild Elephant Herd Safaris', 'Udawalawe Reservoir Views', 'Elephant Transit Home Feeding', 'Crested Hawk-Eagle Spotting'],
    bestTime: 'December to May'
  },
  {
    id: 'minneriya',
    name: 'Minneriya',
    category: 'nature',
    badge: 'Wildlife Gathering',
    location: 'Cultural Triangle',
    description: 'Home to "The Gathering", the largest recurring wild Asian elephant congregation in the world on the shores of Minneriya Tank.',
    image: '/Photos/MinneriyaNationalPark.jpg',
    highlights: ['The Elephant Gathering Safari', 'Minneriya Tank Shoreline', 'Open Jeep Wilderness Tours', 'National Park'],
    bestTime: 'July to October'
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    category: 'heritage',
    badge: 'Northern Culture',
    location: 'Northern Peninsula',
    description: 'The cultural capital of the north featuring iconic golden Kovil temples, historic Dutch forts, unique cuisine, and quiet islands.',
    image: '/Photos/Jaffna.jpg',
    highlights: ['Nallur Kandaswamy Kovil', 'Jaffna Dutch Fort', 'Nainativu & Delft Island Ferry', 'Authentic Northern Crab Curry'],
    bestTime: 'January to September'
  },
  {
    id: 'hikkaduwa',
    name: 'Hikkaduwa',
    category: 'coastal',
    badge: 'Coral & Reef',
    location: 'South-West Coast',
    description: 'A vibrant beach resort known for its shallow coral reef sanctuary, friendly wild sea turtles, and great surf breaks.',
    image: '/Photos/Hikkaduwa.jpeg',
    highlights: ['Giant Sea Turtle Feeding', 'Hikkaduwa Coral Sanctuary Snorkeling', 'Narigama Beach Sunset Surf', 'Glass-Bottom Boat Tours'],
    bestTime: 'November to April'
  },
  {
    id: 'bentota',
    name: 'Bentota',
    category: 'coastal',
    badge: 'Water Sports & Beach',
    location: 'South-West Coast',
    description: 'A serene golden coastal haven famous for thrilling water sports, tranquil lagoon boat safaris, and marine turtle conservation.',
    image: '/Photos/Benthota.jpg',
    highlights: ['Water sports', 'Turtle watching', 'Beach'],
    bestTime: 'November to April'
  }
];

// Curated high-resolution, fast CDN fallback images for Sri Lanka destinations
// Used automatically if a local image fails or is incompatible with the client device
const DESTINATION_FALLBACKS: Record<string, string> = {
  trincomalee: 'https://unsplash.com/photos/a-person-standing-on-a-rock-near-the-ocean-_dU0DzRT4_Q',
  minneriya: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80',
  colombo: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80',
  ella: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=80',
  galle: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1600&q=80',
  kandy: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=80',
  sigiriya: 'https://images.unsplash.com/photo-1586183185323-c5b6b158869a?auto=format&fit=crop&w=1600&q=80',
  yala: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
  'nuwara-eliya': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
  mirissa: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  polonnaruwa: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=80',
  anuradhapura: 'https://images.unsplash.com/photo-1586183185323-c5b6b158869a?auto=format&fit=crop&w=1600&q=80',
  dambulla: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=80',
  'arugam-bay': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80',
  sinharaja: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80',
  udawalawe: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80',
  jaffna: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=80',
  hikkaduwa: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  bentota: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
};

const handleDestinationImageError = (destId: string) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  const fallback = DESTINATION_FALLBACKS[destId];
  if (fallback && target.src !== fallback) {
    target.src = fallback;
  }
};

const handleAboutImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  const fallback = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
  if (target.src !== fallback) {
    target.src = fallback;
  }
};

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  createdAt?: any;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const smoothScrollToTarget = (targetY: number) => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const distance = Math.abs(targetY - startY);

    // On mobile when navigating far (distance > 350px), slow it down with smooth JS easing
    if (isMobile && distance > 350) {
      const duration = Math.min(1450, Math.max(850, Math.round(distance * 0.32)));
      const startTime = performance.now();

      let cancelled = false;
      const cancelAnimation = () => {
        cancelled = true;
        cleanup();
      };
      const cleanup = () => {
        window.removeEventListener('touchstart', cancelAnimation);
        window.removeEventListener('wheel', cancelAnimation);
      };
      window.addEventListener('touchstart', cancelAnimation, { passive: true, once: true });
      window.addEventListener('wheel', cancelAnimation, { passive: true, once: true });

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (currentTime: number) => {
        if (cancelled) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = easeInOutCubic(progress);
        const currentY = startY + (targetY - startY) * ease;
        window.scrollTo(0, currentY);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          cleanup();
        }
      };

      requestAnimationFrame(step);
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const scrollToSection = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const wasMobileOpen = mobileMenuOpen;
    if (wasMobileOpen) {
      setMobileMenuOpen(false);
    }

    const executeScroll = () => {
      if (!targetId || targetId === '#' || targetId === 'hero') {
        smoothScrollToTarget(0);
        return;
      }
      const cleanId = targetId.replace(/^#/, '');
      const element = document.getElementById(cleanId);
      if (element) {
        const navOffset = 75;
        const elementPosition = element.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
        const offsetPosition = Math.max(0, elementPosition - navOffset);
        smoothScrollToTarget(offsetPosition);
      }
    };

    if (wasMobileOpen) {
      setTimeout(executeScroll, 80);
    } else {
      executeScroll();
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 30;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return sum / reviews.length;
  }, [reviews]);
  const formattedAverage = (Math.round(averageRating * 10) / 10).toFixed(1);

  useEffect(() => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedReviews: Review[] = snapshot.docs.map((doc: any) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name || 'Anonymous Guest',
                rating: Number(data.rating) || 5,
                date: data.date || 'Recent Guest',
                comment: data.comment || '',
                createdAt: data.createdAt,
              };
            });
            setReviews(fetchedReviews);
          } else {
            setReviews([]);
          }
        },
        (error) => {
          console.warn('Firestore real-time listener error:', error);
          setReviews([]);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not connect to Firestore:', e);
      setReviews([]);
    }
  }, []);

  // Handle Review Submission to Firestore
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    setIsSubmittingReview(true);
    setReviewError(null);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    const reviewData = {
      name: newReview.name.trim(),
      rating: Number(newReview.rating),
      date: formattedDate,
      comment: newReview.comment.trim(),
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'reviews'), reviewData);
      setNewReview({ name: '', rating: 5, comment: '' });
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSubmitted(false);
      }, 2500);
    } catch (err: any) {
      console.error('Error adding review to Firebase:', err);
      const localReview: Review = {
        id: Date.now().toString(),
        name: reviewData.name,
        rating: reviewData.rating,
        date: reviewData.date,
        comment: reviewData.comment
      };
      setReviews((prev) => [localReview, ...prev]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSubmitted(false);
      }, 2500);
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  // Interactive Destination Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'heritage' | 'nature' | 'coastal'>('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Email copy state and feedback
  const [emailCopied, setEmailCopied] = useState(false);
  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText('ceylonluxurytrails@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 3000);
  };

  // Smart Email Sender: opens Gmail in browser on desktop, or native mail app on mobile
  const handleSendEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const mailtoUrl = "mailto:ceylonluxurytrails@gmail.com?subject=Travel%20Inquiry%20-%20Ceylon%20Luxury%20Trails&body=Ayubowan%2C%0A%0AI%20would%20like%20to%20inquire%20about%20planning%20a%20luxury%20trail%20in%20Sri%20Lanka.%0A%0AName%3A%0ADates%3A%0APreferred%20Destinations%3A";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = mailtoUrl;
    } else {
      window.open(
        "https://mail.google.com/mail/?view=cm&fs=1&to=ceylonluxurytrails@gmail.com&su=Travel%20Inquiry%20-%20Ceylon%20Luxury%20Trails&body=Ayubowan%2C%0A%0AI%20would%20like%20to%20inquire%20about%20planning%20a%20luxury%20trail%20in%20Sri%20Lanka.",
        "_blank"
      );
    }
  };

  // Pagination States for Destinations (6 tiles per page: 3 columns x 2 rows)
  const [currentPage, setCurrentPage] = useState(0);
  const DESTINATIONS_PER_PAGE = 6;

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    guests: '2',
    destinationChoice: '',
    preferences: ''
  });

  // Success state when form is sent to WhatsApp
  const [formSentSuccess, setFormSentSuccess] = useState(false);

  // Validation error state for required form fields
  const [formErrors, setFormErrors] = useState<{ 
    name?: string; 
    startDate?: string;
    endDate?: string;
    guests?: string; 
  }>({});

  const handlePlanTrail = (destinationName: string, customMessage: string = '') => {
    setInquiryForm(prev => ({
      ...prev,
      destinationChoice: destinationName,
      preferences: customMessage
    }));
    
    setTimeout(() => {
      const formTarget = document.getElementById('custom-trail-planner') || document.getElementById('inquiry-form-card');
      if (formTarget) {
        const navOffset = 84;
        const elementPosition = formTarget.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
        const offsetPosition = Math.max(0, elementPosition - navOffset);
        smoothScrollToTarget(offsetPosition);
      } else {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          const navOffset = 84;
          const elementPosition = contactEl.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
          smoothScrollToTarget(Math.max(0, elementPosition - navOffset));
        }
      }
    }, 60);
  };

  const handleValidateAndSubmit = (e: any) => {
    const errors: { 
      name?: string; 
      startDate?: string;
      endDate?: string;
      guests?: string; 
    } = {};

    if (!inquiryForm.name.trim()) {
      errors.name = 'Please enter your name';
    }
    if (!inquiryForm.startDate.trim()) {
      errors.startDate = 'Please select start date';
    }
    if (!inquiryForm.endDate.trim()) {
      errors.endDate = 'Please select end date';
    } else if (inquiryForm.startDate && inquiryForm.endDate < inquiryForm.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    if (!inquiryForm.guests || !inquiryForm.guests.trim()) {
      errors.guests = 'Please select number of guests';
    }

    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setTimeout(() => {
        setInquiryForm({
          name: '',
          startDate: '',
          endDate: '',
          guests: '2',
          destinationChoice: '',
          preferences: ''
        });
        setFormSentSuccess(true);
        setTimeout(() => setFormSentSuccess(false), 5000);
      }, 350);
    }
  };

  const getWhatsAppLink = (phoneNumber: string = '61432037566') => {
    const dates = inquiryForm.startDate && inquiryForm.endDate 
      ? `${inquiryForm.startDate} to ${inquiryForm.endDate}`
      : (inquiryForm.startDate || inquiryForm.endDate || 'To be discussed');

    const text = `Hello Ceylon Luxury Trails! 🌟

I am interested in designing a custom holiday in Sri Lanka:
• Name: ${inquiryForm.name || 'Interested Guest'}
• Chosen Destination(s): ${inquiryForm.destinationChoice || 'Flexible / Open to recommendations'}
• Travel Dates: ${dates}
• Number of Guests: ${inquiryForm.guests}
• Custom Preferences: ${inquiryForm.preferences || 'We would love to cover luxury stays and bespoke trails.'}

Please send us an itinerary proposal! Thank you.`;
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
  };

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDestinations.length / DESTINATIONS_PER_PAGE));
  const visibleDestinations = filteredDestinations.slice(
    currentPage * DESTINATIONS_PER_PAGE,
    (currentPage + 1) * DESTINATIONS_PER_PAGE
  );

  return (
    <div className="min-h-screen w-full max-w-full bg-[#fbfaf7] text-stone-900 flex flex-col antialiased overflow-x-hidden">
      
      {/* 1. FLOATING NAVIGATION BAR */}
      <nav 
        id="navbar" 
        className={`fixed inset-x-0 top-0 w-full z-50 transition-[background-color,border-color,box-shadow] duration-300 transform-gpu ${
          isScrolled 
            ? 'glass-nav-scrolled' 
            : 'glass-nav-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo & Name */}
            <a 
              href="#" 
              onClick={(e) => scrollToSection(e, '#')}
              className="flex items-center gap-3.5 group cursor-pointer"
            >
              <img 
                src="/Photos/Logo.jpg" 
                alt="Ceylon Luxury Trails" 
                className={`h-12 w-auto object-contain rounded-full border shadow-sm group-hover:scale-105 transition-all duration-300 ${
                  isScrolled ? 'border-amber-600/20' : 'border-white/30 bg-white/90 p-0.5 shadow-lg'
                }`}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith('Logo.jpg')) {
                    target.src = '/Photos/Logo.jpeg';
                  } else if (target.src.endsWith('Logo.jpeg')) {
                    target.src = 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=200';
                  }
                }}
              />
              <div id="logo-text-brand" className="flex flex-col">
                <span className={`font-display text-lg sm:text-xl font-bold tracking-widest transition-colors ${
                  isScrolled 
                    ? 'text-stone-900 group-hover:text-amber-800' 
                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:text-amber-300'
                }`}>
                  CEYLON LUXURY TRAILS
                </span>
                <span className={`text-[9px] tracking-[0.22em] font-accent uppercase transition-colors ${
                  isScrolled 
                    ? 'text-amber-700' 
                    : 'text-amber-300 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]'
                }`}>
                  discover the soul of srilanka
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className={`hidden md:flex items-center gap-8 font-accent text-xs uppercase tracking-wider transition-colors ${
              isScrolled ? 'text-stone-700' : 'text-stone-100 font-medium'
            }`}>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className={`py-2 transition-colors ${isScrolled ? 'hover:text-amber-700' : 'hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'}`}>About Us</a>
              <a href="#destinations" onClick={(e) => scrollToSection(e, 'destinations')} className={`py-2 transition-colors ${isScrolled ? 'hover:text-amber-700' : 'hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'}`}>Destinations</a>
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className={`py-2 transition-colors ${isScrolled ? 'hover:text-amber-700' : 'hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'}`}>Services</a>
              <a href="#reviews" onClick={(e) => scrollToSection(e, 'reviews')} className={`py-2 transition-colors ${isScrolled ? 'hover:text-amber-700' : 'hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'}`}>Reviews</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className={`py-2 transition-colors ${isScrolled ? 'hover:text-amber-700' : 'hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'}`}>Contact Us</a>
            </div>

            {/* Premium CTA */}
            <div className="hidden md:flex items-center gap-5">
              <a 
                href="https://wa.me/61432037566" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`text-xs transition-colors flex items-center gap-1.5 ${
                  isScrolled 
                    ? 'text-stone-700 hover:text-amber-700' 
                    : 'text-stone-100 hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                <Phone className={`w-3.5 h-3.5 ${isScrolled ? 'text-amber-600' : 'text-amber-400'}`} />
                <span className="font-accent tracking-wide">+61 432 037 566</span>
              </a>
              <button 
                type="button"
                onClick={() => handlePlanTrail('Bespoke Island Route')}
                className={`px-5 py-2.5 rounded-full text-xs font-accent uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95 cursor-pointer ${
                  isScrolled
                    ? 'bg-stone-900 hover:bg-amber-600 text-white border border-stone-800 hover:border-transparent'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 border border-amber-400/40 hover:scale-105'
                }`}
              >
                Plan My Trail
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-colors ${
                  isScrolled 
                    ? 'text-stone-600 hover:text-stone-950' 
                    : 'text-white hover:text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
                }`}
                id="menu-btn"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Enhancement: Drawer menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1c1917]/95 backdrop-blur-xl border-b border-stone-700/60 px-5 pt-3 pb-6 space-y-2 shadow-2xl" id="mobile-nav-panel">
            <a 
              href="#about" 
              onClick={(e) => scrollToSection(e, 'about')}
              className="block px-3.5 py-3 rounded-xl text-stone-200 hover:bg-white/10 hover:text-amber-300 font-medium text-sm cursor-pointer"
            >
              About Us
            </a>
            <a 
              href="#destinations" 
              onClick={(e) => scrollToSection(e, 'destinations')}
              className="block px-3.5 py-3 rounded-xl text-stone-200 hover:bg-white/10 hover:text-amber-300 font-medium text-sm cursor-pointer"
            >
              Destinations
            </a>
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, 'services')}
              className="block px-3.5 py-3 rounded-xl text-stone-200 hover:bg-white/10 hover:text-amber-300 font-medium text-sm cursor-pointer"
            >
              Services
            </a>
            <a 
              href="#reviews" 
              onClick={(e) => scrollToSection(e, 'reviews')}
              className="block px-3.5 py-3 rounded-xl text-stone-200 hover:bg-white/10 hover:text-amber-300 font-medium text-sm cursor-pointer"
            >
              Reviews
            </a>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="block px-3.5 py-3 rounded-xl text-stone-200 hover:bg-white/10 hover:text-amber-300 font-medium text-sm cursor-pointer"
            >
              Contact Us
            </a>
            <div className="pt-4 border-t border-stone-700/60 flex flex-col gap-3">
              <a 
                href="https://api.whatsapp.com/send?phone=61432037566" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3.5 py-2.5 text-sm text-stone-200 hover:text-amber-300 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+61 432 037 566</span>
              </a>
              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePlanTrail('Bespoke Island Route');
                }}
                className="w-full text-center py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Plan My Trail
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative min-h-screen w-full max-w-full flex items-center justify-center pt-20 pb-12 overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0 bg-stone-900">
          <img 
            src="/Photos/Hero3.jpg" 
            alt="Sri Lanka Hero Background" 
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith('Hero3.jpg')) {
                target.src = '/Photos/Hero.jpg';
              } else if (target.src.endsWith('Hero.jpg')) {
                target.src = '/Photos/hero.jpg';
              } else if (target.src.endsWith('hero.jpg')) {
                target.src = '/Photos/Hero.png';
              } else if (target.src.endsWith('Hero.png')) {
                target.src = '/Photos/Hero.jpeg';
              } else {
                target.src = 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=2000';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50"></div>
        </div>

        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-6">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="text-[10px] tracking-[0.22em] text-amber-200 uppercase font-accent font-semibold">
              Bespoke Ceylon Experience
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.12] mb-6">
            Where Every Journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Becomes A Story
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base md:text-lg text-stone-200 font-light leading-relaxed mb-10">
            Ayubowan and Welcome to Sri Lanka! Your journey through Sri Lanka begins with us. With thoughtful planning and genuine Sri Lankan hospitality we create experiences shaped around the way you love to travel. From breathtaking landscapes to hidden treasures and timeless culture, let us take care of every detail while you simply enjoy the beauty and warmth of our island.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button 
              onClick={() => handlePlanTrail('Complete Custom Holiday', 'We are planning our dream trip to Sri Lanka. Please assist us!')}
              className="w-full sm:w-auto font-accent text-xs uppercase tracking-wider px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xl hover:shadow-amber-600/20 transition-all active:scale-95 cursor-pointer"
              id="hero-primary-cta"
            >
              Start Free Consultation
            </button>
            <a 
              href="#destinations" 
              onClick={(e) => scrollToSection(e, 'destinations')}
              className="w-full sm:w-auto font-accent text-xs uppercase tracking-wider px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="hero-secondary-cta"
            >
              <span>Explore Trails</span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. ABOUT COMPANY SECTION */}
      <section id="about" className="py-24 relative overflow-hidden bg-[#fbfaf7] border-t border-stone-200/60 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="aspect-[4/5] sm:aspect-[4/4.8] relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-xl bg-stone-100">
                <img 
                  src="/Photos/About.jpg" 
                  alt="Mr. Chandrathilaka and Miss Sathmi - Father and Daughter Team" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={handleAboutImageError}
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-dashed border-amber-600/30 rounded-2xl -z-10"></div>
            </div>

            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="text-[11px] font-accent uppercase tracking-widest text-amber-700 font-bold">
                — About Us
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                Meet Our Team
              </h2>

              <div className="space-y-4 text-stone-700 leading-relaxed font-light text-xs sm:text-sm">
                <p className="font-medium text-stone-900 text-sm sm:base">
                  Welcome to the Family!
                </p>
                <p>
                  We are a father and daughter team passionate about helping every guest experience the very best of Sri Lanka.
                </p>
                <p>
                  <strong className="font-semibold text-stone-900">Mr. Chandrathilaka</strong>, with over 35 years of experience as a professional tour guide, brings exceptional local knowledge and a deep passion for showcasing Sri Lanka's rich culture, breathtaking landscapes, and incredible wildlife. Alongside him, Founder <strong className="font-semibold text-stone-900">Miss Sathmi</strong> brings a fresh perspective and a personal touch, ensuring every journey is carefully planned to create unforgettable memories.
                </p>
                <p>
                  From ancient cities and sacred temples to golden beaches, misty mountains, lush tea plantations, cascading waterfalls, and spectacular wildlife, we're here to help you discover the true beauty of Sri Lanka.
                </p>
                <p className="font-medium text-stone-900 pt-1">
                  We look forward to welcoming you and making your Sri Lankan adventure one to remember!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                    <Check className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">35+ Years Local Expertise</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                    <Check className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">Father & Daughter Dedicated Team</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                    <Check className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">Tailored Personal Itineraries</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                    <Check className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">Authentic Island Hospitality</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES OFFERINGS SECTION */}
      <section id="services" className="py-20 bg-stone-50/50 relative border-y border-stone-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-accent uppercase tracking-[0.25em] text-amber-700 font-bold">
              — Bespoke Offerings
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              What We Offer
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              Every trip is planned to match your travel style, interests, and budget. From carefully crafted holiday packages to hassle-free travel arrangements, we make every step of your journey unforgettable. Wherever your next adventure leads, Ceylon Luxury Trails is ready to make it extraordinary.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DESTINATION GALLERY (6-TILE GRID) */}
      <section id="destinations" className="py-24 relative overflow-hidden bg-[#fbfaf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 text-left">
            <span className="text-[10px] font-accent uppercase tracking-[0.25em] text-amber-700 font-bold">— Destination Gallery</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">Popular Destinations</h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-lg">
              Explore handpicked Sri Lankan destinations. Click any tile to inspect custom landmarks, highlights, and recommended travel seasons!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10 bg-stone-100/40 p-4 rounded-2xl border border-stone-200/50 shadow-sm">
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Destinations' },
                { id: 'heritage', label: '🕌 Heritage & Culture' },
                { id: 'nature', label: '⛰️ Highlands & Nature' },
                { id: 'coastal', label: '🌊 Coastal & Beaches' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setCurrentPage(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-accent tracking-wider transition-all border cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'bg-amber-600 text-white border-transparent font-bold shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-amber-700 hover:border-amber-500/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search Colombo, Ella, Galle..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600/40 focus:ring-1 focus:ring-amber-600/20 transition-all shadow-sm"
                  id="search-input"
                />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setCurrentPage(0); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-900 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-3">
                  <span className="text-xs font-accent text-stone-500 font-medium px-1">
                    Page {currentPage + 1} / {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        setCurrentPage(prev => (prev === 0 ? totalPages - 1 : prev - 1));
                      }}
                      className="w-9 h-9 rounded-lg border border-stone-200 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-amber-600 hover:text-amber-700 transition-all shadow-sm active:scale-95 cursor-pointer"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage(prev => (prev >= totalPages - 1 ? 0 : prev + 1));
                      }}
                      className="w-9 h-9 rounded-lg border border-stone-200 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-amber-600 hover:text-amber-700 transition-all shadow-sm active:scale-95 cursor-pointer"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {visibleDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="destinations-grid">
              {visibleDestinations.map(dest => (
                <div 
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className="group relative cursor-pointer overflow-hidden rounded-[24px] shadow-lg hover:shadow-xl bg-stone-950 aspect-[4/3.5] sm:aspect-[3/4.2] transition-shadow duration-500 select-none active:scale-[0.99]"
                >
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.95]"
                    loading="lazy"
                    onError={handleDestinationImageError(dest.id)}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/30 to-transparent"></div>

                  <div className="absolute top-5 left-5 z-10">
                    <span className="bg-white/95 text-stone-900 text-[10px] sm:text-[11px] font-semibold tracking-wider px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                      {dest.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end text-left z-10">
                    <div className="flex items-center gap-1.5 text-stone-300 text-xs font-accent tracking-wide mb-1.5 drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      <span>{dest.location}</span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h3>

                    <p className="text-stone-300 text-xs font-light mt-2.5 leading-relaxed line-clamp-2">
                      {dest.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-accent tracking-wider font-medium opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Season: {dest.bestTime}</span>
                      <span className="flex items-center gap-1">
                        Explore Trail <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-stone-50 rounded-xl border border-stone-200/60">
              <p className="text-stone-500 text-sm">No curated trails match your filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setCurrentPage(0); }} 
                className="mt-3 text-xs text-amber-700 underline font-accent uppercase cursor-pointer"
              >
                Reset Filter Settings
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 6. MODAL DETAIL */}
      {selectedDestination && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedDestination(null)}
        >
          <div 
            className="bg-white border border-stone-200/80 w-full max-w-lg rounded-t-[28px] sm:rounded-2xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2.5 mb-1"></div>

            <button 
              onClick={() => setSelectedDestination(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-600 border border-stone-200/60 cursor-pointer"
              id="close-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-video">
              <img 
                src={selectedDestination.image} 
                alt={selectedDestination.name} 
                className="w-full h-full object-cover"
                onError={handleDestinationImageError(selectedDestination.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent"></div>
              <h3 className="absolute bottom-4 left-6 font-display text-2xl font-bold text-white">
                {selectedDestination.name}
              </h3>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="text-[10px] font-accent uppercase tracking-widest text-amber-700 font-semibold">Overview</span>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                  {selectedDestination.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-accent uppercase tracking-widest text-amber-700 font-bold">
                  Curated Landmarks
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {selectedDestination.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex justify-between">
                <span>📍 Location: {selectedDestination.location}</span>
                <span>☀️ Recommended: {selectedDestination.bestTime}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => {
                    setSelectedDestination(null);
                    handlePlanTrail(
                      selectedDestination.name, 
                      `We'd love a tailored route for ${selectedDestination.name} to see landmarks like: ${selectedDestination.highlights.join(', ')}.`
                    );
                  }}
                  className="flex-1 text-center py-3.5 sm:py-3 bg-amber-600 text-white font-bold rounded-xl text-xs font-accent uppercase tracking-wider hover:bg-amber-700 cursor-pointer transition-colors"
                  id="modal-inquire-btn"
                >
                  Inquire {selectedDestination.name} Trail
                </button>
                <button 
                  onClick={() => setSelectedDestination(null)}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-accent uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. WHATSAPP HOLIDAY PLANNER & DIRECT CONTACT */}
      <section id="contact" className="py-24 relative overflow-hidden bg-[#fbfaf7] border-t border-stone-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-accent uppercase tracking-[0.25em] text-amber-700 font-bold">
              — Direct Reach
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Contact Us
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-light">
              We're here to help with your travel inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* 1. Miss Sathmi */}
            <div className="glass-card rounded-2xl p-6 border border-stone-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between bg-white/90">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-700">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900">Miss Sathmi</h3>
                  <p className="text-[11px] text-amber-800 font-accent uppercase font-medium tracking-wider">Founder</p>
                </div>
                <div className="pt-2">
                  <a 
                    href="tel:+61432037566" 
                    className="text-stone-800 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>+61 432 037 566</span>
                  </a>
                </div>
              </div>
              <a 
                href="https://wa.me/61432037566" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-accent font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Miss Sathmi</span>
              </a>
            </div>

            {/* 2. Direct Email */}
            <div className="glass-card rounded-2xl p-6 border border-stone-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between bg-white/90">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <button 
                    onClick={handleCopyEmail}
                    title="Copy email to clipboard"
                    className="flex items-center gap-1 text-[11px] font-accent uppercase tracking-wider text-stone-500 hover:text-amber-700 bg-stone-100 hover:bg-amber-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-stone-200/60"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900">Email</h3>
                  <p className="text-[11px] text-amber-800 font-accent uppercase font-medium tracking-wider">Direct Inbox</p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleCopyEmail}
                    className="text-stone-800 hover:text-amber-700 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors break-all text-left group cursor-pointer"
                    title="Click to copy email address"
                  >
                    <Mail className="w-4 h-4 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-dotted decoration-stone-400 group-hover:decoration-amber-600">ceylonluxurytrails@gmail.com</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button 
                  onClick={handleSendEmailClick}
                  className="w-full py-2.5 bg-stone-900 hover:bg-amber-600 text-white rounded-lg text-xs font-accent font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send An Email</span>
                </button>

                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ceylonluxurytrails@gmail.com&su=Travel%20Inquiry%20-%20Ceylon%20Luxury%20Trails&body=Ayubowan,%0A%0AI%20would%20like%20to%20inquire%20about%20planning%20a%20luxury%20trail%20in%20Sri%20Lanka."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-accent font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors border border-amber-200/60"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Open directly in Gmail web</span>
                </a>
              </div>
            </div>
          </div>

          <div id="custom-trail-planner" className="text-center max-w-2xl mx-auto mb-8 space-y-2 scroll-mt-24">
            <span className="text-[10px] font-accent uppercase tracking-[0.25em] text-amber-700 font-bold">
              — Custom Trail Planner
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Ready to Map Your Ceylon Trail?
            </h3>
          </div>

          <div className="max-w-2xl mx-auto glass-card border border-stone-200/60 shadow-lg rounded-2xl p-6 sm:p-8 bg-white/95 backdrop-blur-sm" id="inquiry-form-card">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600 animate-pulse" /> Custom Trail Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                  <span>Your Name <span className="text-red-500">*</span></span>
                  {formErrors.name && <span className="text-red-600 font-medium text-[10px]">{formErrors.name}</span>}
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Eleanor Vance"
                  value={inquiryForm.name}
                  onChange={(e) => {
                    setInquiryForm({...inquiryForm, name: e.target.value});
                    if (formErrors.name) setFormErrors({...formErrors, name: undefined});
                  }}
                  className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none transition-colors ${
                    formErrors.name ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-stone-200 focus:border-amber-600/40'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                    <span>Start Date <span className="text-red-500">*</span></span>
                    {formErrors.startDate && <span className="text-red-600 font-medium text-[10px]">{formErrors.startDate}</span>}
                  </label>
                  <input 
                    type="date" 
                    value={inquiryForm.startDate}
                    onChange={(e) => {
                      setInquiryForm({...inquiryForm, startDate: e.target.value});
                      if (formErrors.startDate) setFormErrors({...formErrors, startDate: undefined});
                    }}
                    className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none transition-colors ${
                      formErrors.startDate ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-stone-200 focus:border-amber-600/40'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                    <span>End Date <span className="text-red-500">*</span></span>
                    {formErrors.endDate && <span className="text-red-600 font-medium text-[10px]">{formErrors.endDate}</span>}
                  </label>
                  <input 
                    type="date" 
                    min={inquiryForm.startDate || undefined}
                    value={inquiryForm.endDate}
                    onChange={(e) => {
                      setInquiryForm({...inquiryForm, endDate: e.target.value});
                      if (formErrors.endDate) setFormErrors({...formErrors, endDate: undefined});
                    }}
                    className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none transition-colors ${
                      formErrors.endDate ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-stone-200 focus:border-amber-600/40'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                    <span>Travelers Count <span className="text-red-500">*</span></span>
                    {formErrors.guests && <span className="text-red-600 font-medium text-[10px]">{formErrors.guests}</span>}
                  </label>
                  <select 
                    value={inquiryForm.guests}
                    onChange={(e) => {
                      setInquiryForm({...inquiryForm, guests: e.target.value});
                      if (formErrors.guests) setFormErrors({...formErrors, guests: undefined});
                    }}
                    className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none transition-colors ${
                      formErrors.guests ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-stone-200 focus:border-amber-600/40'
                    }`}
                  >
                    <option value="1">1 Guest (Solo)</option>
                    <option value="2">2 Guests (Couple)</option>
                    <option value="3-5">3 - 5 Guests (Family)</option>
                    <option value="6+">6+ Guests (Group)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1.5">
                    Preferred Island Locations (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Colombo, Ella, Sigiriya, Galle Fort"
                    value={inquiryForm.destinationChoice}
                    onChange={(e) => setInquiryForm({...inquiryForm, destinationChoice: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1.5">
                  Custom Preferences & Requests (Optional)
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. We'd love to stay in a forest cabin in Ella, visit tea estates, and do a wild safari."
                  value={inquiryForm.preferences}
                  onChange={(e) => setInquiryForm({...inquiryForm, preferences: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600/40 resize-none"
                />
              </div>

              <div className="pt-2">
                <a 
                  href={getWhatsAppLink('61432037566')}
                  onClick={handleValidateAndSubmit}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs font-accent uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-amber-600/10 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Send Custom Trail to Miss Sathmi (WhatsApp)</span>
                </a>

                {formSentSuccess && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-800 text-xs font-medium animate-in fade-in zoom-in-95 duration-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inquiry sent to WhatsApp! Form has been reset for you.</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* 8. GUEST EXPERIENCES & REVIEWS */}
          <div className="mt-24 max-w-4xl mx-auto border-t border-stone-200/70 pt-16" id="reviews">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div className="space-y-2">
                <span className="text-[10px] font-accent uppercase tracking-[0.25em] text-amber-700 font-bold">
                  — Traveler Stories
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  Guest Experiences
                </h3>
                {reviews.length > 0 ? (
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="flex items-center gap-0.5 text-amber-500" aria-label={`Rated ${formattedAverage} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const fillPercent = Math.max(0, Math.min(100, (averageRating - (starIndex - 1)) * 100));
                        return (
                          <div key={starIndex} className="relative w-4 h-4 inline-block">
                            <Star className="w-4 h-4 text-stone-300 fill-stone-200/50" />
                            <div 
                              className="absolute top-0 left-0 h-full overflow-hidden" 
                              style={{ width: `${fillPercent}%` }}
                            >
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs font-semibold text-stone-800">{formattedAverage} / 5.0</span>
                    <span className="text-xs text-stone-500">
                      ({reviews.length} {reviews.length === 1 ? 'Verified Review' : 'Verified Reviews'})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-1 text-stone-600 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Be the first guest to share your story!</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="self-start sm:self-auto px-5 py-2.5 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-accent uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
              </button>
            </div>

            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-10 glass-card border border-amber-600/30 shadow-md rounded-2xl p-6 bg-white space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <h4 className="font-display text-base font-bold text-stone-900">
                  Share Your Ceylon Luxury Trails Experience
                </h4>

                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah & Michael"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReview.rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-stone-600 font-medium ml-2">
                      {newReview.rating} Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-accent tracking-wider text-stone-500 mb-1">
                    Your Review / Comments <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell future travelers about your tour with Mr. Chandrathilaka and Miss Sathmi..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600/40 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {reviewSubmitted ? (
                    <span className="text-xs font-semibold text-emerald-700">
                      ✓ Thank you! Your review is now live in the cloud.
                    </span>
                  ) : reviewError ? (
                    <span className="text-xs font-semibold text-red-600">
                      {reviewError}
                    </span>
                  ) : <div></div>}

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-accent uppercase tracking-wider font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <span>Post Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-12 px-6 glass-card bg-white/80 border border-stone-200/70 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-600/10 border border-amber-600/20 mx-auto flex items-center justify-center text-amber-700">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="font-display text-base font-bold text-stone-900">No Guest Reviews Yet</h4>
                <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
                  Have you explored Sri Lanka with Ceylon Luxury Trails? Click &ldquo;Write a Review&rdquo; above to share your journey!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="glass-card bg-white/90 border border-stone-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-display text-sm font-bold text-stone-900">{rev.name}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${rev.rating} out of 5 stars`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating 
                                  ? 'fill-amber-500 text-amber-500' 
                                  : 'text-stone-300 fill-stone-200/40'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-stone-700 text-xs sm:text-sm font-light leading-relaxed">
                      “{rev.comment}”
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#faf9f5] border-t border-stone-200/60 py-12 text-center text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p className="font-display text-sm tracking-widest text-stone-800 font-semibold">CEYLON LUXURY TRAILS</p>
          <p>© 2026 Ceylon Luxury Trails. All luxury routes handcrafted with love for our Sri Lankan client.</p>
          <div className="flex justify-center gap-6 text-[10px] uppercase font-accent">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-amber-700 cursor-pointer">About</a>
            <a href="#destinations" onClick={(e) => scrollToSection(e, 'destinations')} className="hover:text-amber-700 cursor-pointer">Destinations</a>
            <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-amber-700 cursor-pointer">Services</a>
            <a href="#reviews" onClick={(e) => scrollToSection(e, 'reviews')} className="hover:text-amber-700 cursor-pointer">Reviews</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-amber-700 cursor-pointer">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
