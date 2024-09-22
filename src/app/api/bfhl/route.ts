// src/app/api/bfhl/route.ts

import { NextRequest, NextResponse } from 'next/server';


const USER_ID = "SPARSH_PRAKASH_03031995";
const EMAIL = "sparsh.prakash03@gmail.com";
const ROLL_NUMBER = "RA2111026030184";

export async function GET() {
  return NextResponse.json({ operation_code: 1 });
}

interface FileInfo {
  file_valid: boolean;
  file_mime_type: string | null;
  file_size_kb: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, file_b64 } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json({ is_success: false, error: "Invalid input" }, { status: 400 });
    }

    const numbers = data.filter(item => !isNaN(Number(item)));
    const alphabets = data.filter(item => isNaN(Number(item)));
    const lowercaseAlphabets = alphabets.filter(item => item.toLowerCase() === item);
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    let fileInfo: FileInfo = {
      file_valid: false,
      file_mime_type: null,
      file_size_kb: null
    };

    if (file_b64) {
      // In a real scenario, you'd decode and validate the file here
      fileInfo = {
        file_valid: true,
        file_mime_type: "application/octet-stream", // Example MIME type
        file_size_kb: (file_b64.length * 3 / 4 / 1024).toFixed(2)
      };
    }

    return NextResponse.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      ...fileInfo
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ is_success: false, error: "Internal server error" }, { status: 500 });
  }
}