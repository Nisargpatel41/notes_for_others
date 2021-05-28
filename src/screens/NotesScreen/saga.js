// import {put, takeLatest, call} from 'redux-saga/effects';
// import {
//   addNoteApi,
//   getNotesApi,
//   updateNoteApi,
//   archiveNoteApi,
//   deleteNoteApi,
// } from './api';
// import {
//   GET_NOTES_ACTION,
//   GET_NOTES_SUCCESS,
//   GET_NOTES_ERROR,
//   GET_NOTES_LOADING,
//   ADD_NOTE_ACTION,
//   ADD_NOTE_SUCCESS,
//   ADD_NOTE_ERROR,
//   ADD_NOTE_LOADING,
//   ADD_PENDING_NOTE,
//   UPDATE_NOTE_ACTION,
//   UPDATE_NOTE_SUCCESS,
//   UPDATE_NOTE_ERROR,
//   UPDATE_NOTE_LOADING,
//   UPDATE_PENDING_NOTE,
//   ARCHIVE_NOTE_ACTION,
//   ARCHIVE_NOTE_SUCCESS,
//   ARCHIVE_NOTE_ERROR,
//   ARCHIVE_NOTE_LOADING,
//   ARCHIVE_PENDING_NOTE,
//   DELETE_NOTE_ACTION,
//   DELETE_NOTE_SUCCESS,
//   DELETE_NOTE_ERROR,
//   DELETE_NOTE_LOADING,
//   DELETE_PENDING_NOTE,
//   CALL_PENDING_SUBMITS_ACTION,
//   CALL_PENDING_SUBMITS_ERROR,
//   CALL_PENDING_SUBMITS_LOADING,
//   CALL_PENDING_SUBMITS_SUCCESS,
//   CLEAR_ERROR,
// } from './types';
// import {delay, isConnected, UUID} from '../../lib/helper';
// import moment from 'moment';

// function* getNotesSaga() {
//   let connected = yield call(isConnected);
//   if (connected) {
//     try {
//       yield put({type: GET_NOTES_LOADING, payload: true});
//       let res = yield call(getNotesApi);
//       if (res.status === 200) {
//         yield put({type: GET_NOTES_SUCCESS, payload: res.result});
//       } else {
//         yield put({type: GET_NOTES_ERROR, payload: res.message});
//       }
//     } catch (error) {
//       yield put({type: GET_NOTES_ERROR, payload: error.toString()});
//     }
//   }
//   yield put({type: CLEAR_ERROR});
// }

// function* addNoteSaga(data) {
//   let connected = yield call(isConnected);
//   if (connected) {
//     try {
//       yield put({type: ADD_NOTE_LOADING, payload: true});
//       let res = yield call(addNoteApi, data.payload);
//       if (res.status === 200) {
//         yield put({type: ADD_NOTE_SUCCESS, payload: res.message});
//       } else {
//         yield put({type: ADD_NOTE_ERROR, payload: res.message});
//       }
//     } catch (error) {
//       yield put({type: ADD_NOTE_ERROR, payload: error.toString()});
//     }
//   } else {
//     data.payload['_id'] = UUID();
//     yield put({type: ADD_PENDING_NOTE, payload: data.payload});
//     yield put({type: ADD_NOTE_SUCCESS, payload: 'Note added successfully'});
//   }
//   yield call(delay);
//   yield put({type: CLEAR_ERROR});
// }

// function* updateNoteSaga(data) {
//   let connected = yield call(isConnected);
//   if (connected) {
//     try {
//       yield put({type: UPDATE_NOTE_LOADING, payload: true});
//       let res = yield call(updateNoteApi, data.payload);
//       if (res.status === 200) {
//         yield put({type: UPDATE_NOTE_SUCCESS, payload: res.message});
//       } else {
//         yield put({type: UPDATE_NOTE_ERROR, payload: res.message});
//       }
//     } catch (error) {
//       yield put({type: UPDATE_NOTE_ERROR, payload: error.toString()});
//     }
//   } else {
//     data.payload['_id'] = UUID();
//     yield put({type: UPDATE_PENDING_NOTE, payload: data.payload});
//     yield put({
//       type: UPDATE_NOTE_SUCCESS,
//       payload: 'Note updated successfully',
//     });
//   }
//   yield call(delay);
//   yield put({type: CLEAR_ERROR});
// }

