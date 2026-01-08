export const openAstroWhatsApp = (): void => {
  console.log("WhatsApp function triggered ✅");

  const phoneNumber = "918807556886";
  const message = "Hi 👋 I want to consult an astrologer.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};