import { forceFloat } from './utils';

/**
 * Assessment.js
 *
 * Here's an example assessment configuration for a quiz graph:
 *
 * Columns:
 *    Name, Value, Feedback (fulfilled), feedback (unfulfilled), score
 *
 * [
 *   ['line1label', 'Demand', 'Correct!', 'Sorry, try again', 1],
 *   ['line1label', 'Alternative solution', 'Correct!', 'Sorry, try again', 0.9],
 *   ['line1slope', 'increase', 'Correct!', 'Sorry, try again', 1],
 *   ['line1intercept', 'any', 'Are you sure you\'re moving the right line?'],
 *   ['line2intercept', 'decrease', 'Correct!', 'Sorry, try again', 1]
 * ]
 *
 * Given this data, if a student fills out Line 1's label with
 * "Demand" and submits the quiz, they get 1 point. If they fill in
 * Line 1's label with "Alternative solution", they get 0.9 of a
 * point. The system iterates through all the rules and sums the
 * scores for all the rules that are fulfilled.
 *
 * If the student drags Line 1, they get the message "Are you sure
 * you're moving the right line?" There is no score associated with
 * this action - it's only meant for feedback.
 *
 * To facilitate situations where multiple criteria are needed to
 * achieve the correct solution, the instructor checks a box on the
 * graph that tells the system to require all rows of the data to be
 * fulfilled instead of any of them.
 */

export default class Assessment {
    constructor(assessment=[]) {
        this.assessment = assessment;

        this.totalScore = 0;
        const me = this;
        this.assessment.forEach(function(rule) {
            let row = rule;
            // Allow assessment rules to be passed in as either an
            // object or a plain array. This adds some flexibility.
            if (!('score' in row)) {
                row = me.extractRow(rule);
            }
            me.totalScore += forceFloat(row.score);
        });
    }

    /**
     * Given an action, return its type.
     *
     * Right now, there are two different action types. I'm
     * classifying them as 'label' and 'movement'.
     *
     * To evaluate a label action, the user's input is
     * fuzzy-matched with the correct answer (case-insensitive,
     * whitespace ignored).
     *
     * A movement action can be a slope change or a y-intercept
     * change. From the user's perspective, this is a slider
     * movement or a line drag. The new value is compared with the
     * original value. The assessment system then finds out
     * whether this was in 'increase', 'decrease', or 'any' for
     * any value change.
     *
     * We can assume that any action whose name ends in 'label' is a
     * label action. For now, everything else is considered a
     * movement.
     */
    getActionType(action) {
        if (action.name.endsWith('label')) {
            return 'label';
        } else {
            return 'movement';
        }
    }

    /**
     * Extract a row (array) into an object.
     */
    extractRow(row) {
        return {
            name: row[0],
            value: row[1],
            feedback_fulfilled: row[2],
            feedback_unfulfilled: row[3],
            score: row[4]
        };
    }

    /**
     * Remove case and whitespace from text.
     *
     * Used for fuzzy-matching labels and attribute names.
     */
    stripText(s) {
        if (!s) {
            return s;
        }
        return s.toLowerCase().replace(/ /g, '');
    }

    evalActionWithType(assessment, userAction, actionType) {
        if (actionType === 'label') {
            return this.stripText(assessment.value) ===
                this.stripText(userAction.value);
        } else if (actionType === 'movement') {
            return assessment.value === userAction.value ||
                // If the AssessmentRule is 'any', then any non-null
                // value is valid.
                (!!userAction.value && assessment.value === 'any');

        } else {
            return assessment.value === userAction.value;
        }
    }

    /**
     * Evaluate an action. This function takes an Action and returns a
     * Response.
     *
     * An Action consists of a name and a value.
     *
     * A Response is textual feedback and a numerical score, and a
     * "fulfilled" boolean.
     */
    evalAction(action) {
        for (let i = 0; i < this.assessment.length; i++) {
            let row = {};
            if (Array.isArray(this.assessment[i])) {
                row = this.extractRow(this.assessment[i]);
            } else {
                row = this.assessment[i];
            }

            // Skip this row if it's empty for some reason.
            if (!row) {
                continue;
            }

            if (this.stripText(row.name) === this.stripText(action.name)) {
                if (this.evalActionWithType(row, action, this.getActionType(row))) {
                    // Avoid divide-by-zero error. Just fall back to a
                    // result of 0.
                    let normalizedScore = 0;
                    if (this.totalScore !== 0) {
                        normalizedScore = forceFloat(
                            row.score / this.totalScore);
                    }

                    // Action fulfilled
                    return {
                        feedback: row.feedback_fulfilled,
                        score: normalizedScore,
                        fulfilled: true
                    };
                } else {
                    // Action unfulfilled
                    return {
                        feedback: row.feedback_unfulfilled,
                        score: 0,
                        fulfilled: false
                    };
                }
            }
        }

        return null;
    }

    /**
     * Translate a key value from the React state representation to
     * my slightly-more-friendly assessment language.
     *
     * We'll be looking at React properties and tying them to the
     * instructor-provided case-insensitive assessment rule strings:
     *
     * gLine1OffsetY    -> line1intercept
     * gLine1Label      -> line1label
     * gLine1Slope      -> line1slope
     *
     * I want to change OffsetY to Intercept in the backend anyways
     * since that's a better way to describe this value.
     */
    translateKey(key) {
        if (!key) {
            return key;
        }
        return key
            .replace(/^g/, '')
            .replace(/OffsetY$/, 'intercept')
            .toLowerCase();
    }

    /**
     * Translate a line movement from graph state to an assessment
     * rule string.
     *
     * Given an initial value and a current value, returns 'up',
     * 'down', or null if there was no change.
     */
    translateMovement(initialVal, currentVal) {
        if (initialVal < currentVal) {
            return 'up';
        } else if (initialVal > currentVal) {
            return 'down';
        }
        return null;
    }

    translateSlopeChange(initialVal, currentVal) {
        if (initialVal < currentVal) {
            return 'increase';
        } else if (initialVal > currentVal) {
            return 'decrease';
        }
        return null;
    }

    /**
     * Assess the given state.
     *
     * Returns an array of the form: [{
     *     feedback: <string>,
     *     score: <number>
     * }, ...]
     *
     * This method does the work of determinining whether the user
     * moved lines up or down, based on their current vs initial
     * values.
     *
     * Returns an array of Responses.
     */
    evalState(state) {
        let responses = [];
        let r = null;

        for (let key in state) {
            if (key.endsWith('OffsetY')) {
                // Evaluate shifts
                r = this.evalAction({
                    name: this.translateKey(key),
                    value: this.translateMovement(
                        state[`${key}Initial`], state[key])
                });
                if (r) {
                    responses.push(r);
                }
            } else if (key.endsWith('Slope')) {
                // Evaluate rotations
                r = this.evalAction({
                    name: this.translateKey(key),
                    value: this.translateSlopeChange(
                        state[`${key}Initial`], state[key])
                });
                if (r) {
                    responses.push(r);
                }
            } else if (key.endsWith('Label')) {
                // Evaluate labels
                r = this.evalAction({
                    name: this.translateKey(key),
                    value: state[key]
                });

                if (r) {
                    responses.push(r);
                }
            }
        }

        return responses;
    }
}
