exports.BattleStatuses = {
arceus: {
onSwitchInPriority: 101,
onSwitchIn: function (pokemon) {
    var type = pokemon.types[0];
    if (pokemon.ability === 'multitype') {
        type = this.runEvent('Plate', pokemon);
        if (!type || type === true) {
            type = 'Normal'; //FOR THE MINDGAMES
        }
    }
    pokemon.setType(type, true);
}
}
};