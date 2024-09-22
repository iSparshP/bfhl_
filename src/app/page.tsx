// src/app/page.tsx

'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';

interface ResponseData {
  alphabets?: string[];
  numbers?: number[];
  highest_lowercase_alphabet?: string;
  is_success?: boolean;
  user_id?: string;
  email?: string;
  roll_number?: string;
  file_valid?: boolean;
  file_mime_type?: string;
  file_size_kb?: string;
}

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await fetch('/api/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsedInput, file_b64: fileBase64 }),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ResponseData = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError('Invalid JSON input or network error');
    }
  };

  const filteredResponse = () => {
    if (!response) return null;
    const filtered: Partial<ResponseData> = {};
    if (selectedOptions.includes('Alphabets')) filtered.alphabets = response.alphabets;
    if (selectedOptions.includes('Numbers')) filtered.numbers = response.numbers;
    if (selectedOptions.includes('Highest lowercase alphabet')) filtered.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    return filtered;
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>RA2111026030184</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">BFHL Challenge</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder='Enter JSON input (e.g., { "data": ["A","C","z"] })'
        />
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result?.toString().split(',')[1];
                setFileBase64(base64 || null);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="w-full p-2 border rounded mt-2"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {response && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <select
            multiple
            value={selectedOptions}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedOptions(Array.from(e.target.selectedOptions, option => option.value))}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(filteredResponse(), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}