// Major cities and countries for location selection
export interface LocationOption {
  name: string;
  lat: number;
  lng: number;
  country: string;
  type: 'city' | 'country';
}

export const locationOptions: LocationOption[] = [
  // North America - Cities
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, country: 'United States', type: 'city' },
  { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, country: 'United States', type: 'city' },
  { name: 'Chicago, USA', lat: 41.8781, lng: -87.6298, country: 'United States', type: 'city' },
  { name: 'Houston, USA', lat: 29.7604, lng: -95.3698, country: 'United States', type: 'city' },
  { name: 'Phoenix, USA', lat: 33.4484, lng: -112.0740, country: 'United States', type: 'city' },
  { name: 'Philadelphia, USA', lat: 39.9526, lng: -75.1652, country: 'United States', type: 'city' },
  { name: 'San Antonio, USA', lat: 29.4241, lng: -98.4936, country: 'United States', type: 'city' },
  { name: 'San Diego, USA', lat: 32.7157, lng: -117.1611, country: 'United States', type: 'city' },
  { name: 'Dallas, USA', lat: 32.7767, lng: -96.7970, country: 'United States', type: 'city' },
  { name: 'San Jose, USA', lat: 37.3382, lng: -121.8863, country: 'United States', type: 'city' },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada', type: 'city' },
  { name: 'Montreal, Canada', lat: 45.5017, lng: -73.5673, country: 'Canada', type: 'city' },
  { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207, country: 'Canada', type: 'city' },
  { name: 'Calgary, Canada', lat: 51.0447, lng: -114.0719, country: 'Canada', type: 'city' },
  { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332, country: 'Mexico', type: 'city' },
  { name: 'Guadalajara, Mexico', lat: 20.6597, lng: -103.3496, country: 'Mexico', type: 'city' },
  
  // Africa - Cities
  { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, country: 'Nigeria', type: 'city' },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, country: 'Egypt', type: 'city' },
  { name: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473, country: 'South Africa', type: 'city' },
  { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, country: 'South Africa', type: 'city' },
  { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, country: 'Kenya', type: 'city' },
  { name: 'Accra, Ghana', lat: 5.6037, lng: -0.1870, country: 'Ghana', type: 'city' },
  { name: 'Addis Ababa, Ethiopia', lat: 9.1450, lng: 38.7617, country: 'Ethiopia', type: 'city' },
  { name: 'Casablanca, Morocco', lat: 33.5731, lng: -7.5898, country: 'Morocco', type: 'city' },
  { name: 'Dar es Salaam, Tanzania', lat: -6.7924, lng: 39.2083, country: 'Tanzania', type: 'city' },
  { name: 'Abuja, Nigeria', lat: 9.0765, lng: 7.3986, country: 'Nigeria', type: 'city' },
  { name: 'Kinshasa, DRC', lat: -4.4419, lng: 15.2663, country: 'Democratic Republic of the Congo', type: 'city' },
  
  // Europe - Cities
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'United Kingdom', type: 'city' },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'France', type: 'city' },
  { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'Germany', type: 'city' },
  { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, country: 'Spain', type: 'city' },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, country: 'Italy', type: 'city' },
  { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, country: 'Netherlands', type: 'city' },
  { name: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517, country: 'Belgium', type: 'city' },
  { name: 'Vienna, Austria', lat: 48.2082, lng: 16.3738, country: 'Austria', type: 'city' },
  { name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686, country: 'Sweden', type: 'city' },
  { name: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683, country: 'Denmark', type: 'city' },
  { name: 'Dublin, Ireland', lat: 53.3498, lng: -6.2603, country: 'Ireland', type: 'city' },
  { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122, country: 'Poland', type: 'city' },
  { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393, country: 'Portugal', type: 'city' },
  
  // Asia - Cities
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan', type: 'city' },
  { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, country: 'China', type: 'city' },
  { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737, country: 'China', type: 'city' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, country: 'India', type: 'city' },
  { name: 'Delhi, India', lat: 28.6139, lng: 77.2090, country: 'India', type: 'city' },
  { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, country: 'India', type: 'city' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', type: 'city' },
  { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, country: 'South Korea', type: 'city' },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, country: 'Thailand', type: 'city' },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, country: 'Indonesia', type: 'city' },
  { name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842, country: 'Philippines', type: 'city' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, country: 'United Arab Emirates', type: 'city' },
  { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia', type: 'city' },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, country: 'Turkey', type: 'city' },
  { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, country: 'Pakistan', type: 'city' },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, country: 'Bangladesh', type: 'city' },
  
  // Middle East
  { name: 'Tehran, Iran', lat: 35.6892, lng: 51.3890, country: 'Iran', type: 'city' },
  { name: 'Baghdad, Iraq', lat: 33.3152, lng: 44.3661, country: 'Iraq', type: 'city' },
  { name: 'Jerusalem, Israel', lat: 31.7683, lng: 35.2137, country: 'Israel', type: 'city' },
  { name: 'Beirut, Lebanon', lat: 33.8938, lng: 35.5018, country: 'Lebanon', type: 'city' },
  
  // Oceania
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia', type: 'city' },
  { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, country: 'Australia', type: 'city' },
  { name: 'Auckland, New Zealand', lat: -36.8485, lng: 174.7633, country: 'New Zealand', type: 'city' },
  
  // South America
  { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, country: 'Brazil', type: 'city' },
  { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, country: 'Brazil', type: 'city' },
  { name: 'Buenos Aires, Argentina', lat: -34.6118, lng: -58.3960, country: 'Argentina', type: 'city' },
  { name: 'Lima, Peru', lat: -12.0464, lng: -77.0428, country: 'Peru', type: 'city' },
  { name: 'Bogotá, Colombia', lat: 4.7110, lng: -74.0721, country: 'Colombia', type: 'city' },
  { name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693, country: 'Chile', type: 'city' },
  { name: 'Caracas, Venezuela', lat: 10.4806, lng: -66.9036, country: 'Venezuela', type: 'city' },
  
  // Countries (using capital coordinates)
  { name: 'United States', lat: 39.8283, lng: -98.5795, country: 'United States', type: 'country' },
  { name: 'Canada', lat: 56.1304, lng: -106.3468, country: 'Canada', type: 'country' },
  { name: 'Mexico', lat: 23.6345, lng: -102.5528, country: 'Mexico', type: 'country' },
  { name: 'Nigeria', lat: 9.0820, lng: 8.6753, country: 'Nigeria', type: 'country' },
  { name: 'South Africa', lat: -30.5595, lng: 22.9375, country: 'South Africa', type: 'country' },
  { name: 'Kenya', lat: -0.0236, lng: 37.9062, country: 'Kenya', type: 'country' },
  { name: 'Ghana', lat: 7.9465, lng: -1.0232, country: 'Ghana', type: 'country' },
  { name: 'Egypt', lat: 26.8206, lng: 30.8025, country: 'Egypt', type: 'country' },
  { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, country: 'United Kingdom', type: 'country' },
  { name: 'France', lat: 46.2276, lng: 2.2137, country: 'France', type: 'country' },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, country: 'Germany', type: 'country' },
  { name: 'Spain', lat: 40.4637, lng: -3.7492, country: 'Spain', type: 'country' },
  { name: 'Italy', lat: 41.8719, lng: 12.5674, country: 'Italy', type: 'country' },
  { name: 'China', lat: 35.8617, lng: 104.1954, country: 'China', type: 'country' },
  { name: 'India', lat: 20.5937, lng: 78.9629, country: 'India', type: 'country' },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, country: 'Japan', type: 'country' },
  { name: 'Brazil', lat: -14.2350, lng: -51.9253, country: 'Brazil', type: 'country' },
  { name: 'Australia', lat: -25.2744, lng: 133.7751, country: 'Australia', type: 'country' },
].sort((a, b) => a.name.localeCompare(b.name));

