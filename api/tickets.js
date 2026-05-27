const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;

let cachedToken = null;
let tokenExpiry = 0;

// Cache de tickets por 5 minutos
let ticketsCache = null;
let ticketsCacheExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://accounts.zoho.com/oauth/v2/token", { method: "POST", body: params });
  const data = await res.json();
  if (!data.access_token) throw new Error("Token error: " + JSON.stringify(data));
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { from = 1 } = req.query;
    const cacheKey = `from_${from}`;

    // Retorna cache se ainda válido
    if (ticketsCache?.[cacheKey] && Date.now() < ticketsCacheExpiry) {
      return res.status(200).json(ticketsCache[cacheKey]);
    }

    const token = await getAccessToken();
    const url = `https://desk.zoho.com/api/v1/tickets?limit=100&from=${from}&include=contacts,assignee,departments`;
    const zohoRes = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${token}`, orgId: ZOHO_ORG_ID },
    });
    const data = await zohoRes.json();
    if (!zohoRes.ok) return res.status(zohoRes.status).json(data);

    // Salva no cache por 5 minutos
    if (!ticketsCache) ticketsCache = {};
    ticketsCache[cacheKey] = data;
    ticketsCacheExpiry = Date.now() + 5 * 60 * 1000;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
