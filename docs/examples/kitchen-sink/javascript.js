angular
  .module('mwl.calendar.docs') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('KitchenSinkCtrl', function(moment, alert) {

    var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.events = [];
    var TP, FP;

    //INITIAL ADD OF EVENTS
    $(document).ready(function(){
      $.get("http://swuu.github.io/theheat/json.html", function(data, status){
        var arr = JSON.parse(data);
        var date, type;

        arr.map(function (X) {
          date = new Date (X["Store Date"]);
          date.setDate(date.getDate() + 1);
          type = 'inverse';

          // color by tracking priority
          switch (X["Tracking Priority"]) {
            case 1: type = 'info';
            break;
            case 2: type = 'success';
              break;
            case 3: type = 'warning';
              break;
            case 4: type = 'important';
              break;
            default:
          }

          vm.events.push({
            title: X["Content Title"],
            startsAt: date,
            AdamID: X["Adam ID"],
            Artist: X["Artist"],
            StoreType: X["Store Type"],
            Genres: X["Genres"],
            TrackingPriority: X["Tracking Priority"],
            FeaturingPriority: X["Featuring Priority"],
            Comments: X["Comments"],

            type: type,
            editable: true,
            deletable: true,
            draggable: true
          });
        });
      });
    });
    
    vm.isCellOpen = false;

    var update = function() {
      var temp = [];

      $.get("http://swuu.github.io/theheat/json.html", function(data, status){
        var arr = JSON.parse(data);
        var date, type;

        arr.map(function (X) {
          if (X["Tracking Priority"] >= TP &&
              X["Featuring Priority"] >= FP) {
            date = new Date (X["Store Date"]);
            date.setDate(date.getDate() + 1);
            type = 'inverse';

            // color by tracking priority
            switch (X["Tracking Priority"]) {
              case 1: type = 'info';
              break;
              case 2: type = 'success';
                break;
              case 3: type = 'warning';
                break;
              case 4: type = 'important';
                break;
              default:
            }

            temp.push({
              title: X["Content Title"],
              startsAt: date,
              AdamID: X["Adam ID"],
              Artist: X["Artist"],
              StoreType: X["Store Type"],
              Genres: X["Genres"],
              TrackingPriority: X["Tracking Priority"],
              FeaturingPriority: X["Featuring Priority"],
              Comments: X["Comments"],

              type: type,
              editable: true,
              deletable: true,
              draggable: true
            });
          }
          vm.events=temp;
        });
      });
    }

    var TPslider = $('#ex1').slider({
      formatter: function(value) {
        TP = value;
        return 'Tracking Priority: ' + value;
      }
    })
    .on('change', update);

    var FPslider = $('#ex2').slider({
      formatter: function(value) {
        FP = value;
        return 'Featuring Priority: ' + value;
      }
    })
    .on('change', update);

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {};

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };
  });