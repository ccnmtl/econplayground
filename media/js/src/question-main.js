import React from 'react';
import { createRoot } from 'react-dom/client';
import QuestionEditor from './QuestionEditor';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<QuestionEditor />);