// function* archiveNoteSaga(data) {
//   let connected = yield call(isConnected);
//   data.payload['modifiedAt'] = moment().toISOString();
//   if (connected) {
//     try {
//       yield put({type: ARCHIVE_NOTE_LOADING, payload: true});
//       let res = yield call(archiveNoteApi, data.payload);
//       if (res.status === 200) {
//         yield put({type: ARCHIVE_NOTE_SUCCESS, payload: res.message});
//       } else {
//         yield put({type: ARCHIVE_NOTE_ERROR, payload: res.message});
//       }
//     } catch (error) {
//       yield put({type: ARCHIVE_NOTE_ERROR, payload: error.toString()});
//     }
//   } else {
//     yield put({type: ARCHIVE_PENDING_NOTE, payload: data.payload});
//     yield put({
//       type: ARCHIVE_NOTE_SUCCESS,
//       payload: 'Note archived successfully',
//     });
//   }
//   yield call(delay);
//   yield put({type: CLEAR_ERROR});
// }

// function* deleteNoteSaga(data) {
//   let connected = yield call(isConnected);
//   if (connected) {
//     try {
//       yield put({type: DELETE_NOTE_LOADING, payload: true});
//       let res = yield call(deleteNoteApi, data.payload);
//       if (res.status === 200) {
//         yield put({type: DELETE_NOTE_SUCCESS, payload: res.message});
//       } else {
//         yield put({type: DELETE_NOTE_ERROR, payload: res.message});
//       }
//     } catch (error) {
//       yield put({type: DELETE_NOTE_ERROR, payload: error.toString()});
//     }
//   } else {
//     yield put({type: DELETE_PENDING_NOTE, payload: data.payload});
//     yield put({
//       type: DELETE_NOTE_SUCCESS,
//       payload: 'Note deleted successfully',
//     });
//   }
//   yield call(delay);
//   yield put({type: CLEAR_ERROR});
// }

// function* callPendingSubmitsSaga(data) {
//   let {
//     pendingAddNotes,
//     pendingUpdateNotes,
//     pendingArchiveNotes,
//     pendingDeleteNotes,
//   } = data.payload;
//   let connected = yield call(isConnected);
//   if (connected) {
//     try {
//       yield put({type: CALL_PENDING_SUBMITS_LOADING, payload: true});
//       if (pendingAddNotes && pendingAddNotes.length > 0) {
//         for (const note of pendingAddNotes) {
//           delete note['_id'];
//           yield call(addNoteSaga, {payload: note});
//         }
//       }

//       if (pendingUpdateNotes && pendingUpdateNotes.length > 0) {
//         for (const note of pendingUpdateNotes) {
//           delete note['_id'];
//           yield call(updateNoteSaga, {payload: note});
//         }
//       }
//       if (pendingArchiveNotes && pendingArchiveNotes.length > 0) {
//         for (const note of pendingArchiveNotes) {
//           yield call(archiveNoteSaga, {payload: note});
//         }
//       }

//       if (pendingDeleteNotes && pendingDeleteNotes.length > 0) {
//         for (const note of pendingDeleteNotes) {
//           yield call(deleteNoteSaga, {payload: note});
//         }
//       }
//       yield put({
//         type: CALL_PENDING_SUBMITS_SUCCESS,
//         payload: 'Notes Sync Successfully',
//       });
//     } catch (error) {
//       yield put({type: CALL_PENDING_SUBMITS_ERROR, payload: error.toString()});
//     }
//   }
//   yield put({type: CLEAR_ERROR});
// }

// function* watchNotesSaga() {
//   yield takeLatest(GET_NOTES_ACTION, getNotesSaga);
//   yield takeLatest(ADD_NOTE_ACTION, addNoteSaga);
//   yield takeLatest(UPDATE_NOTE_ACTION, updateNoteSaga);
//   yield takeLatest(ARCHIVE_NOTE_ACTION, archiveNoteSaga);
//   yield takeLatest(DELETE_NOTE_ACTION, deleteNoteSaga);
//   yield takeLatest(CALL_PENDING_SUBMITS_ACTION, callPendingSubmitsSaga);
// }
// export default watchNotesSaga;
