angular
  .module('heatmap', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'oc.lazyLoad', 'hljs'])
  .controller('heatmapCtrl', function(alert) {
  	var main = this;
    main.calendarView = "month";
    main.calendarDate = new Date();
    main.events = [];
    main.tentative = [];

    var TP, FP;
    var month = main.calendarDate.getMonth();
    var games = "Action, Adventure, Sports, Strategy, Racing";
    var apps = "Entertainment, Shopping, Health";
    var all = games + ", " + apps



    $(document).ready(function(){

      // GENRE MULTISELECT
      $('#genre').multiselect({
          enableClickableOptGroups: true,
          enableFiltering: true,
          includeSelectAllOption: true,

          buttonText: function(options, select) {
              if (options.length === 0) {
                  return 'None';
              }
              else {
                var labels = [];
                options.map(function() {
                  labels.push($(this).html());
                });
                  
                labels = labels.join(', ');
                 
                if (labels == games)
                  return 'Games';
                else if (labels == apps)
                  return 'Apps';
                else if (labels == all)
                  return 'All';
                else if (options.length > 4)
                  return options.length + " items selected";
                else
                   return labels;
               }
          }
      });

      // STOREFRONT MULTISELECT
      $('#storefront').multiselect({
          enableFiltering: true,
          includeSelectAllOption: true,
          enableClickableOptGroups: true
        });
      
      // NEWUPDATE MULTISELECT
      $('#newupdate').multiselect({
            enableClickableOptGroups: true
        });

      // PLATFORM MULTISELECT
      $('#platform').multiselect({
            enableClickableOptGroups: true
        });

      // PREVIOUS BUTTON
      $('#previous').click(function() {
        month--;
        update();
      });

      // TODAY BUTTON
      $('#today').click(function() {
        month = main.calendarDate.getMonth();
        update();
      });

      // NEXT BUTTON
      $('#next').click(function() {
        month++;
        update();
      });    

      // INITIALIZE CALENDAR
      $.get("http://swuu.github.io/theheat/json.html", function(data, status){
        var arr = JSON.parse(data);
        var date, type, m;

        arr.map(function (X) {
          var m;
          var type = 'inverse';
          var date = new Date (X["Store Date"]);
          
          date.setDate(date.getDate() + 1);
          m = date.getMonth();

          if (X["isTentative"] == true && m == month) {
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

    // UDATE CALENDAR, CALLED BY PREVIOUS, TODAY, NEXT, TPslider, and FPslider
    var update = function() {
      var tentative = [];
      var events = [];

      $.get("http://swuu.github.io/theheat/json.html", function(data, status){
        var arr = JSON.parse(data);
        var date, type, m;

        arr.map(function (X) {
          if (X["Tracking Priority"] >= TP && X["Featuring Priority"] >= FP) {

            date = new Date (X["Store Date"]);
            date.setDate(date.getDate() + 1);
            type = 'inverse';
            m = date.getMonth();

            if (X["isTentative"] == true) {
              if (m == month) {
                tentative.push ({
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
            }

            else {
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

              events.push ({
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
          }
        });

        main.tentative = tentative;
        main.events = events;
      });
    }

    // TRACKING PRIORITY SLIDER
    var TPslider = $('#ex1').slider({
      formatter: function(value) {
        TP = value;
        return 'Tracking Priority: ' + value;
      }
    })
    .on('change', update);

    // FEATURING PRIORITY SLIDER
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
