import { NextRequest, NextResponse } from 'next/server';

const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export async function POST(request: NextRequest) {
  try {
    const { postcode, city } = await request.json();
    if (typeof postcode !== 'string' || !postcodePattern.test(postcode.trim())) {
      return NextResponse.json({ valid: false, message: 'Enter a valid UK postcode, for example SW1A 1AA.' }, { status: 400 });
    }
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`, { cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ valid: false, message: 'This UK postcode could not be found. Check it and try again.' }, { status: 400 });
    const result = (await response.json()).result as { admin_district?: string; parish?: string; region?: string; country?: string };
    const cityValue = normalize(typeof city === 'string' ? city : '');
    const areas = [result.admin_district, result.parish, result.region, result.country].filter(Boolean).map((value) => normalize(value!));
    if (cityValue && !areas.some((area) => area.includes(cityValue) || cityValue.includes(area))) {
      return NextResponse.json({ valid: false, message: `This postcode is associated with ${result.admin_district || result.region || 'a different area'}. Check the city and postcode.` }, { status: 400 });
    }
    return NextResponse.json({ valid: true, area: result.admin_district || result.region || 'United Kingdom' });
  } catch {
    return NextResponse.json({ valid: false, message: 'We could not verify the address right now. Check the postcode format and try again.' }, { status: 503 });
  }
}
