export interface Bike {
  id: number;
  title: string;
  serial: string;
  manufacturer_name: string;
  frame_model: string;
  year: number;
  frame_colors: string[];
  thumb: string;
  large_img: string;
  status: string;
  stolen: boolean;
  stolen_location: string;
  date_stolen: number;
  description: string;
  location_found?: string;
  external_id?: number;
  registry_name?: string;
  registry_url?: string;
  stolen_coordinates?: [number, number];
  url: string;
  api_url: string;
}

export interface BikeSearchResponse {
  bikes: Bike[];
}
