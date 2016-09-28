$(function () {
    'use strict';
    var userSearch = $('.user-search input')
    .focus()
    .keyup(handleSearchKeyup);
    var questTemplate = $('.quest.template').removeClass('template').remove();
    var actitivtyTemplate = $('.activity.template').removeClass('template').remove();
    var questListElement = $('.quest-list');
    var userSearchPattern = new RegExp('[a-zA-Z0-9_-]');
    var statsDisplay = $('.stats').hide();
    var statsCompletions = statsDisplay.find('.quest-completions-count');
    var statsUsers = statsDisplay.find('.users-count');
    var socket = io();

    fetchQuests()
    .then(buildQuestList);

    fetchStats()
    .then(showStats);

    socket.on('quest activity', function (activity) {
        console.log('activity', activity);
    });

    function fetchQuests() {
        return $.get('quests?modVersion=9000.0.0-9000');
    }

    function buildQuestList(quests) {
        if (!quests) {
            return;
        }

        $.each(quests, function (index, quest) {
            var questElement = questTemplate.clone();
            questElement.find('.quest-type').addClass(quest.type);
            questElement.find('.quest-name').text(quest.name);
            questElement.find('.quest-description').text(quest.description);
            questElement.appendTo(questListElement);
        });
    }

    function handleSearchKeyup(event) {
        if (event.which === 13) {
            search();
        }
    }

    function search() {
        window.location.pathname = "/" + userSearch.val();
    }

    function fetchStats() {
        return $.when(fetchCompletions(), fetchUsers());
    }

    function fetchCompletions() {
        return $.get('stats/completions').done(function (count) {
            statsCompletions.text(count);
        });
    }

    function fetchUsers() {
        return $.get('stats/users').done(function (count) {
            statsUsers.text(count);
        });
    }

    function showStats() {
        statsDisplay.show();
    }
});
