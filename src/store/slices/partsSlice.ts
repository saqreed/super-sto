import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Part } from '../../types';

interface PartsState {
  parts: Part[];
  filteredParts: Part[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
}

const initialState: PartsState = {
  parts: [],
  filteredParts: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  selectedBrand: '',
};

const mockParts: Part[] = [
  {
    id: '1',
    name: 'Масляный фильтр',
    description: 'Оригинальный масляный фильтр для двигателя',
    price: 850,
    brand: 'Bosch',
    model: 'F026407006',
    article: 'F026407006',
    category: 'Фильтры',
    images: ['/images/oil-filter.jpg'],
    inStock: true,
    quantity: 25,
  },
  {
    id: '2',
    name: 'Тормозные колодки передние',
    description: 'Керамические тормозные колодки',
    price: 3200,
    brand: 'Brembo',
    model: 'P85020',
    article: 'P85020',
    category: 'Тормозная система',
    images: ['/images/brake-pads.jpg'],
    inStock: true,
    quantity: 12,
  },
  {
    id: '3',
    name: 'Свечи зажигания',
    description: 'Иридиевые свечи зажигания (комплект 4 шт)',
    price: 2400,
    brand: 'NGK',
    model: 'ILFR6A',
    article: 'ILFR6A',
    category: 'Система зажигания',
    images: ['/images/spark-plugs.jpg'],
    inStock: true,
    quantity: 8,
  },
  {
    id: '4',
    name: 'Воздушный фильтр',
    description: 'Воздушный фильтр двигателя',
    price: 650,
    brand: 'Mann',
    model: 'C25114',
    article: 'C25114',
    category: 'Фильтры',
    images: ['/images/air-filter.jpg'],
    inStock: false,
    quantity: 0,
  },
];

export const fetchParts = createAsyncThunk(
  'parts/fetchParts',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockParts;
  }
);

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
      state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.selectedBrand = '';
      state.filteredParts = state.parts;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
        state.filteredParts = action.payload;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки деталей';
      });
  },
});

const filterParts = (parts: Part[], searchQuery: string, category: string, brand: string) => {
  return parts.filter(part => {
    const matchesSearch = !searchQuery || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !category || part.category === category;
    const matchesBrand = !brand || part.brand === brand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });
};

export const { setSearchQuery, setSelectedCategory, setSelectedBrand, clearFilters } = partsSlice.actions;
export default partsSlice.reducer; 