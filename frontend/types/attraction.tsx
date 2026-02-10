export interface Attraction {
  id: string;
  name: string;
  parentTypeLabel: string;
  typeLabel: string;
  latitude: number;
  longtitude: number;
  image_path: string[];
  wikipedia: string;
  summary: string;
  county: string;
  region: string;
  country: string;
}
