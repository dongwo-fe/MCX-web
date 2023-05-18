import { configureStore } from '@reduxjs/toolkit';
import editor from './editor';

export default configureStore({
    reducer: {
        editor,
    },
});
