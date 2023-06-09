import React from 'react';
import { createRoot } from 'react-dom/client';
import Assignment from './Assignment';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Assignment />);
