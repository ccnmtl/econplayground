/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import GraphEditor from './GraphEditor';

it('renders without crashing', () => {
    TestRenderer.create(
        <GraphEditor
            gType={0}
            gAssignmentType={0}
            gTitle={'title'}
            gSummary={'summary'}
            gInstructions={'instructions'}
            showing={true}
            updateDisplayIntersection={function() {}}
            updateGraph={function() {}}
            gInstructorNotes={'My notes'}
            gDisplayShadow={true}
            gDisplayFeedback={false}
            gIsPublished={true}
            gIsFeatured={true}
            gNeedsSubmit={false}
            gShowIntersection={true}
            gDisplayIntersection1={true}
            gDisplayIntersection2={false}
            gDisplayIntersection3={false}
            gLine1Label={''}
            gLine2Label={''}
            gLine3Label={''}
            gXAxisLabel={'X'}
            gYAxisLabel={'Y'}
            gLine1Slope={-1}
            gLine2Slope={1}
            gLine3Slope={1}
            gLine1OffsetX={0}
            gLine1OffsetY={0}
            gLine2OffsetX={0}
            gLine2OffsetY={0}
            gLine3OffsetX={0}
            gLine3OffsetY={0}
            gLine1Dashed={false}
            gLine2Dashed={false}
            gLine3Dashed={false}
            gIntersectionHorizLineLabel={''}
            gIntersectionVertLineLabel={''}
            gIntersection2HorizLineLabel={''}
            gIntersection2VertLineLabel={''}
            gIntersection3HorizLineLabel={''}
            gIntersection3VertLineLabel={''}
            gIntersectionLabel={''}
            gIntersection2Label={''}
            gIntersection3Label={''}
            saveGraph={function() {}}
            saveAndViewGraph={function() {}} />
    );
});
