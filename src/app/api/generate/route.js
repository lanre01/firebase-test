import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is correctly set in your environment variables
});

export async function POST(req) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `
                        You are an intelligent flashcard creation assistant designed to help users study efficiently. Your primary task is to generate flashcards that summarize complex information into digestible, quiz-ready questions and answers. 

                        The flashcards should:
                        - Cover key concepts, definitions, and important details.
                        - Be clear, concise, and focused on aiding memory retention.
                        - Include varied types of questions such as multiple-choice, fill-in-the-blank, and true/false.
                        - Consider different learning levels, from beginner to advanced.
                        Your goal is to assist users in mastering their subject matter through effective repetition and self-testing.

                        Create 10 flashcards for the topic: ${topic}. 
                        Return only valid JSON in the following format: 
                        {"flashcards":[{"front": "Front of the card", "back": "Back of the card","date" : ${new Date()}}]} without any additional text or explanations.`,
                },
            ],
        });

        // Attempt to parse the response as JSON
        const flashcards = JSON.parse(chatCompletion.choices[0]?.message?.content.trim());
        //console.log(flashcards);
        return NextResponse.json(flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards.' }, { status: 500 });
    }
}
