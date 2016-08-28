'use strict';

const _ = require('lodash');

// position code to vor
const map = {
    QB : 11,
    RB : 30,
    WR : 37,
    TE : 7,
    K : 0,
    DST : 0,
    DL : 5,
    LB : 15,
    DB : 1
};

exports.baselines = _.map(map, (v, k) => {
    return {
        positionCode: k,
        vorRank: v.toString()
    }
});
