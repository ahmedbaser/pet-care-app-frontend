import { configureStore,AnyAction  } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '@reduxjs/toolkit';
import authReducer, { restoreSession } from './slices/authSlice';
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import actionsReducer from './slices/actionsSlice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    action: actionsReducer,
    post: postReducer,
    user: userReducer,
  },
});



store.dispatch(restoreSession());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export default store;

