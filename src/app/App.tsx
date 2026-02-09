import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

// ============================================================================
// SECTION: ASSETS & CONFIGURATION
// ============================================================================

// Image Assets
const heroImg2 = "/images/DSC04240-1.jpeg";
const heroImg3 = "/images/DSC04240-1.jpeg";
const heroImg4 = "/images/d7428934fed9e8cf4d8b1e257346f2c29e4005f9.png";
const heroImg5 = "/images/df1fb45078a47d66329a0602be7bdbfd91f964f5.png";
const femaleImg = "/images/asreee.webp";
const pantsImg = "/images/Ace_Your_Saree_Banner_D.jpg";
const imageSecImg = "/images/brocadesareesbanner.jpg";

// Mega Menu Background Images for each category
const MEGA_MENU_BG_IMAGES = {
  "INDIAN COUTURE": femaleImg,
  "EVENING WEAR": heroImg2,
  "MENSWEAR": pantsImg,
  "PARIS COUTURE": heroImg3,
  "DISCOVER": imageSecImg,
};

// Card Images Array
const CARD_IMAGES = [heroImg2, heroImg3, heroImg4, heroImg5, femaleImg];

// ============================================================================
// SECTION: TYPES & INTERFACES
// ============================================================================

interface MenuItem {
  label: string;
  subItems?: {
    category?: string;
    items: string[];
  }[];
  collections?: {
    title: string;
    items: string[];
  }[];
  explore?: {
    title: string;
    items: string[];
  }[];
  shows?: string[];
}

const MEGA_MENU_ITEMS: MenuItem[] = [
  {
    label: "INDIAN COUTURE",
    subItems: [
      {
        category: "CATEGORIES",
        items: ["Lehengas", "Sarees & Saree Gowns", "Gowns", "View All"],
      },
      {
        category: "COLLECTIONS",
        items: [
          "Sirens Rising SS'26",
          "Quantum Entanglement",
          "Bridal Couture",
          "Bridesmaids Edit",
          "The Pearl Edit",
          "The Haze Edit",
          "Celebrity Looks",
          "Ready to Ship",
        ],
      },
    ],
  },
  {
    label: "EVENING WEAR",
    subItems: [
      {
        category: "CATEGORIES",
        items: [
          "Gowns",
          "Dresses",
          "Tops & Shirts",
          "Trousers & Skirts",
          "Capes & Jackets",
          "View All",
        ],
      },
      {
        category: "COLLECTIONS",
        items: [
          "New In: Holiday'26",
          "Fall'25",
          "Pre Fall'25",
          "Demi Couture",
          "Celebrity Looks",
        ],
      },
    ],
  },
  {
    label: "MENSWEAR",
    subItems: [
      {
        category: "CATEGORIES",
        items: [
          "Sherwanis & Long Jackets",
          "Bandhgalas & Nehru Jackets",
          "Tuxedos",
          "Kurta Sets",
          "Shirts & Trousers",
          "View All",
        ],
      },
    ],
  },
  {
    label: "PARIS COUTURE",
    shows: [
      "The Divine Androgyne: SS'26",
      "Across The Flame: SS'25",
      "Jyotigramaya: AW'24",
      "Aarohanam: SS'24",
      "Hiranyagarbha: AW'23",
      "Shunya: SS'23",
    ],
  },
  {
    label: "DISCOVER",
    explore: [
      {
        title: "EXPLORE",
        items: ["About Us", "Celebrity Stories"],
      },
      {
        title: "COLLABORATIONS",
        items: [
          "MG Select X Gaurav Gupta",
          "Chivas Regal x Gaurav Gupta",
          "Dubai x Gaurav Gupta",
          "M.A.C. x Gaurav Gupta",
          "Precious x Gaurav Gupta",
        ],
      },
      {
        title: "FIND US",
        items: ["Boutiques", "Stockists"],
      },
    ],
  },
];

// ============================================================================
// SECTION: HEADER WITH MEGA MENU COMPONENT
// ============================================================================

