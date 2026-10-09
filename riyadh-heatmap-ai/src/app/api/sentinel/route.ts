import { NextResponse } from "next/server";
import sentinelMetadata from "@/data/sentinel_metadata.json";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: sentinelMetadata
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Failed to retrieve Sentinel-2 status"
    }, { status: 500 });
  }
}

export async function POST() {
  const clientId = process.env.SENTINEL_CLIENT_ID || "sh-9233cb56-06e6-4e70-bc6b-62e1dc6b429d";
  const clientSecret = process.env.SENTINEL_CLIENT_SECRET || "StM2UB9QFmIJV9BJigscVc6sq5ydzzuG1gNKQBFwcdhnm162WWB1xAfTJN3l6WVWLdySvSFaT7BhPLNBWvs5Zq";
  const tokenUrl = process.env.COPERNICUS_AUTH_URL || "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token";

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store"
    });

    if (!tokenRes.ok) {
      throw new Error(`Copernicus authentication failed: ${tokenRes.statusText}`);
    }

    const tokenData = await tokenRes.json();

    return NextResponse.json({
      success: true,
      message: "Connected to Copernicus Sentinel-2 API successfully!",
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Connection failed"
    }, { status: 500 });
  }
}
