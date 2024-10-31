import { GoogleGenerativeAI } from "@google/generative-ai";
import { mkConfig, generateCsv, download } from "export-to-csv";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function askAIForLocations({ categories, location, numberOfLocations }: { 
  categories: string[], 
  location: string, 
  numberOfLocations: number 
}) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a local travel agent. You list specific locations. Do not include general areas or the location itselfin the list of locations. Do not include locations that do not have physical addresses, websites, or hours of operations listed"
    });
    
    const categoryQuestions: { [key: string]: string } = {
      do: `Where are ${numberOfLocations} places to do activities in ${location}?`,
      eat: `Where are ${numberOfLocations} places to eat in ${location}?`,
      stay: `Where are ${numberOfLocations} places to stay in ${location}?`,
      shop: `Where are ${numberOfLocations} places to shop in ${location}?`
    };
    console.log('categoryQuestions:', categoryQuestions);

    const questions = categories
      .map(category => category.toLowerCase())
      .filter(category => category in categoryQuestions)
      .map(category => categoryQuestions[category]);

    const result = await model.generateContent(questions);
    const responseText = result.response.text();
    console.log('responseText:', responseText);
    
    const parsedRecommendations = await parseRecommendations(responseText, location);
    console.log('parsedRecommendations:', parsedRecommendations);
    return parsedRecommendations;
  } catch (error) {
    console.error('Error in askAIForLocations:', error);
    throw error; // Re-throw the error after logging
  }
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

export interface CategoryRecommendations {
  category: 'do' | 'eat' | 'stay' | 'shop';
  recommendations: Recommendation[];
}

async function parseRecommendations(response: string, location: string): Promise<CategoryRecommendations[]> {
  // Split the content into categories
  const categories = response.split(/^##\s+/m)
    .map(category => category.trim())
    .filter(Boolean);

  const parsedCategories = await Promise.all(categories.map(async category => {
    const [categoryTitle, ...items] = category.split('\n').filter(Boolean);
    
    // Remove any remaining special characters from the category title
    const cleanCategoryTitle = categoryTitle.replace(/[*#]/g, '').trim();
    
    let simplifiedCategory: 'do' | 'eat' | 'stay' | 'shop';
    if (cleanCategoryTitle.toLowerCase().includes('activities') || cleanCategoryTitle.toLowerCase().includes('do')) {
      simplifiedCategory = 'do';
    } else if (cleanCategoryTitle.toLowerCase().includes('eat') || cleanCategoryTitle.toLowerCase().includes('food') || cleanCategoryTitle.toLowerCase().includes('eating')) {
      simplifiedCategory = 'eat';
    } else if (cleanCategoryTitle.toLowerCase().includes('stay') || cleanCategoryTitle.toLowerCase().includes('staying')) {
      simplifiedCategory = 'stay';
    } else if (cleanCategoryTitle.toLowerCase().includes('shopping') || cleanCategoryTitle.toLowerCase().includes('shop')) {
      simplifiedCategory = 'shop';
    } else {
      return null; // Skip categories that don't match our expected types
    }

    const recommendations = await Promise.all(items.map(async item => {
      const match = item.match(/^\d+\.\s*\*\*(.*?):\*\*\s*(.*)/);
      if (!match) return null;

      const [, name, description] = match;
      const cleanName = name.trim();
      
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
      recommendations: recommendations.filter((rec): rec is Recommendation => rec !== null)
    };
  }));

  return parsedCategories.filter((cat): cat is CategoryRecommendations => cat !== null);
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
      photos: place.photos ? place.photos.map((photo: { photo_reference: string }) => 
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
