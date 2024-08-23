import {Graph, positiveRange} from './Graph.js';

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
        gA5: 1,
        gXAxisMax: 1000,
        gYAxisMax: 1000
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 0.5,
        gXAxisMax: 1000,
        gYAxisMax: 1000
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 0.5,
        gXAxisMax: 500,
        gYAxisMax: 500
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 0.5,
        gXAxisMax: 500,
        gYAxisMax: 500
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gXAxisMax: 1000,
        gYAxisMax: 1000
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 5,
        gA5: 1,
        gXAxisMax: 1000,
        gYAxisMax: 1000
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 1,
        gA5: 1,
        gXAxisMax: 1000,
        gYAxisMax: 1000
    },
    {
        gA1: 5,
        gA2: 10,
        gA3: 2500,
        gA4: 50,
        gA5: 1,
        gXAxisMax: 1000,
        gYAxisMax: 1000
    }
];

/**
 * Derives the y-value for the 'Budget Line' at a given x-value.
 * @param {number} x - The 'Budget Line' x-value.
 * @returns The corresponding y-value for the 'Budget Line'.
 */
const f0 = function(x, px, py, R) {
    // y_1 = (R-px*x_1)/py
    return (R - (px * x)) / py;
};

const nStar = function(nu, pn, R, alpha, beta) {
    return nu / (alpha + beta) * R / pn;
};

const xstarvalue1 = function(px, py, R, alpha, beta) {
    return (alpha / (alpha + beta)) * (R / px);
};

const ystarvalue1 = function(px, py, R, alpha, beta) {
    return (beta / (alpha + beta)) * (R / py);
};

const u1f1 = function(x, px, py, R, alpha, beta) {
    const xStar = nStar(alpha, px, R, alpha, beta);
    const yStar = nStar(beta, py, R, alpha, beta);
    const UStar = (xStar ** alpha) * (yStar ** beta);

    // y_2 = (U_star/x^alpha)^(1/beta)
    return (UStar / (x ** alpha)) ** (1 / beta);
};

const xstarvalue2 = function(px, py, R, alpha, beta) {
    return (R * alpha) / px;
};

const ystarvalue2 = function(px, py, R, alpha, beta) {
    return -((-R + R * alpha) / py);
};

// See doc/optimal_consumption.nb for solutions steps for this
// equation.
const u2f1 = function(x, px, py, R, alpha) {
    return (
        - (
            (
                (x ** (-alpha)) *
                    (((R * alpha) / px) ** alpha) *
                    (-R + R * alpha) *
                    (- ((-R + R * alpha) / py)) ** (-alpha)
            ) / py
        )
    ) ** (1 / (1 - alpha));
};

const xstarvalue3 = function(px, py, R, rho) {
    return ((
        px ** (1 / (rho - 1))
    ) / (
        px ** (rho / (rho - 1)) + py ** (rho / (rho - 1))
    )) * R;
};

const ystarvalue3 = function(px, py, R, rho) {
    return ((
        py ** (1 / (rho - 1))
    ) / (
        px ** (rho / (rho - 1)) + py ** (rho / (rho - 1))
    )) * R;
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

const xstarvalue4 = function(px, py, R, delta) {
    return R / (
        px + py * (py / px) ** (1 / (delta - 1))
    );
};

const ystarvalue4 = function(px, py, R, delta) {
    return R / (
        px * (px / py) ** (1 / (delta - 1)) + py
    );
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
                            px * (px / py) ** (1 / (-1 + delta)) + py
                        )
                    ) ** delta
                ) / delta
            ) + (
                (
                    (
                        R / (
                            px + py * (py / px) ** (1 / (-1 + delta))
                        )
                    ) ** delta
                ) / delta
            ) - (
                (x ** delta) / delta
            )
        ) * delta
    ) ** (1 / delta);
};

const xstarvalue5 = function(px, py, R) {
    return R / (2 * px);
};

const ystarvalue5 = function(px, py, R) {
    return R / (2 * py);
};

const u5f1 = function(x, px, py, R) {
    return (R ** 2) / (4 * px * py * x);
};

const xstarvalue6 = function(px, py, R, a, b) {
    if ((b * px) < (a * py)) {
        return R / px;
    }

    return 0;
};

