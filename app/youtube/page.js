'use client';

import { Input, Button, Spinner } from '@nextui-org/react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../components/styles.module.css';
import { Providers } from '../provider';

export default function YouTubePage() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!youtubeLink) {
      setError('Please provide a valid YouTube URL.');
      return;
    }

    setLoading(true);
    setError('');
    setMarkdown('');
    setTranscript(null);

    try {
      // First API call to fetch transcript
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId: youtubeLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }

      const data = await response.json();

      const markdownResponse = await fetch('/api/anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: data.plainTextTranscript, language: 'English' }),
      });

      if (!markdownResponse.ok) {
        throw new Error('Failed to process transcript into Markdown');
      }

      const markdownData = await markdownResponse.text(); // Assuming the API returns plain text Markdown
      setMarkdown(markdownData);
    } catch (err) {
      console.error(err);
      setError('Error fetching or processing transcript.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setYoutubeLink('');
    setTranscript(null);
    setMarkdown('');
    setError('');
  };

  return (
    <Providers>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
        <div className="w-full max-w-lg">
          <Input
            fullWidth
            type="url"
            label="YouTube Link"
            placeholder="Please enter the YouTube video URL"
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
            {loading ? <Spinner size="sm" /> : 'Submit'}
          </Button>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        {transcript && (
          <div className="mt-8 w-full max-w-lg">
            <h3 className="text-2xl">Video Duration: {transcript.duration}</h3>
            <h4 className="text-xl mt-4">Transcript:</h4>
            <p className="whitespace-pre-line mt-2">{transcript}</p>
          </div>
        )}

        {markdown && (
          <div className="mt-8 w-full max-w-lg">
            <div className={`${styles.markdown}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </Providers>
  );
}
