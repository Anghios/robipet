export interface Pet {
  id: number;
  name: string;
  breed: string;
  birth_date: string;
  color: string;
  microchip?: string;
  weight_kg: number;
  species: 'dog' | 'cat' | 'bird' | 'other';
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  neutered: boolean | number;
  photo_url?: string;
  created_at: string;
}

export interface NewPet {
  name: string;
  breed: string;
  birth_date: string;
  color: string;
  microchip: string;
  weight_kg: string;
  species: Pet['species'];
  gender: Pet['gender'];
  size: Pet['size'];
  neutered: boolean;
  photo_url: string;
}

export const INITIAL_PET_STATE: NewPet = {
  name: '',
  breed: '',
  birth_date: '',
  color: '',
  microchip: '',
  weight_kg: '',
  species: 'dog',
  gender: 'male',
  size: 'medium',
  neutered: false,
  photo_url: ''
};