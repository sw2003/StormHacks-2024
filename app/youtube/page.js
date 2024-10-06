'use client';

import { Input, Button } from '@nextui-org/react';
import { useState } from 'react';

export default function YouTubePage() {
  const [youtubeLink, setYoutubeLink] = useState('');

  const handleSubmit = () => {
    if (youtubeLink) {
      console.log('Submitted YouTube link:', youtubeLink);
    }
  };

  const handleDelete = () => {
    setYoutubeLink('');
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
        >
          Submit
        </Button>
      </div>

     
    </div>
  );
}
