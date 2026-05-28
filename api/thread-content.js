const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;

let cachedToken = null;
let tokenExpiry = 0;

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
  if (req.method === "OPTIONS") return res.status(200).end();

  const { ticketId, threadId } = req.query;
  if (!ticketId || !threadId) return res.status(400).json({ error: "ticketId e threadId obrigatórios" });

  try {
    const token = await getAccessToken();
    const zohoRes = await fetch(
      `https://desk.zoho.com/api/v1/tickets/${ticketId}/threads/${threadId}`,
      { headers: { Authorization: `Zoho-oauthtoken ${token}`, orgId: ZOHO_ORG_ID } }
    );
    const data = await zohoRes.json();
    return res.status(zohoRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
