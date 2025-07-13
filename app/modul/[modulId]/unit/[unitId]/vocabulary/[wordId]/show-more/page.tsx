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
  const [wordid, setWordId] = useState<string | null>(null);
  const [vocab, setVocab] = useState<VocabData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!wordid) return;
      try {
        const response = await fetch(`/api/show-more?wordid=${wordid}`);

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
  }, [wordid]);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setWordId(resolvedParams.wordId);
    };
    unwrapParams();
  }, [params]);
  return (
    <div>
      ShowMore {wordid}
      <div>
         {vocab.length > 0 ? vocab[0].wordeng : 'Yuklanmoqda...'}
      </div>
    </div>
  )
}

export default ShowMore