import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { firestore } from '@/app/firebase/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const formData = await req.formData();
  const image = formData.get('image');
  const userId = formData.get('userId');

  if (!image || !userId) {
    return NextResponse.json({ error: 'Image and user ID are required' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Identify the items in this image that could be added to an inventory. Return a JSON array of item names, without any markdown formatting." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${Buffer.from(await image.arrayBuffer()).toString('base64')}`,
              },
            },
          ],
        },
      ],
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json\n?|\n?```/g, '');

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw content:', content);
      return NextResponse.json({ error: 'Error parsing API response' }, { status: 500 });
    }

    if (!Array.isArray(result)) {
      console.error('Result is not an array:', result);
      return NextResponse.json({ error: 'Unexpected API response format' }, { status: 500 });
    }

    for (const item of result) {
      const docRef = doc(firestore, 'users', userId, 'inventory', item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Item exists, increment quantity
        const currentQuantity = docSnap.data().quantity || 0;
        await updateDoc(docRef, { quantity: currentQuantity + 1 });
      } else {
        // Item doesn't exist, add it with quantity 1
        await setDoc(docRef, { quantity: 1 });
      }
    }

    return NextResponse.json({ items: result });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Error processing image' }, { status: 500 });
  }
}
