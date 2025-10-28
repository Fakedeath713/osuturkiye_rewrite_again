import type { APIRoute } from 'astro';
import db from '../../../lib/mongodb';
import type { Banner } from '../../../types/Banner';

export const GET: APIRoute = async () => {
  try {
    const bannersCollection = db.collection('banners');
    
    const banners = await bannersCollection
      .find({ active: true })
      .sort({ order: 1 })
      .toArray();
    
    return new Response(JSON.stringify(banners), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch banners' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};