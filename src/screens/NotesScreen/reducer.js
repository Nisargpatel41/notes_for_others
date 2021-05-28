import {ADD_NOTE_ACTION, UPDATE_NOTE_ACTION, DELETE_NOTE_ACTION} from './types';
import {arrayIfKeySame} from '../../lib/helper';

import createReducer from '../../lib/createReducer';

let initialState = {
  notes: [],
};

export const notesReducer = createReducer(initialState, {
  //ADD PENDING NOTE
  [ADD_NOTE_ACTION](state, action) {
    let tempArray = state.notes;
    tempArray.push(action.payload);

    let updatedNotes = arrayIfKeySame(tempArray, note => note._id);

    return Object.assign({}, state, {
      notes: updatedNotes,
    });
  },

  //UPDATE PENDING NOTE
  [UPDATE_NOTE_ACTION](state, action) {
    let tempArray = [...state.notes];
    let thisNoteIndex = tempArray.findIndex(
      note => note._id === action.payload._id,
    );
    tempArray[thisNoteIndex] = action.payload;
    let updatedNotes = arrayIfKeySame(tempArray, note => note._id);

    return Object.assign({}, state, {
      notes: updatedNotes,
    });
  },

  //DELETE PENDING NOTE
  [DELETE_NOTE_ACTION](state, action) {
    let tempArray = [...state.notes];
    let thisNoteIndex = tempArray.findIndex(
      note => note._id === action.payload._id,
    );
    tempArray.splice(thisNoteIndex, 1);
    return Object.assign({}, state, {
      notes: tempArray,
    });
  },
});
