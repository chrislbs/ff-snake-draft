'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    draftPick = require('../../libs/data/draft_pick'),
    draftOrder = require('./league/draft_order');

router.use('/order', draftOrder);

router.post('/pick', (req, res) => {
    const leagueId = req.leagueId;
    const player = req.body;

    draftPick.pickPlayer(leagueId, player.playerName, player.teamName)
        .then((pickId) => {
            res.send({
                playerName : player.playerName,
                teamName : player.teamName,
                id : pickId
            })
        })
        .catch((err) => res.status(500).send(err));
});

router.post('/undoLastPick', (req, res) => {
    const leagueId = req.leagueId;

    draftPick.undoLastPick(leagueId)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send(err));
});

router.get('/allPicks', (req, res) => {
    const leagueId = req.leagueId;

    draftPick.getPicks(leagueId)
        .then((rows) => {
            return _.map(rows, (row) => {
                return {
                    id : row['id'],
                    playerName : row['player_name'],
                    teamName : row['team']
                }
            })
        })
        .then((picks) => res.send(picks))
        .catch((err) => res.status(500).send(err));
});

module.exports = router;
