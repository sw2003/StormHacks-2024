'use client';

import { Input, Button } from '@nextui-org/react';
import { useState } from 'react';

export default function YouTubePage() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!youtubeLink) {
      setError('Please provide a valid YouTube URL.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId: youtubeLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error fetching transcript or video information.');
    } finally {
      setLoading(false);
    }
    // Log the returned data to inspect the values
    console.log('Data returned:', data);
  };

  const handleDelete = () => {
    setYoutubeLink('');
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gray-900 text-white">
      <div className="w-full max-w-lg">
        <Input
          fullWidth
          type="url"
          label="YouTube Link"
          placeholder="Please enter the URL"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          className="text-lg px-4 py-3"
        />
      </div>

      <div className="flex gap-6">
        <Button
          color="primary"
          variant="ghost"
          onClick={handleDelete}
          className="text-xl px-6 py-3"
        >
          Delete
        </Button>
        <Button
          color="primary"
          variant="ghost"
          onClick={handleSubmit}
          className="text-xl px-6 py-3"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {result && (
        <div className="mt-8">
          <h3 className="text-2xl">Video Duration: {result.duration}</h3>
          <h4 className="text-xl mt-4">Transcript:</h4>
          <p className="whitespace-pre-line mt-2">{result.plainTextTranscript}</p>
        </div>
      )}
    </div>
  );
}
