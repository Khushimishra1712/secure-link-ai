export interface ScanResult {
  url: string;
  threatScore: number;
  status: "Safe" | "Suspicious" | "Dangerous";
  analysis: {
    hasHTTPS: boolean;
    domainAge?: number;
    suspiciousKeywords: string[];
    urlLength: number;
    redirects?: number;
    ipBased: boolean;
    recommendations: string[];
  };
}

export async function scanUrl(inputUrl: string): Promise<ScanResult> {
  let urlObj: URL;
  try {
    if (!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://")) {
      inputUrl = "https://" + inputUrl;
    }
    urlObj = new URL(inputUrl);
  } catch (e) {
    throw new Error("Invalid URL format");
  }

  const analysis = {
    hasHTTPS: urlObj.protocol === "https:",
    suspiciousKeywords: [] as string[],
    urlLength: inputUrl.length,
    ipBased: false,
    recommendations: [] as string[],
  };

  let score = 0;

  if (!analysis.hasHTTPS) {
    score += 30;
    analysis.recommendations.push("The connection is not encrypted (missing HTTPS). Avoid entering sensitive information.");
  }

  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(urlObj.hostname)) {
    analysis.ipBased = true;
    score += 40;
    analysis.recommendations.push("The URL uses an IP address instead of a domain name, which is highly suspicious.");
  }

  const keywords = ["login", "secure", "bank", "update", "verify", "account", "paypal", "admin", "free"];
  for (const keyword of keywords) {
    if (urlObj.hostname.includes(keyword) || urlObj.pathname.includes(keyword)) {
      analysis.suspiciousKeywords.push(keyword);
      score += 15;
    }
  }

  if (analysis.suspiciousKeywords.length > 0) {
    analysis.recommendations.push(`Suspicious keywords found in the URL: ${analysis.suspiciousKeywords.join(", ")}`);
  }

  if (analysis.urlLength > 100) {
    score += 10;
    analysis.recommendations.push("The URL is unusually long, which can be used to hide malicious payloads or typosquatting.");
  } else if (analysis.urlLength > 60) {
    score += 5;
  }

  const parts = urlObj.hostname.split(".");
  if (parts.length > 3 && !analysis.ipBased && !urlObj.hostname.includes("co.uk")) { // simple bypass for co.uk
    score += 20;
    analysis.recommendations.push("The URL has multiple subdomains, which is common in phishing attacks.");
  }

  let status: "Safe" | "Suspicious" | "Dangerous";
  if (score <= 30) {
    status = "Safe";
    if (analysis.recommendations.length === 0) {
        analysis.recommendations.push("The URL appears to be safe based on basic security heuristics.");
    }
  } else if (score <= 60) {
    status = "Suspicious";
  } else {
    status = "Dangerous";
  }

  score = Math.min(score, 100);

  return {
    url: inputUrl,
    threatScore: score,
    status,
    analysis,
  };
}
