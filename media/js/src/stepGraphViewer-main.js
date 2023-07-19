import React from 'react';
import { createRoot } from 'react-dom/client';
import StepGraphViewer from './StepGraphViewer.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<StepGraphViewer />);
