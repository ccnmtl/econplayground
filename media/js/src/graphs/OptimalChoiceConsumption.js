import {Graph, invisiblePointOptions} from './Graph.js';

export const untoggledDefaults = {
    gA1: 5,
    gA2: 10,
    gA3: 2500,
    gLine1Label: 'U*',
    gLine2Label: 'IBL',
    gIntersectionLabel: 'Optimal Bundle',
    gXAxisMax: 1000,
    gYAxisMax: 1000
};

export const defaults = [
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 1,
        gA5: 1
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 0.5
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 0.5
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 0.5
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 5,
        gA5: 1
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 1,
        gA5: 1
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 50,
        gA5: 1
    }
];

/**
 * Derives the y-value for the 'Budget Line' at a given x-value.
 * @param {number} x - The 'Budget Line' x-value.
 * @returns The corresponding y-value for the 'Budget Line'.
 */
const f0 = function(x, R, px, py) {
    // y_1 = (R-px*x_1)/py
    const result = (R - (px * x)) / py;

    if (result < 0) {
        return NaN;
    }

    return result;
};

const nStar = function(nu, pn, R, alpha, beta) {
    return nu / (alpha + beta) * R / pn;
};

const u1f1 = function(x, px, py, R, alpha, beta) {
    const xStar = nStar(alpha, px, R, alpha, beta);
    const yStar = nStar(beta, py, R, alpha, beta);
    const UStar = (xStar ** alpha) * (yStar ** beta);

    // y_2 = (U_star/x^alpha)^(1/beta)
    return (UStar / (x ** alpha)) ** (1 / beta);
};

// See doc/optimal_consumption.nb for solutions steps for this
// equation.
const u2f1 = function(x, px, py, R, alpha) {
    return (
        - (
            (
                (x ** (-alpha)) *
                    (((R * alpha) / px) ** alpha) *
                    ((-R) + R * alpha) *
                    (- (((-R) + R * alpha) / py)) ** (-alpha)
            ) / py
        )
    ) ** (1 / (1 - alpha));
};

// See doc/optimal_consumption.nb for solutions steps for this
// equation.
const u3f1 = function(x, px, py, R, rho) {
    return (
        (
            (
                px ** (1 / (-1 + rho)) * R
            ) / (
                px ** (rho / (-1 + rho)) +
                    py ** (rho / (-1 + rho))
            )
        ) ** rho + (
            (
                py ** (1 / (-1 + rho)) * R
            ) / (
                px ** (rho / (-1 + rho)) +
                    py ** (rho / (-1 + rho))
            )
        ) ** rho
        - x ** rho
    ) ** (1 / rho);
};

// See doc/optimal_consumption.nb for solutions steps for this
// equation.
const u4f1 = function(x, px, py, R, delta) {
    return (
        (
            (
                (
                    (
                        R / (
                            px * (px / py) ** (1 / (-1 + delta)) +
                                py
                        )
                    ) ** delta
                ) / delta
            ) + (
                (
                    (
                        R / (
                            px + py *  (px / py) ** (1 - (-1 + delta))
                        )
                    ) ** delta
                ) / delta
            ) - (
                (x ** delta) / delta
            )
        ) * delta
    ) ** (1 / delta);
};

const u5f1 = function(x, px, py, R) {
    return (R ** 2) / (4 * px * py * x);
};

const u6f1 = function(x, px, py, R, a, b) {
    let rpxStar = 0;
    if (b * px < a * py) {
        rpxStar = R / px;
    }
    let rpyStar = 0;
    if (a * py < b * px) {
        rpyStar = R / py;
    }

    return (
        -a * x + a * rpxStar + b * rpyStar
    ) / b;
};

const xstarvalue7 = function(px, py, R, a, b) {
    return R / (px + (a / b) * py);
};

const ystarvalue7 = function(px, py, R, a, b) {
    return R / ((b / a) * px + py);
};

