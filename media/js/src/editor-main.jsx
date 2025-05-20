import React from 'react';
import { createRoot } from 'react-dom/client';
import Editor from './Editor.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Editor />);