const Header = ({
  onHover,
}: {
  onHover: (index: number | null) => void;
}) => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInMegaMenu = megaMenuRef.current?.contains(target);
      const isInHeader = headerRef.current?.contains(target);
      
      if (!isInMegaMenu && !isInHeader) {
        closeMegaMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
    setIsMegaMenuOpen(false);
    setIsHoveringMenu(false);
    onHover(null);
  };

  const handleMegaMenuEnter = (index: number) => {
    // Clear any existing timeout
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    
    setActiveMegaMenu(index);
    setIsMegaMenuOpen(true);
    setIsHoveringMenu(true);
    onHover(index);
  };

  const handleMegaMenuLeave = () => {
    // Set a timeout to close menu
    menuTimeoutRef.current = setTimeout(() => {
      if (!isMouseInMegaMenu()) {
        closeMegaMenu();
      }
    }, 100); // Small delay
  };

  const handleMegaMenuContainerEnter = () => {
    // Clear timeout when entering mega menu container
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setIsHoveringMenu(true);
  };

  const handleMegaMenuContainerLeave = () => {
    // Close menu after delay
    menuTimeoutRef.current = setTimeout(() => {
      closeMegaMenu();
    }, 150);
  };

  const isMouseInMegaMenu = () => {
    return document.querySelector('.mega-menu-container:hover') !== null;
  };

  // Calculate header background based on scroll and hover state
  const getHeaderBackground = () => {
    if (scrolled) {
      return "bg-white/95 backdrop-blur-sm text-black shadow-sm";
    }
    
    if (isHoveringMenu && activeMegaMenu !== null) {
      return "bg-black text-white";
    }
    
    return "bg-transparent text-white";
  };

  const getHeaderPadding = () => {
    return scrolled ? "py-4" : "py-8";
  };

  return (
    <>
      {/* Main Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${getHeaderBackground()} ${getHeaderPadding()}`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer">
            <h1 className="text-lg sm:text-xl md:text-2xl tracking-[0.4em] font-light uppercase">
              AIV ATELIER
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
            {MEGA_MENU_ITEMS.map((item, idx) => (
              <div
                key={item.label}
                className="relative nav-item group"
                onMouseEnter={() => handleMegaMenuEnter(idx)}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button className="flex items-center space-x-2 text-[11px] sm:text-[12px] tracking-[0.2em] hover:opacity-70 transition-opacity uppercase font-medium">
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      activeMegaMenu === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <button className="hover:opacity-60 transition-opacity">
              <Mail className="w-4 h-4" />
            </button>
            <button className="hover:opacity-60 transition-opacity uppercase text-[12px] tracking-widest font-medium">
              Log In
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {isMegaMenuOpen && activeMegaMenu !== null && (
          <>
            {/* Black Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={closeMegaMenu}
            />

            {/* Mega Menu Content */}
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 z-40 mega-menu-container"
              style={{ 
                top: scrolled ? '64px' : '88px',
                height: '60vh'
              }}
              onMouseEnter={handleMegaMenuContainerEnter}
              onMouseLeave={handleMegaMenuContainerLeave}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <ImageWithFallback
                  src={MEGA_MENU_BG_IMAGES[MEGA_MENU_ITEMS[activeMegaMenu].label as keyof typeof MEGA_MENU_BG_IMAGES]}
                  alt="Menu Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Mega Menu Content - Centered slightly up */}
              <div className="relative z-10 h-full flex items-start pt-12 sm:pt-16">
                <div className="container mx-auto px-4 sm:px-6 py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 text-white max-h-[50vh] overflow-y-auto">
                    {/* Left Column - Main Categories */}
                    {MEGA_MENU_ITEMS[activeMegaMenu].subItems?.map((section, idx) => (
                      <div key={idx} className="space-y-6">
                        <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-4 pb-2 border-b border-white/30">
                          {section.category}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {section.items.map((item) => (
                            <a
                              key={item}
                              href="#"
                              className="text-xs sm:text-sm tracking-[0.15em] uppercase hover:text-gray-300 transition-colors py-1 sm:py-2"
                              onClick={closeMegaMenu}
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Paris Couture Shows */}
                    {MEGA_MENU_ITEMS[activeMegaMenu].shows && (
                      <div className="space-y-6">
                        <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-4 pb-2 border-b border-white/30">
                          PARIS COUTURE SHOWS
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {MEGA_MENU_ITEMS[activeMegaMenu].shows!.map((show) => (
                            <a
                              key={show}
                              href="#"
                              className="text-xs sm:text-sm tracking-[0.15em] uppercase hover:text-gray-300 transition-colors py-1 sm:py-2"
                              onClick={closeMegaMenu}
                            >
                              {show}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Discover Section */}
                    {MEGA_MENU_ITEMS[activeMegaMenu].explore && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {MEGA_MENU_ITEMS[activeMegaMenu].explore!.map((section, idx) => (
                          <div key={idx} className="space-y-4">
                            <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-3 pb-2 border-b border-white/30">
                              {section.title}
                            </h3>
                            <div className="space-y-2">
                              {section.items.map((item) => (
                                <a
                                  key={item}
                                  href="#"
                                  className="text-xs sm:text-sm tracking-[0.15em] uppercase hover:text-gray-300 transition-colors block py-1"
                                  onClick={closeMegaMenu}
                                >
                                  {item}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 bg-white z-[60] flex flex-col"
          >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
              <h1 className="text-lg sm:text-xl tracking-[0.4em] font-light text-black uppercase">
                AIV ATELIER
              </h1>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-black" />
              </button>
            </div>
            <div className="flex flex-col p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto">
              {MEGA_MENU_ITEMS.map((item, idx) => (
                <div
                  key={item.label}
                  className="border-b border-gray-100 pb-4"
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => {
                      if (activeMegaMenu === idx) {
                        setActiveMegaMenu(null);
                      } else {
                        setActiveMegaMenu(idx);
                      }
                    }}
                  >
                    <span className="text-sm sm:text-base tracking-[0.2em] text-black uppercase font-medium">
                      {item.label}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${activeMegaMenu === idx ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {activeMegaMenu === idx && item.subItems && (
                    <div className="mt-4 pl-4 flex flex-col space-y-3">
                      {item.subItems.map((section) => (
                        <div key={section.category} className="space-y-2">
                          <h4 className="text-xs tracking-widest text-gray-700 uppercase font-bold">
                            {section.category}
                          </h4>
                          <div className="pl-2 space-y-1">
                            {section.items.map((sub) => (
                              <a
                                key={sub}
                                href="#"
                                className="text-xs tracking-widest text-gray-500 uppercase block py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// SECTION: HERO SLIDER
// ============================================================================

const HeroSlider = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Hero Image */}
      <ImageWithFallback
        src={heroImg3}
        alt="Hero"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Hero Content */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 text-center text-white w-full px-4 sm:px-6 z-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.25em] uppercase mb-6 sm:mb-8 leading-[1.2]">
          Discover The World <br />
          <span className="font-light">Of AIV ATELIER</span>
        </h2>

        <button className="px-8 sm:px-12 py-3 sm:py-5 bg-white text-black hover:bg-transparent hover:text-white border border-white transition-all duration-500 tracking-[0.3em] uppercase text-[10px] sm:text-[12px] font-bold">
          Make An Appointment
        </button>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION: FULL WIDTH SECTION COMPONENT
// ============================================================================

const FullWidthSection = ({
  type = "image",
  url,
  heading,
  buttonText = "Discover More",
  className = "",
}: {
  type?: "image" | "video";
  url: string;
  heading: React.ReactNode;
  buttonText?: string;
  className?: string;
}) => {
  return (
    <section
      className={`relative w-full h-screen overflow-hidden bg-black ${className}`}
    >
      {/* Background Media */}
      {type === "video" ? (
        <video
          src="/images/b2b665f1749f4fa6976a43c7c6dd2256.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/DSC04240-1.jpeg"
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageWithFallback
          src={url}
          alt="Section"
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 text-center text-white w-full px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-extralight tracking-[0.3em] uppercase mb-6 sm:mb-10 leading-relaxed">
          {heading}
        </h2>
        <button className="px-8 sm:px-12 py-3 sm:py-5 border border-white text-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.3em] uppercase text-[10px] sm:text-[12px] font-bold">
          {buttonText}
        </button>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION: CARD SLIDER COMPONENT
// ============================================================================

const CardSlider = () => {
  const cards = [
    {
      id: 1,
      title: "Crystalline Architecture Lehenga",
      price: "INR 695,000",
      img: CARD_IMAGES[0],
    },
    {
      id: 2,
      title: "Blooming Pearl Lehenga",
      price: "Price on Request",
      img: CARD_IMAGES[1],
    },
    {
      id: 3,
      title: "Web Lehenga",
      price: "INR 850,000",
      img: CARD_IMAGES[2],
    },
    {
      id: 4,
      title: "The Ghungroo Lehenga",
      price: "Price on Request",
      img: CARD_IMAGES[3],
    },
    {
      id: 5,
      title: "Celestial Crystal Lehenga",
      price: "INR 950,000",
      img: CARD_IMAGES[4],
    },
  ];

  const displayCards = [...cards, ...cards, ...cards];
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12 flex justify-between items-end">
        <h2 className="text-xs tracking-[0.4em] font-light uppercase border-b border-black pb-2">
          New Arrivals
        </h2>
        <a
          href="#"
          className="text-[12px] tracking-[0.3em] uppercase font-bold hover:opacity-50 transition-opacity"
        >
          Shop All
        </a>
      </div>

      {/* Infinite Scroll Cards */}
      <div className="relative">
        <motion.div
          animate={{
            x: isPaused ? undefined : ["0%", "-33.33%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex whitespace-nowrap"
        >
          {displayCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[20vw] flex-shrink-0 px-2"
            >
              {/* Card Image */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative group cursor-pointer">
                <ImageWithFallback
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              {/* Card Details */}
              <div className="mt-4 sm:mt-6 text-center px-2">
                <h3 className="text-[8px] sm:text-[9px] tracking-[0.2em] font-bold uppercase mb-1 sm:mb-2 truncate">
                  {card.title}
                </h3>
                <p className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase">
                  {card.price}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION: FOOTER COMPONENT
// ============================================================================

const Footer = () => {
  return (
    <footer className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 border-t border-gray-100">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8">
        {/* Brand Column */}
        <div className="col-span-1">
          <h2 className="text-lg sm:text-xl tracking-[0.4em] font-light mb-6 sm:mb-10 uppercase">
            AIV ATELIER
          </h2>
          <div className="flex space-x-4 sm:space-x-6">
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-black transition-colors" />
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-black transition-colors" />
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-black transition-colors" />
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-black transition-colors" />
          </div>
        </div>

        {/* Policies Column */}
        <div>
          <h4 className="text-[12px] font-bold tracking-[0.3em] mb-4 sm:mb-8 uppercase">
            Policies
          </h4>
          <ul className="space-y-2 sm:space-y-4 text-[11px] sm:text-[12px] tracking-[0.2em] uppercase">
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Cookies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Returns
              </a>
            </li>
          </ul>
        </div>

        {/* Brand Information Column */}
        <div>
          <h4 className="text-[12px] font-bold tracking-[0.3em] mb-4 sm:mb-8 uppercase">
            The Brand
          </h4>
          <ul className="space-y-2 sm:space-y-4 text-[11px] sm:text-[12px] tracking-[0.2em] uppercase">
            <li>
              <a href="#" className="hover:text-black transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Store Locator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Stockists
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-[12px] font-bold tracking-[0.3em] mb-4 sm:mb-8 uppercase">
            Newsletter
          </h4>
          <p className="text-[11px] sm:text-[12px] tracking-[0.15em] uppercase mb-4 sm:mb-8 leading-relaxed">
            By signing up below, you agree to stay in touch with
            AIV ATELIER. For more information about our privacy
            practices and your rights, please consult our
            privacy policy.
          </p>
          <div className="flex border-b border-gray-200 pb-2 sm:pb-3 group">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-transparent border-none outline-none text-[11px] sm:text-[12px] tracking-[0.3em] w-full py-1 sm:py-2 placeholder:text-gray-300"
            />
            <button className="text-[11px] sm:text-[12px] tracking-[0.3em] font-bold ml-2 sm:ml-4 hover:opacity-50 transition-opacity uppercase">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto mt-12 sm:mt-24 text-center border-t border-gray-50 pt-8 sm:pt-12">
        <p className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase">
          © {new Date().getFullYear()} AIV ATELIER Studio. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

// ============================================================================
// SECTION: MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <main className="w-full overflow-x-hidden font-sans selection:bg-black selection:text-white">
      {/* SECTION 1: Header with Mega Menu */}
      <Header onHover={setHoveredIndex} />

      {/* SECTION 2: Hero Banner */}
      <HeroSlider />

      {/* SECTION 3: Video Section - The AIV ATELIER Man */}
      <FullWidthSection
        type="video"
        url="https://player.vimeo.com/external/494493307.hd.mp4?s=8197771746f34e3575631742464e837890a59a18&profile_id=172&oauth2_token_id=57447761"
        heading={
          <>
            The AIV <br /> ATELIER Man
          </>
        }
        buttonText="Discover Now"
      />

      {/* SECTION 4: Image Section - Sculpted Architecture */}
      <FullWidthSection
        url={imageSecImg}
        heading={
          <>
            Sculpted <br /> Architecture
          </>
        }
        buttonText="View Details"
      />

      {/* SECTION 5: Card Slider - New Arrivals */}
      <CardSlider />

      {/* SECTION 6: Image Section - Sirens Rising */}
      <FullWidthSection
        url={femaleImg}
        heading={
          <>
            Sirens <br /> Rising
          </>
        }
        buttonText="Explore Collection"
      />

      {/* SECTION 7: Image Section - The Divine Androgyne */}
      <FullWidthSection
        url={pantsImg}
        heading={
          <>
            The Divine <br /> Androgyne
          </>
        }
        buttonText="View More"
      />

      {/* SECTION 8: Footer */}
      <Footer />
    </main>
  );
}