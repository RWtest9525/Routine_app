import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParseSyllabusRequest {
  syllabusText?: string;
  semesterTitle?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ParseSyllabusRequest = await req.json();
    const { syllabusText, semesterTitle = 'Semester II' } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your-gemini-api-key-here' && !apiKey.includes('placeholder')) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
        systemInstruction: `You are an expert curriculum parser for BCA university syllabi.
Extract the structured syllabus into exact JSON following this schema:
{
  "semester": "Semester Title",
  "subjects": [
    {
      "code": "e.g. ADP2",
      "name": "Full Subject Name",
      "credits": 4,
      "category": "university",
      "color": "#6366f1",
      "description": "Short overview",
      "units": [
        {
          "unitNumber": 1,
          "title": "Unit Title",
          "description": "Unit description",
          "topics": [
            {
              "title": "Topic Name",
              "estimatedHours": 2.5
            }
          ]
        }
      ]
    }
  ]
}
Do not hallucinate topics; strictly parse what is present in the text.`,
      });

      const prompt = `Please parse the following university syllabus text into the structured JSON schema:\n\n${syllabusText}`;
      const result = await model.generateContent(prompt);
      const jsonResponse = JSON.parse(result.response.text());

      return NextResponse.json({
        success: true,
        data: jsonResponse,
      });
    }

    // Default High-Quality Template if API Key is not yet configured
    const sampleParsed = {
      semester: semesterTitle,
      subjects: [
        {
          code: 'OOP-CPP',
          name: 'Object-Oriented Programming with C++',
          credits: 4,
          category: 'university',
          color: '#3b82f6',
          description: 'Classes, Objects, Inheritance, Polymorphism, Templates, and STL in C++.',
          units: [
            {
              unitNumber: 1,
              title: 'Principles of Object-Oriented Programming',
              description: 'Encapsulation, Data Hiding, Abstraction, and Class Syntax in C++',
              topics: [
                { title: 'OOP Concepts vs Procedural Paradigm', estimatedHours: 2.5 },
                { title: 'Classes, Objects & Member Functions', estimatedHours: 3.0 },
                { title: 'Constructors, Destructors & Constructor Overloading', estimatedHours: 3.5 },
              ],
            },
            {
              unitNumber: 2,
              title: 'Inheritance & Polymorphism',
              description: 'Single, Multilevel, Multiple Inheritance, Virtual Functions & Dynamic Binding',
              topics: [
                { title: 'Inheritance Modes (Public, Protected, Private)', estimatedHours: 3.0 },
                { title: 'Operator Overloading & Friend Functions', estimatedHours: 3.5 },
                { title: 'Virtual Functions & Pure Virtual Abstract Classes', estimatedHours: 4.0 },
              ],
            },
          ],
        },
        {
          code: 'DSA2',
          name: 'Data Structures & Algorithms-I',
          credits: 4,
          category: 'university',
          color: '#10b981',
          description: 'Linked Lists, Stacks, Queues, Binary Trees, and Searching/Sorting Algorithms.',
          units: [
            {
              unitNumber: 1,
              title: 'Linear Data Structures (Linked Lists & Stacks)',
              description: 'Singly, Doubly, Circular Linked Lists, Stack ADT, Polish Notation',
              topics: [
                { title: 'Singly & Doubly Linked List Operations', estimatedHours: 4.0 },
                { title: 'Stack Implementation & Infix to Postfix Conversion', estimatedHours: 3.5 },
                { title: 'Queue & Circular Queue Implementation', estimatedHours: 3.0 },
              ],
            },
          ],
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: sampleParsed,
      note: 'Using template parser. Add GEMINI_API_KEY to .env.local for dynamic custom PDF text parsing.',
    });
  } catch (error: any) {
    console.error('Error in parse-syllabus API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse syllabus' },
      { status: 500 }
    );
  }
}