const u7f1 = function(x, px, py, R, a, b) {
    const xStar = xstarvalue7(px, py, R, a, b);
    const yStar = ystarvalue7(px, py, R, a, b);

    if (x < xStar) {
        return NaN;
    } else {
        return yStar;
    }
};

const u8f1 = function(x, px, py, R, a, b) {
    let apyStar = 0;
    if (0 < (R / px)) {
        apyStar = (a * py) / px;
    }

    let napyStar = 0;
    if (R > py) {
        napyStar = (-a * py + R) / py;
    }

    return (
        -a * Math.log(x) + a * Math.log(apyStar) + b * napyStar
    ) / b;
};

export class OptimalChoiceConsumptionGraph extends Graph {
    /**
     * This graph displays the function:
     *
     * Line 1: y_1 = (R-px*x_1)/py
     *
     * Line 2: y_2 = (U_star/x^alpha)^(1/beta)
     * Where:
     *   U_star = U(x, y) = x_star^alpha * y_star^beta
     *   x_star = (alpha/(alpha+beta)) * R/px
     *   y_star = (beta/(alpha+beta)) * R/py
     *
     * px -> gA1
     * py -> gA2
     * R -> gA3
     * alpha -> gA4
     * beta -> gA5
     */
    make() {
        const me = this;

        const iblLine = function(x) {
            return f0(x, me.options.gA3, me.options.gA1, me.options.gA2);
        };

        this.l2 = this.board.create('functiongraph', [iblLine, 0, 1000], {
            name: this.options.gLine2Label,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            label: {
                strokeColor: this.l2Color
            },
            fixed: true,
            highlight: false
        });

        if (this.options.gToggle) {
            let uStarLine = function() {};

            if (this.options.gFunctionChoice === 0) {
                uStarLine = function(x) {
                    return u1f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            } else if (this.options.gFunctionChoice === 1) {
                uStarLine = function(x) {
                    return u2f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4);
                };
            } else if (this.options.gFunctionChoice === 2) {
                uStarLine = function(x) {
                    return u3f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4);
                };
            } else if (this.options.gFunctionChoice === 3) {
                uStarLine = function(x) {
                    return u4f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4);
                };
            } else if (this.options.gFunctionChoice === 4) {
                uStarLine = function(x) {
                    return u5f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3);
                };
            } else if (this.options.gFunctionChoice === 5) {
                uStarLine = function(x) {
                    return u6f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            } else if (this.options.gFunctionChoice === 6) {
                uStarLine = function(x) {
                    return u7f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            } else if (this.options.gFunctionChoice === 7) {
                uStarLine = function(x) {
                    return u8f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            }

            this.l1 = this.board.create('functiongraph', [uStarLine, 0, 1000], {
                name: this.options.gLine1Label,
                withLabel: true,
                strokeWidth: 2,
                strokeColor: this.l1Color,
                label: {
                    strokeColor: this.l1Color
                },
                fixed: true,
                highlight: false
            });
        }

        if (this.options.gShowIntersection && this.options.gToggle) {
            const p1 = this.board.create(
                'point', [
                    nStar(
                        this.options.gA4, this.options.gA1,
                        this.options.gA3, this.options.gA4,
                        this.options.gA5),
                    0
                ],
                invisiblePointOptions);

            const p2 = this.board.create(
                'point', [
                    0,
                    nStar(
                        this.options.gA5, this.options.gA2,
                        this.options.gA3, this.options.gA4,
                        this.options.gA5)
                ],
                invisiblePointOptions);

            // Make this line invisible - it's actually rendered from
            // this.showIntersection().
            const l2 = this.board.create('line', [p2, [p1.X(), p2.Y()]], {
                withLabel: false,
                straightFirst: false,
                straightLast: false,
                dash: 1,
                highlight: false,
                visible: false,
                strokeWidth: 0
            });

            this.intersection = this.showIntersection(
                this.l1, l2, false, this.options.gIntersectionLabel);
        }
    }
}

export const mkOptimalChoiceConsumption = function(board, options) {
    let g = new OptimalChoiceConsumptionGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
