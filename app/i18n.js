"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const languages = {
  en: "English",
  hi: "हिंदी",
  bn: "বাংলা",
  te: "తెలుగు",
  mr: "मराठी",
  ta: "தமிழ்",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
};

const translations = {
  en: {
    "All services": "All services", "Secure routing": "Secure routing", "Detailed grievance form": "Detailed grievance form", "Pin the affected place": "Pin the affected place", "Choose the exact point": "Choose the exact point", "Your explanation": "Your explanation", "Tell the responsible office what happened": "Tell the responsible office what happened", "Responsible officials": "Responsible officials", "Resolution team for this area": "Resolution team for this area", "Use current location": "Use current location", "Open in Google Maps": "Open in Google Maps", "Save location": "Save location", "Location saved": "Location saved", "Attach a photo of the problem": "Attach a photo of the problem", "Prepare my grievance": "Prepare my grievance", "Your report is ready for review.": "Your report is ready for review.", "Return to services": "Return to services", "Incident location": "Incident location", "Exact address or landmark": "Exact address or landmark", "Pin the place. Tell us what happened.": "Pin the place. Tell us what happened.", "This helps route your grievance to the responsible official in the right local jurisdiction.": "This helps route your grievance to the responsible official in the right local jurisdiction.", "Please include the duration, impact and any prior complaint reference.": "Please include the duration, impact and any prior complaint reference.", "Finding location...": "Finding location...", "Current location selected.": "Current location selected.", "Your Copilot is working": "Your Copilot is working", "Citizen": "Citizen", "Officer": "Officer", "Raise grievance": "Raise grievance"
  },
  hi: {
    "All services": "सभी सेवाएं", "Secure routing": "सुरक्षित रूटिंग", "Detailed grievance form": "विस्तृत शिकायत फॉर्म", "Pin the affected place": "प्रभावित स्थान पिन करें", "Choose the exact point": "सटीक स्थान चुनें", "Your explanation": "आपका विवरण", "Tell the responsible office what happened": "जिम्मेदार कार्यालय को समस्या बताएं", "Responsible officials": "जिम्मेदार अधिकारी", "Resolution team for this area": "इस क्षेत्र की समाधान टीम", "Use current location": "वर्तमान स्थान का उपयोग करें", "Open in Google Maps": "Google Maps में खोलें", "Save location": "स्थान सहेजें", "Location saved": "स्थान सहेजा गया", "Attach a photo of the problem": "समस्या की फोटो जोड़ें", "Prepare my grievance": "मेरी शिकायत तैयार करें", "Your report is ready for review.": "आपकी रिपोर्ट समीक्षा के लिए तैयार है।", "Return to services": "सेवाओं पर लौटें", "Incident location": "घटना का स्थान", "Exact address or landmark": "सटीक पता या पहचान चिन्ह", "Pin the place. Tell us what happened.": "स्थान पिन करें। समस्या बताएं।", "This helps route your grievance to the responsible official in the right local jurisdiction.": "इससे आपकी शिकायत सही क्षेत्र के जिम्मेदार अधिकारी तक पहुंचेगी।", "Please include the duration, impact and any prior complaint reference.": "अवधि, प्रभाव और पिछली शिकायत संख्या शामिल करें।", "Finding location...": "स्थान खोजा जा रहा है...", "Current location selected.": "वर्तमान स्थान चुना गया।", "Your Copilot is working": "आपका सहायक काम कर रहा है", "Citizen": "नागरिक", "Officer": "अधिकारी", "Raise grievance": "शिकायत दर्ज करें"
  },
  mr: {
    "All services": "सर्व सेवा", "Secure routing": "सुरक्षित रूटिंग", "Detailed grievance form": "तपशीलवार तक्रार फॉर्म", "Pin the affected place": "प्रभावित ठिकाण पिन करा", "Choose the exact point": "अचूक ठिकाण निवडा", "Your explanation": "तुमचे स्पष्टीकरण", "Tell the responsible office what happened": "जबाबदार कार्यालयाला समस्या सांगा", "Responsible officials": "जबाबदार अधिकारी", "Resolution team for this area": "या भागाची निराकरण टीम", "Use current location": "सध्याचे ठिकाण वापरा", "Open in Google Maps": "Google Maps मध्ये उघडा", "Save location": "ठिकाण जतन करा", "Location saved": "ठिकाण जतन केले", "Attach a photo of the problem": "समस्येचा फोटो जोडा", "Prepare my grievance": "माझी तक्रार तयार करा", "Your report is ready for review.": "तुमचा अहवाल पाहणीसाठी तयार आहे.", "Return to services": "सेवांकडे परत जा", "Incident location": "घटनेचे ठिकाण", "Exact address or landmark": "अचूक पत्ता किंवा ओळखचिन्ह", "Pin the place. Tell us what happened.": "ठिकाण पिन करा. काय घडले ते सांगा.", "Please include the duration, impact and any prior complaint reference.": "कालावधी, परिणाम आणि मागील तक्रार क्रमांक द्या.", "Finding location...": "ठिकाण शोधत आहे...", "Current location selected.": "सध्याचे ठिकाण निवडले.", "Your Copilot is working": "तुमचा सहायक काम करत आहे", "Citizen": "नागरिक", "Officer": "अधिकारी", "Raise grievance": "तक्रार नोंदवा"
  },
  ta: { "All services": "அனைத்து சேவைகள்", "Secure routing": "பாதுகாப்பான வழித்தடம்", "Detailed grievance form": "விரிவான புகார் படிவம்", "Responsible officials": "பொறுப்பு அதிகாரிகள்", "Use current location": "தற்போதைய இடத்தைப் பயன்படுத்தவும்", "Save location": "இடத்தைச் சேமிக்கவும்", "Prepare my grievance": "என் புகாரைத் தயாரிக்கவும்", "Return to services": "சேவைகளுக்குத் திரும்பவும்", "Citizen": "குடிமகன்", "Officer": "அதிகாரி", "Raise grievance": "புகார் அளிக்கவும்" },
  te: { "All services": "అన్ని సేవలు", "Secure routing": "సురక్షిత రూటింగ్", "Detailed grievance form": "వివరణాత్మక ఫిర్యాదు ఫారం", "Responsible officials": "బాధ్యతగల అధికారులు", "Use current location": "ప్రస్తుత స్థానాన్ని ఉపయోగించండి", "Save location": "స్థానాన్ని సేవ్ చేయండి", "Prepare my grievance": "నా ఫిర్యాదును సిద్ధం చేయండి", "Return to services": "సేవలకు తిరిగి వెళ్లండి", "Citizen": "పౌరుడు", "Officer": "అధికారి", "Raise grievance": "ఫిర్యాదు చేయండి" },
  bn: { "All services": "সব পরিষেবা", "Secure routing": "নিরাপদ রাউটিং", "Detailed grievance form": "বিস্তারিত অভিযোগ ফর্ম", "Responsible officials": "দায়িত্বপ্রাপ্ত আধিকারিক", "Use current location": "বর্তমান অবস্থান ব্যবহার করুন", "Save location": "অবস্থান সংরক্ষণ করুন", "Prepare my grievance": "আমার অভিযোগ প্রস্তুত করুন", "Return to services": "পরিষেবায় ফিরুন", "Citizen": "নাগরিক", "Officer": "কর্মকর্তা", "Raise grievance": "অভিযোগ দাখিল করুন" },
};

const LanguageContext = createContext({ language: "en", setLanguage: () => {}, t: (value) => value });

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  useEffect(() => { const saved = localStorage.getItem("jan-language"); if (saved && languages[saved]) setLanguage(saved); }, []);
  const changeLanguage = (value) => { setLanguage(value); localStorage.setItem("jan-language", value); };
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: (key) => translations[language]?.[key] || translations.en[key] || key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
