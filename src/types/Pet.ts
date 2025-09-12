// Tipos base para mascotas (genérico)
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

// Tipos específicos para perros (extendiendo Pet)
export interface DogInfo extends Pet {
  species: 'dog';
  updated_at: string;
  age_years: number;
  age_months: number;
  age_days: number;
  dog_years: number;
}

// Tipos médicos para perros
export interface Vaccine {
  id: number;
  dog_id: number;
  vaccine_name: string;
  vaccine_date: string;
  next_due_date: string | null;
  veterinarian: string;
  notes: string;
  created_at: string;
}

export interface WeightRecord {
  id: number;
  dog_id: number;
  weight_kg: number;
  measurement_date: string;
  notes: string;
  created_at: string;
}

export interface DogPortfolio {
  dog_info: DogInfo;
  vaccines: Vaccine[];
  weight_history: WeightRecord[];
}

// Constante inicial para formularios
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