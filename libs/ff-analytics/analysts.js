'use strict';

const _ = require('lodash');


const seasons = {
    2016 : [0],
    //2015 : _.range(0, 20),
    2015 : _.range(0, 18),
    2014 : [0],
    2013: [0],
    2012: [0]
};

/**
 * Analysts information scraped from the ff analytics website
 */
const analysts = {
    CBS: {
        analystId: -1,
        dataScrapeId: 2,
        analystWeight: 0.344
    },
    ESPN: {
        analystId: 4,
        dataScrapeId: 1,
        analystWeight: 0.329
    },
    FantasyFootballNerd: {
        analystId: 19,
        dataScrapeId: 2,
        analystWeight: 0
    },
    FantasyPros: {
        analystId: 9,
        dataScrapeId: 3,
        analystWeight: 0
    },
    FantasySharks: {
        analystId: 18,
        dataScrapeId: 2,
        analystWeight: 0.327
    },
    FFToday: {
        analystId: 7,
        dataScrapeId: 2,
        analystWeight: 0.379
    },
    NFL: {
        analystId: 5,
        dataScrapeId: 2,
        analystWeight: 0.329
    },
    WalterFootball: {
        analystId: 20,
        dataScrapeId: 2,
        analystWeight: 0.281
    },
    Yahoo: {
        analystId: 3,
        dataScrapeId: 1,
        analystWeight: 0.4
    },
    FantasyData: {
        analystId: 28,
        dataScrapeId: 28,
        analystWeight: 0.428
    }
};

/**
 * Generate the season and weeks for an analyst for the ffanalytics api
 *
 * @param year
 * @param weeks
 * @returns {Array}
 */
function genSeasonAndWeeks(year, weeks) {
    return weeks.map((week) => `${year}-${week}`);
}

function buildAnalyst(options = {}) {
    var seasonAndWeeks = _.flatMap(seasons, (weeks, year) => genSeasonAndWeeks(year, weeks));
    var stringSandW = seasonAndWeeks.map((sw) => {
        return "'" + sw + "'";
    });

    return {
        Seasons : Object.keys(seasons).map((w) => parseInt(w)),
        Weeks : seasons[2015].map((w) => parseInt(w)),
        hasLatestProjections : false,
        seasonAndWeeksObjects : seasonAndWeeks,
        seasonAndWeeks : '[' + stringSandW.join() + ']',
        // options data
        analystId : options.analystId,
        dataScrapeId : options.dataScrapeId,
        analystWeight : options.analystWeight,
        analystName : options.analystName
    }
}

const myAnalysts = {
    Yahoo : analysts.Yahoo,
    FantasyData : analysts.FantasyData,
    FFToday : analysts.FFToday,
    CBS : analysts.CBS,
    WalterFootball : analysts.WalterFootball,
    NFL : analysts.NFL,
    FantasySharks: analysts.FantasySharks,
    ESPN: analysts.ESPN
};

exports.all = _.map(myAnalysts, (a, name) => {
    var opts = Object.assign({}, a);
    opts.analystName = name;
    return buildAnalyst(opts);
});
