import { GoogleGenerativeAI } from "@google/generative-ai";
import { mkConfig, generateCsv, download } from "export-to-csv";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function askAIForLocations({ categories, location, numberOfLocations }: { 
  categories: string[], 
  location: string, 
  numberOfLocations: number 
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const questions: string[] = [];
  
  const categoryQuestions: { [key: string]: string } = {
    do: `What are the top ${numberOfLocations} places to do things in ${location}?`,
    eat: `What are the top ${numberOfLocations} places to eat in ${location}?`,
    stay: `What are the top ${numberOfLocations} places to stay in ${location}?`,
    shop: `What are the top ${numberOfLocations} places to shop in ${location}?`
  };

  categories.forEach(category => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory in categoryQuestions) {
      questions.push(categoryQuestions[lowerCategory]);
    }
  });

  const result = await model.generateContent(questions);
  const responseText = result.response.text();
  const parsedRecommendations = await parseRecommendations(responseText, location);

  return parsedRecommendations;
}

export interface Recommendation {
  name: string;
  description: string;
  photos: string[];
  hours: string[];
  googleDescription: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  phone: string | null;
  website: string | null;
}

interface CategoryRecommendations {
  category: 'do' | 'eat' | 'stay' | 'shop';
  recommendations: Recommendation[];
}

async function parseRecommendations(response: string, location: string): Promise<CategoryRecommendations[]> {
  const categories = response.split('##').filter(Boolean);
  
  const parsedCategories = await Promise.all(categories.map(async category => {
    const [categoryTitle, ...items] = category.trim().split('\n').filter(Boolean);
    
    let simplifiedCategory: 'do' | 'eat' | 'stay' | 'shop';
    if (categoryTitle.toLowerCase().includes('places to do')) {
      simplifiedCategory = 'do';
    } else if (categoryTitle.toLowerCase().includes('places to eat')) {
      simplifiedCategory = 'eat';
    } else if (categoryTitle.toLowerCase().includes('places to stay')) {
      simplifiedCategory = 'stay';
    } else if (categoryTitle.toLowerCase().includes('places to shop')) {
      simplifiedCategory = 'shop';
    } else {
      throw new Error(`Unknown category: ${categoryTitle}`);
    }

    const recommendations = await Promise.all(items.map(async item => {
      const [name, description] = item.split(':');
      const cleanName = name.replace(/^\d+\.\s*\*\*/, '').replace(/\*\*$/, '').trim();
      
      const placeDetails = await getPlaceDetails(cleanName, location);

      return {
        name: placeDetails ? placeDetails.name : cleanName,
        description: description ? description.trim() : '',
        photos: placeDetails ? placeDetails.photos : [],
        hours: placeDetails ? placeDetails.hours : [],
        googleDescription: placeDetails ? placeDetails.description : '',
        latitude: placeDetails ? placeDetails.latitude : null,
        longitude: placeDetails ? placeDetails.longitude : null,
        address: placeDetails ? placeDetails.address : null,
        phone: placeDetails ? placeDetails.phone : null,
        website: placeDetails ? placeDetails.website : null
      };
    }));

    return {
      category: simplifiedCategory,
      recommendations
    };
  }));

  return parsedCategories;
}

export interface PlaceDetails {
  name: string;
  photos: string[];
  hours: string[];
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  website: string;
}

async function getPlaceDetails(placeName: string, location: string): Promise<PlaceDetails | null> {
  if (!apiKey) {
    throw new Error('Google Places API key is not set');
  }

  try {
    // First, search for the place
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.append('query', `${placeName} in ${location}`);
    searchUrl.searchParams.append('key', apiKey);

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results.length === 0) {
      console.log(`No results found for ${placeName}`);
      return null;
    }

    const placeId = searchData.results[0].place_id;
    const { lat, lng } = searchData.results[0].geometry.location;
    const formattedAddress = searchData.results[0].formatted_address;

    // Then, get the place details
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    detailsUrl.searchParams.append('place_id', placeId);
    detailsUrl.searchParams.append('fields', 'name,photos,opening_hours,editorial_summary,formatted_phone_number,website');
    detailsUrl.searchParams.append('key', apiKey);

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    const place = detailsData.result;

    return {
      name: place.name,
      photos: place.photos ? place.photos.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
      ) : [],
      hours: place.opening_hours ? place.opening_hours.weekday_text : [],
      description: place.editorial_summary ? place.editorial_summary.overview : '',
      latitude: lat,
      longitude: lng,
      address: formattedAddress,
      phone: place.formatted_phone_number || '',
      website: place.website || ''
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

interface FlattenedRecommendation extends Recommendation {
  category: 'do' | 'eat' | 'stay' | 'shop';
}

function flattenRecommendations(categoryRecommendations: CategoryRecommendations[]): FlattenedRecommendation[] {
  return categoryRecommendations.flatMap(categoryRec => 
    categoryRec.recommendations.map(rec => ({
      ...rec,
      category: categoryRec.category
    }))
  );
}

export function exportRecommendationsToCSV(recommendations: CategoryRecommendations[]) {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    quoteStrings: true,
    decimalSeparator: '.',
    showTitle: true,
    title: 'Place Recommendations',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    filename: 'journez-ai-place-recommendations'
  });

  const data = flattenRecommendations(recommendations);
  const dataToExport = data.map(rec => ({
    Category: rec.category,
    Name: rec.name,
    Description: rec.description,
    GoogleDescription: rec.googleDescription,
    Address: rec.address,
    Latitude: rec.latitude,
    Longitude: rec.longitude,
    Photos: rec.photos.join('; '),
    Hours: rec.hours.join('; '),
    Phone: rec.phone,
    Website: rec.website
  }));

  const csv = generateCsv(csvConfig)(dataToExport);
  download(csvConfig)(csv);
}
