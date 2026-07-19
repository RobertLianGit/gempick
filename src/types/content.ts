export type Track = {
  id: string;
  title: string;
  titleEn?: string;
  albumId: string;
  albumTitle: string;
  releaseYear: number;
  language: string[];
  summary: string;
  albumIntroduction: string;
  label?: string;
  version?: string;
  sourceUrls: string[];
};

export type Album = {
  id: string;
  title: string;
  titleEn?: string;
  releaseType: string;
  releaseDate: string;
  releaseYear: number;
  introduction: string;
  label?: string;
  trackIds: string[];
  sourceUrls: string[];
};
