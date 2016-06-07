angular
  .module('mwl.calendar.docs') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('KitchenSinkCtrl', function(moment, alert) {

    var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.events = [];

    //ADD EVENTS HERE
    $(document).ready(function(){
      $.get("http://swumusic.com/json.html", function(data, status){
        var arr = JSON.parse(data);

        arr.map(function (X) {
          date = new Date (X["Store Date"])
          vm.events.push({
            title: X["Content Title"],
            type: 'important',
            startsAt: date,
            draggable: true,
            resizable: true});
        });
      });
    });
    
    vm.isCellOpen = false;

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

  });
