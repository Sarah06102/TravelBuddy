import React, { useEffect, useState } from 'react'
import { FaGlobeAmericas } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../pages/AuthModal.jsx'


const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [currency, setCurrency] = useState("CAD");
  const [showRegionModal, setShowRegionModal] = useState(false);
  const regionOptions = [
    { code: "CA_EN", name: "Canada (English)", language: "en", languageDisplay: "English", currency: "CAD" },
    { code: "CA_FR", name: "Canada (Français)", language: "fr", languageDisplay: "Français", currency: "CAD" },
    { code: "US", name: "United States", language: "en", languageDisplay: "English", currency: "USD" },
    { code: "MX", name: "Mexico", language: "es", languageDisplay: "Español", currency: "MXN" },
    { code: "BR", name: "Brazil", language: "pt", languageDisplay: "Português", currency: "BRL" },
    { code: "FR", name: "France", language: "fr", languageDisplay: "Français", currency: "EUR" },
    { code: "DE", name: "Germany", language: "de", languageDisplay: "Deutsch", currency: "EUR" },
    { code: "IT", name: "Italy", language: "it", languageDisplay: "Italiano", currency: "EUR" },
    { code: "ES", name: "Spain", language: "es", languageDisplay: "Español", currency: "EUR" },
    { code: "GB", name: "United Kingdom", language: "en", languageDisplay: "English", currency: "GBP" },
    { code: "AU", name: "Australia", language: "en", languageDisplay: "English", currency: "AUD" },
    { code: "NZ", name: "New Zealand", language: "en", languageDisplay: "English", currency: "NZD" },
    { code: "JP", name: "Japan", language: "ja", languageDisplay: "日本語", currency: "JPY" },
    { code: "KR", name: "South Korea", language: "ko", languageDisplay: "한국어", currency: "KRW" },
    { code: "CN", name: "China", language: "zh-CN", languageDisplay: "中文", currency: "CNY" },
    { code: "IN", name: "India", language: "en", languageDisplay: "English", currency: "INR" },
    { code: "AE", name: "United Arab Emirates", language: "en", languageDisplay: "English", currency: "AED" },
    { code: "TH", name: "Thailand", language: "th", languageDisplay: "ไทย", currency: "THB" },
    { code: "ID", name: "Indonesia", language: "id", languageDisplay: "Bahasa Indonesia", currency: "IDR" },
    { code: "SG", name: "Singapore", language: "en", languageDisplay: "English", currency: "SGD" },
    { code: "ZA", name: "South Africa", language: "en", languageDisplay: "English", currency: "ZAR" },
    { code: "EG", name: "Egypt", language: "ar", languageDisplay: "العربية", currency: "EGP" },
    { code: "TR", name: "Turkey", language: "tr", languageDisplay: "Türkçe", currency: "TRY" },
    { code: "CH", name: "Switzerland", language: "de", languageDisplay: "Deutsch", currency: "CHF" },
    { code: "RU", name: "Russia", language: "ru", languageDisplay: "Русский", currency: "RUB" },
    { code: "VN", name: "Vietnam", language: "vi", languageDisplay: "Tiếng Việt", currency: "VND" },
    { code: "PH", name: "Philippines", language: "tl", languageDisplay: "Tagalog", currency: "PHP" },
    { code: "NL", name: "Netherlands", language: "nl", languageDisplay: "Nederlands", currency: "EUR" },
    { code: "SE", name: "Sweden", language: "sv", languageDisplay: "Svenska", currency: "SEK" },
    { code: "PL", name: "Poland", language: "pl", languageDisplay: "Polski", currency: "PLN" },
    { code: "UA", name: "Ukraine", language: "uk", languageDisplay: "Українська", currency: "UAH" },
    { code: "AR", name: "Argentina", language: "es", languageDisplay: "Español", currency: "ARS" },
    { code: "MY", name: "Malaysia", language: "ms", languageDisplay: "Bahasa Melayu", currency: "MYR" },
    { code: "PK", name: "Pakistan", language: "ur", languageDisplay: "اردو", currency: "PKR" }
  ];
  

  const [selectedRegion, setSelectedRegion] = useState(regionOptions[0]);
  const suggestedRegions = regionOptions.slice(0, 2);

  const selectRegion = (region) => {
    if (!region || !region.language || !region.currency) return;
    setSelectedRegion(region);
    setCurrency(region.currency);
    setShowRegionModal(false);
  
    setTimeout(() => {
      updateGoogleTranslateLanguage(region.language);
    }, 500);
  };

  const handleNavigation = (targetPath = '/', sectionId = null) => {
    if (location.pathname === targetPath) {
      // Already on the target page
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // First navigate, then optionally scroll
      navigate(targetPath);
      if (sectionId) {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Wait for page to render
      }
    }
  };

  const detectUserCurrency = async () => {
    try {
      const geoRes = await fetch("https://ipapi.co/json/");
      const geoData = await geoRes.json();
      const countryCode = geoData.country;

      const countryRes = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const countryData = await countryRes.json();
      const currency = Object.keys(countryData[0].currencies)[0];

      console.log("Detected currency:", currency);

      const matchedRegion = regionOptions.find(region => region.currency === currency);

      if (matchedRegion) {
        setSelectedRegion(matchedRegion);
        setCurrency(matchedRegion.currency);
      } else {
        setCurrency(currency);
      }

    } catch (error) {
      console.error('Failed to detect currency', error);
    }
  }

  useEffect(() => {
    detectUserCurrency();
  }, []);

  const updateGoogleTranslateLanguage = (langCode) => {
    const langMap = {
      en: "en",        // English
      fr: "fr",        // French
      es: "es",        // Spanish
      pt: "pt",        // Portuguese
      de: "de",        // German
      it: "it",        // Italian
      ja: "ja",        // Japanese
      ko: "ko",        // Korean
      zh: "zh-CN",     // Chinese (Simplified)
      zhTW: "zh-TW",   // Chinese (Traditional)
      ar: "ar",        // Arabic
      tr: "tr",        // Turkish
      th: "th",        // Thai
      id: "id",        // Indonesian
      ru: "ru",        // Russian
      nl: "nl",        // Dutch
      pl: "pl",        // Polish
      sv: "sv",        // Swedish
      fi: "fi",        // Finnish
      he: "iw",        // Hebrew
      hi: "hi",        // Hindi
      ur: "ur",        // Urdu
      ms: "ms",        // Malay
      vi: "vi",        // Vietnamese
      tl: "tl"         // Tagalog (Filipino)
    };
    
  
    const googleLang = langMap[langCode] || "en";

    const tryChangeLanguage = () => {
      const select = document.querySelector('select.goog-te-combo');
      if (select) {
        select.value = googleLang;
        select.dispatchEvent(new Event('change'));
      } else {
        setTimeout(tryChangeLanguage, 300);
      }
    };

    setTimeout(() => {
      tryChangeLanguage();
    }, 500);
  };
  
  
  return (
    <div className="bg-linear-65 from-indigo-300 to-violet-600 rounded-full m-4 p-4 flex flex-row justify-between items-center">
        <button onClick={() => handleNavigation('/')} className="font-bold text-white text-xl cursor-pointer">TravelBuddy</button>
        <div className="flex items-center gap-5">
          <button className="text-white cursor-pointer hover:text-gray-300"><span>{selectedRegion.currency}</span></button>
          <button onClick={() => setShowRegionModal(true)}>
            <FaGlobeAmericas className="text-white cursor-pointer hover:text-gray-300" />
          </button>
          {showRegionModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-30 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Choose a region and language</h2>
                  <button onClick={() => setShowRegionModal(false)} className="text-xl font-bold text-gray-500 hover:text-black cursor-pointer">&times;</button>
                </div>

                {/* Suggested */}
                <div>
                  <h3 className="font-semibold mb-2">Suggested region and language</h3>
                  <div className="flex gap-4 flex-wrap mb-6">
                    {suggestedRegions.map(region => (
                      <div key={region.code} className="border p-4 rounded cursor-pointer hover:bg-gray-100" onClick={() => selectRegion(region)}>
                        <div className="font-semibold">{region.name}</div>
                        <div className="text-sm text-gray-600">{region.languageDisplay}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Regions */}
                <div>
                  <h3 className="font-semibold mb-2">Choose a region and language</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {regionOptions.map(region => (
                      <div key={region.code} className={`border p-4 rounded cursor-pointer ${ selectedRegion.code === region.code ? 'bg-black text-white' : 'hover:bg-gray-100'}`}onClick={() => selectRegion(region)}>
                        <div className="font-semibold">{region.name}</div>
                        <div className="text-sm">{region.languageDisplay}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs mt-8 text-gray-500">
                  Any changes to the preferences are optional and will persist through your user session.
                </p>
              </div>
            </div>
          )}

          <button onClick={() => setShowLogin(true)} className="font-bold bg-white rounded-full text-blue-700 hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all ease-in-out duration-300 p-2 px-3 flex justify-items cursor-pointer">Sign in</button>  
          <AuthModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </div>
    </div>
  )
}

export default NavBar