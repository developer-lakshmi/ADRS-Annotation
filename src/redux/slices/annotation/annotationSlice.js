import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coco: null,
  visibleCategories: [1, 2, 3, 4], // All categories ON by default
  selectedCategoryId: null,
};

const annotationSlice = createSlice({
    name: "annotation",
    initialState,
    reducers: {
        setImageAnnotation: (state, action) => {
          const { fileName, annotation } = action.payload;
          state[fileName] = annotation;
        },
        clearImageAnnotation: (state, action) => {
            delete state[action.payload];
        },
        toggleCategory: (state, action) => {
          if (!state.visibleCategories) state.visibleCategories = [1, 2, 3, 4];
          const id = action.payload;
          if (state.visibleCategories.includes(id)) {
            state.visibleCategories = state.visibleCategories.filter(cid => cid !== id);
          } else {
            state.visibleCategories.push(id);
          }
        },
        updateAnnotation: (state, action) => {
          const { id, ...updates } = action.payload;
          const ann = state.coco.annotations.find(a => a.id === id);
          if (ann) Object.assign(ann, updates);
        },
        setSelectedCategory: (state, action) => {
          state.selectedCategoryId = action.payload;
        },
    }
});

export const { setImageAnnotation, clearImageAnnotation, toggleCategory, updateAnnotation, setSelectedCategory } = annotationSlice.actions;
export default annotationSlice.reducer;