$(function () {
    var userSearch = $('.user-search input')
    .focus()
    .keyup(handleSearchKeyup);
    var questTemplate = $('.quest.template').removeClass('template').remove();
    var questListElement = $('.quest-list');
    var userSearchPattern = new RegExp('[a-zA-Z0-9_-]');

    fetchQuests()
    .then(buildQuestList);

    function fetchQuests() {
        return $.get('quests');
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
});
