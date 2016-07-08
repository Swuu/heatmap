angular
  .module('heatmap', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'oc.lazyLoad', 'hljs'])
  .controller('heatmapCtrl', function(alert) {
  	var main = this;
    var TP, FP;
    main.calendarView = "month";
    main.calendarDate = new Date();
    main.events = [];
    main.tentative = [];

    $(document).ready(function(){
      $('#multselect').multiselect({
            enableClickableOptGroups: true
        });
      
      $('#newupdate').multiselect({
            enableClickableOptGroups: true
        });

      $.get("http://swuu.github.io/theheat/json.html", function(data, status){
        var arr = JSON.parse(data);
        var date, type;

        arr.map(function (X) {
          if (X["isTentative"] == true) {
            main.tentative.push ({
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

          else {
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

            main.events.push ({
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
        });
      });
    });

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
          main.events=temp;
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


    main.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    main.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    main.eventDeleted = function(event) {
      var i = main.events.indexOf(event);
      main.events.splice(i, 1);
      // ALSO WRITE TO DATABASE HERE
    };

    main.eventTimesChanged = function(event) {};

    main.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

  })

  .factory('alert', function($uibModal) {

    function show(action, event) {
      return $uibModal.open({
        templateUrl: 'modalContent.html',
        controller: function() {
          var main = this;
          main.action = action;
          main.event = event;
        },
        controllerAs: 'main'
      });
    }
    return {
      show: show
    };

  });
