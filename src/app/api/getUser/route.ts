import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const token = process.env.BEARER_TOKEN;

  if (!username || !token) {
    return NextResponse.json({ error: 'Missing username or token' }, { status: 400 });
  }

   const defaultFields = [
        'id',
        'name',
        'username',
        'created_at',
        'description',
        'location',
        'profile_image_url',
        'public_metrics'
      ];

      const fields = defaultFields;
      const userFieldsParam = fields.join(',');

  try {
    const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}?user.fields=${userFieldsParam}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ msg: 'fetched', data: response.data });
  } catch (error: any) {
    console.error("❌ Twitter API error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: error?.response?.data || "Internal server error" },
      { status: 500 }
    );
  }
}
