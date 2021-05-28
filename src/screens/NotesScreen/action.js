import {ADD_NOTE_ACTION, UPDATE_NOTE_ACTION, DELETE_NOTE_ACTION} from './types';

export const addNoteAction = data => ({
  type: ADD_NOTE_ACTION,
  payload: data,
});

export const updateNoteAction = data => ({
  type: UPDATE_NOTE_ACTION,
  payload: data,
});

export const deleteNoteAction = data => ({
  type: DELETE_NOTE_ACTION,
  payload: data,
});
