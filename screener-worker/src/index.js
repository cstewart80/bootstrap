import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

const MAX = { name: 120, outlet: 160, email: 254 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cors(request, env) {
	const origin = request.headers.get("Origin");
	const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
	return {
		"Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		Vary: "Origin",
	};
}

const json = (body, status, headers) =>
	new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

export default {
	async fetch(request, env) {
		const headers = cors(request, env);
		if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
		if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, headers);

		const origin = request.headers.get("Origin");
		if (!(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).includes(origin)) {
			return json({ error: "Forbidden" }, 403, headers);
		}

		let data;
		try {
			data = await request.json();
		} catch {
			return json({ error: "Invalid request" }, 400, headers);
		}

		// Honeypot: bots fill hidden fields. Pretend success.
		if (data.website) return json({ ok: true }, 200, headers);

		const name = String(data.name || "").trim();
		const outlet = String(data.outlet || "").trim();
		const email = String(data.email || "").trim();
		if (!name || name.length > MAX.name || outlet.length > MAX.outlet || email.length > MAX.email || !EMAIL_RE.test(email)) {
			return json({ error: "Please check your name and email." }, 400, headers);
		}

		const msg = createMimeMessage();
		msg.setSender({ name: "Golden Wings site", addr: env.FROM_ADDRESS });
		msg.setRecipient(env.TO_ADDRESS);
		msg.setHeader("Reply-To", email);
		msg.setSubject(`Screener request: ${name}`.replace(/[\r\n]+/g, " "));
		msg.addMessage({
			contentType: "text/plain",
			data: `Name: ${name}\nOutlet/festival: ${outlet || "-"}\nEmail: ${email}\n`,
		});

		try {
			await env.SCREENER_EMAIL.send(new EmailMessage(env.FROM_ADDRESS, env.TO_ADDRESS, msg.asRaw()));
		} catch (err) {
			console.error("send failed", err);
			return json({ error: "Could not send. Please email us directly." }, 502, headers);
		}
		return json({ ok: true }, 200, headers);
	},
};
