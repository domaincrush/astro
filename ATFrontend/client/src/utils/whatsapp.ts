const PHONE_NUMBER = "918807556886";

export const openWhatsAppWithMessage = (message: string): void => {
  console.log("WhatsApp triggered ✅", message);

  const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

// ---- PREDEFINED FLOWS ---- //

export const openAstroWhatsApp = (): void => {
  openWhatsAppWithMessage("Hi 👋 I want to consult an astrologer.");
};

export const openPremiumReportWhatsApp = (): void => {
  openWhatsAppWithMessage("Hi 👋 I want to get a premium report.");
};

export const openYearlyReportWhatsApp = (): void => {
  openWhatsAppWithMessage("Hi 👋 I want to view my yearly report.");
};

export const openBannerWhatsApp = (): void => {
  openWhatsAppWithMessage("Hi 👋 I want to ask 3 questions.");
};