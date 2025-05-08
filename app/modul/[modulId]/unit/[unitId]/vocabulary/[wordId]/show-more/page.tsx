'use client'

import React, { useEffect, useState } from 'react'

interface PageProps {
  params: Promise<{
    wordId: string;
  }>;
}
type VocabData = {
  wordeng: string;
};

const ShowMore = ({ params }: PageProps) => {
  const [wordId, setWordId] = useState<string | null>(null);
  const [vocab, setVocab] = useState<VocabData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!wordId) return;
      try {
        const response = await fetch(`/api/show-more?wordId=${wordId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        setVocab(data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchData();
  }, [wordId]);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setWordId(resolvedParams.wordId);
    };
    unwrapParams();
  }, [params]);
  return (
    <div>
      ShowMore {wordId}
      <div>
        {vocab.map((e) => (
          e.wordeng
        ))}
      </div>
    </div>
  )
}

export default ShowMore