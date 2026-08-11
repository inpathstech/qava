(function () {
  const NEWSLETTER_API_URL = "https://api.theclubnyc.com/admin/newsletter-subscribe";

  function normalizePayload(payload) {
    const firstName = (payload.firstName || "").trim();
    const email = (payload.email || "").trim().toLowerCase();
    const source = (payload.source || "landing-page").trim() || "landing-page";
    const metadata = payload.metadata && typeof payload.metadata === "object" ? payload.metadata : undefined;

    return { firstName, email, source, metadata };
  }

  async function qavaNewsletterSubscribe(payload) {
    const body = normalizePayload(payload);

    if (!body.firstName || !body.email) {
      throw new Error("First name and email are required.");
    }

    const response = await fetch(NEWSLETTER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Unable to subscribe right now. Please try again.");
    }

    return data;
  }

  window.qavaNewsletterSubscribe = qavaNewsletterSubscribe;
})();