const ystarvalue6 = function(px, py, R, a, b) {
    if ((a * py) < (b * px)) {
        return R / py;
    }

    return 0;
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

const xstarvalue8 = function(px, py, R, a, b) {
    if (0 < (R / px)) {
        return (a * py) / px;
    }

    return 0;
};

const ystarvalue8 = function(px, py, R, a, b) {
    if (R > py) {
        return (R / py) - a;
    }

    return 0;
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
export class OptimalChoiceConsumptionGraph extends Graph {
    static getRuleOptions() {
        return [
            {
                name: 'px value',
                value: 'a1'
            },
            {
                name: 'py value',
                value: 'a2'
            },
            {
                name: 'R value',
                value: 'a3'
            },
            {
                name: 'Variable 4 value',
                value: 'a4'
            },
            {
                name: 'Variable 5 value',
                value: 'a5'
            },
            {
                name: 'Orange line label',
                value: 'line_1_label'
            },
            {
                name: 'Blue line label',
                value: 'line_2_label'
            },
            {
                name: 'Optimal Bundle label',
                value: 'intersection_label'
            },
            {
                name: 'Intersection\'s horizontal line label',
                value: 'intersection_horiz_line_label'
            },
            {
                name: 'Intersection\'s vertical line label',
                value: 'intersection_vert_line_label'
            },
            {
                name: 'X-axis label',
                value: 'x_axis_label'
            },
            {
                name: 'Y-axis label',
                value: 'y_axis_label'
            }
        ];
    }

    make() {
        const me = this;

        let iblLine = function(x) {
            return f0(x, me.options.gA1, me.options.gA2, me.options.gA3);
        };

        let xStar = null;
        let yStar = null;

        if (this.options.gToggle) {
            let uStarLine = function() {};

            if (this.options.gFunctionChoice === 0) {
                xStar = xstarvalue1(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);
                yStar = ystarvalue1(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);

                uStarLine = function(x) {
                    return u1f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            } else if (this.options.gFunctionChoice === 1) {
                xStar = xstarvalue2(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);
                yStar = ystarvalue2(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);

                uStarLine = function(x) {
                    return u2f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4);
                };
            } else if (this.options.gFunctionChoice === 2) {
                xStar = xstarvalue3(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4);
                yStar = ystarvalue3(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4);

                uStarLine = function(x) {
                    return u3f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4);
                };
            } else if (this.options.gFunctionChoice === 3) {
                xStar = xstarvalue4(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4);
                yStar = ystarvalue4(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4);

                uStarLine = function(x) {
                    return u4f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4);
                };
            } else if (this.options.gFunctionChoice === 4) {
                xStar = xstarvalue5(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3);
                yStar = ystarvalue5(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3);

                uStarLine = function(x) {
                    return u5f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3);
                };
            } else if (this.options.gFunctionChoice === 5) {
                xStar = xstarvalue6(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);
                yStar = ystarvalue6(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);

                uStarLine = function(x) {
                    return u6f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            } else if (this.options.gFunctionChoice === 6) {
                xStar = xstarvalue7(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);
                yStar = ystarvalue7(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);

                uStarLine = function(x) {
                    return u7f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };

                this.board.create('line', [
                    [xStar, yStar],
                    [xStar, this.options.gYAxisMax]
                ], {
                    fixed: true,
                    strokeColor: this.l1Color,
                    straightFirst: false,
                    straightLast: false
                });
            } else if (this.options.gFunctionChoice === 7) {
                xStar = xstarvalue8(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);
                yStar = ystarvalue8(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5);

                uStarLine = function(x) {
                    return u8f1(
                        x, me.options.gA1, me.options.gA2,
                        me.options.gA3, me.options.gA4, me.options.gA5);
                };
            }

            this.l1 = this.board.create('functiongraph', [
                positiveRange(uStarLine), 0, 1000
            ], {
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

        this.l2 = this.board.create('functiongraph', [
            positiveRange(iblLine), 0, 1000
        ], {
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

        if (
            this.options.gShowIntersection && this.options.gToggle &&
                xStar !== null && yStar !== null
        ) {
            //
            // TODO: make Graph.showIntersection() compatible with an
            // arbitrary point as input, rather than two lines.
            // Then much of this code can be unified there.
            //
            const optimalBundlePoint = this.board.create('point', [
                xStar, yStar
            ], {
                name: 'Optimal Bundle',
                withLabel: true,
                visible: this.options.gShowIntersection,
                label: {
                    strokeColor: this.optimalBundleColor
                },
                fixed: true,
                strokeColor: this.optimalBundleColor,
                fillColor: this.optimalBundleColor
            });

            this.board.create('line', [
                [xStar, 0],
                optimalBundlePoint
            ], {
                visible: this.options.gShowIntersection,
                fixed: true,
                strokeColor: this.optimalBundleColor,
                dash: 2,
                straightFirst: false,
                straightLast: false
            });

            this.board.create('line', [
                [0, yStar],
                optimalBundlePoint
            ], {
                visible: this.options.gShowIntersection,
                fixed: true,
                strokeColor: this.optimalBundleColor,
                dash: 2,
                straightFirst: false,
                straightLast: false
            });
        }
    }
}

export const mkOptimalChoiceConsumption = function(board, options) {
    let g = new OptimalChoiceConsumptionGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
