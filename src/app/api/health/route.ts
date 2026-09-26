import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({
      success: true,
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        database: 'disconnected',
        message: 'MongoDB connection failed or unavailable.',
      },
      { status: 503 }
    );
  }
}
