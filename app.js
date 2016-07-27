angular
  .module('heatmap', ['mwl.calendar', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'oc.lazyLoad', 'hljs'])
  .controller('heatmapCtrl', function(alert) {
  	var main = this;
    main.calendarView = "month";
    main.calendarDate = new Date();
    main.events = [];
    main.tentative = [];

    var TP, FP, arr;
    var month = main.calendarDate.getMonth();

    var tentatives = new Array();
    tentatives[0] = "January";
    tentatives[1] = "February";
    tentatives[2] = "March";
    tentatives[3] = "April";
    tentatives[4] = "May";
    tentatives[5] = "June";
    tentatives[6] = "July";
    tentatives[7] = "August";
    tentatives[8] = "September";
    tentatives[9] = "October";
    tentatives[10] = "November";
    tentatives[11] = "December";
    tentatives[12] = "Q";

    $(document).ready(function(){

      // STOREFRONT MULTISELECT
      $('#storefront').multiselect({
          enableFiltering: true,
          includeSelectAllOption: true,
          enableClickableOptGroups: true,
          enableCaseInsensitiveFiltering: true,

          buttonText: function(options, select) {
            return 'Storefront';
          }
        });

      // GENRE MULTISELECT
      $('#genre').multiselect({
          enableClickableOptGroups: true,
          enableCollapsibleOptGroups: true,
          enableFiltering: true,
          includeSelectAllOption: true,
          enableCaseInsensitiveFiltering: true,
          maxHeight: 600,

          buttonText: function(options, select) {
            return 'Category';
          }
      });

      // PLATFORM MULTISELECT
      $('#platform').multiselect({
          includeSelectAllOption: true,
          enableClickableOptGroups: true,

          buttonText: function(options, select) {
            return 'Platform';
          }
        });

      // NEWUPDATE MULTISELECT
      $('#newupdate').multiselect({
          includeSelectAllOption: true,
          enableClickableOptGroups: true,

          buttonText: function(options, select) {
            return 'New/Update';
          }
        });

      // TRACKING PRIORITY SLIDER
      var TPslider = $('#ex1').slider({
        formatter: function(value) {
          TP = value;
          return value;
        }
      })
      .on('change', update);

      // FEATURING PRIORITY SLIDER
      var FPslider = $('#ex2').slider({
        formatter: function(value) {
          FP = value;
          return value;
        }
      })
      .on('change', update);

        // PREVIOUS BUTTON
        $('#previous').click(function() {
          month--;
          update();
        });

        // NEXT BUTTON
        $('#next').click(function() {
          month++;
          update();
        });


      var TP, FP;
      var month = (new Date()).getMonth();
      // UDATE CALENDAR, CALLED BY PREVIOUS, TODAY, NEXT, TPslider, and FPslider
      var update = function() {
        $.get("http://swuu.github.io/theheat/json.html", function(data, status){
            var arr = JSON.parse(data);
          var tentativedates = [];
          var events = [];
          var date, m, title, i, genres;
        
          var tentatives = new Array();
            tentatives[0] = "January";
          tentatives[1] = "February";
          tentatives[2] = "March";
          tentatives[3] = "April";
          tentatives[4] = "May";
          tentatives[5] = "June";
          tentatives[6] = "July";
          tentatives[7] = "August";
          tentatives[8] = "September";
          tentatives[9] = "October";
          tentatives[10] = "November";
          tentatives[11] = "December";
          tentatives[12] = "Q";

          arr.map(function (X) {
   
            // REMOVE [iOS 1.2.3 ... ]
            title = X["Content Title"];
            i = title.indexOf("[");
            if (i > 0)
              title = title.substring(0,i-1);

            // REMOVE "Mobile Software Applications"
            genres = X["Genres"];
            genres = genres.replace(/Mobile Software Applications/g, "");
            genres = genres.replace(/>/g, "");

            if (X["Tracking Priority"] >= TP && X["Featuring Priority"] >= FP) {
              var tentative = false;

              // CHECK IS TENTATIVE
              for (i=0 ; i < tentatives.length ; i++) {
                if(X["Store Date"].search(tentatives[i]) >= 0)
                  tentative = true;
              }

              m = 6; // m = date.getMonth();

              if (tentative) {
                if (m == month) {
                  tentativedates.push ({
                    title: title,
                    startsAt: X["Store Date"],
                    AdamID: X["Adam ID"],
                    Artist: X["Artist"],
                    Platform: X["Platform"],
                    Genres: genres,
                    TrackingPriority: X["Tracking Priority"],
                    FeaturingPriority: X["Featuring Priority"],
                    Comments: X["Comments"],

                    editable: true,
                    deletable: true,
                    draggable: true
                  });
                }
              }

              else {
                date = new Date (X["Store Date"]);
                date.setDate(date.getDate() + 1);

                events.push ({
                  title: title,
                  startsAt: date,
                  AdamID: X["Adam ID"],
                  Artist: X["Artist"],
                  Platform: X["Platform"],
                  Genres: genres,
                  TrackingPriority: X["Tracking Priority"],
                  FeaturingPriority: X["Featuring Priority"],
                  Comments: X["Comments"],

                  editable: true,
                  deletable: true,
                  draggable: true
                });
              }
            }
          });

        main.tentative = tentativedates;
        main.events = events;
      });
    }

      // INITIALIZE CALENDAR
      $.get("http://swuu.github.io/theheat/json.html", function(data, status){
        arr = JSON.parse(data);
        var date, m, title, genres, i;

        arr.map(function (X) {
          var m, date;
          var tentative = false;

          // REMOVE [iOS 1.2.3 ... ]
          title = X["Content Title"];
          i = title.indexOf("[");
          if (i > 0)
            title = title.substring(0,i-1);

          // REMOVE "Mobile Software Applications"
          genres = X["Genres"];
          genres = genres.replace(/Mobile Software Applications/g, "");
          genres = genres.replace(/>/g, "");

          // CHECK IS TENTATIVE
          for (i=0 ; i < tentatives.length ; i++) {
            if(X["Store Date"].search(tentatives[i]) >= 0)
              tentative = true;
          }

          m =  6;  //  m = date.getMonth();
          
          if (tentative && m == month) {
            main.tentative.push ({
              title: title,
              startsAt: X["Store Date"],
              AdamID: X["Adam ID"],
              Artist: X["Artist"],
              Platform: X["Platform"],
              Genres: genres,
              TrackingPriority: X["Tracking Priority"],
              FeaturingPriority: X["Featuring Priority"],
              Comments: X["Comments"],

              editable: true,
              deletable: true,
              draggable: true
            });
          }

          else {
            date = new Date (X["Store Date"]); 
            date.setDate(date.getDate() + 1);

            main.events.push ({
              title: title,
              startsAt: date,
              AdamID: X["Adam ID"],
              Artist: X["Artist"],
              Platform: X["Platform"],
              Genres: genres,
              TrackingPriority: X["Tracking Priority"],
              FeaturingPriority: X["Featuring Priority"],
              Comments: X["Comments"],

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
      var tentativedates = [];
      var events = [];
      var date, m;

      arr.map(function (X) {

        // REMOVE [iOS 1.2.3 ... ]
        title = X["Content Title"];
        i = title.indexOf("[");
        if (i > 0)
          title = title.substring(0,i-1);

        // REMOVE "Mobile Software Applications"
        genres = X["Genres"];
        genres = genres.replace(/Mobile Software Applications/g, "");
        genres = genres.replace(/>/g, "");

        if (X["Tracking Priority"] >= TP && X["Featuring Priority"] >= FP) {
          var tentative = false;

          // CHECK IS TENTATIVE
          for (i=0 ; i < tentatives.length ; i++) {
            if(X["Store Date"].search(tentatives[i]) >= 0)
              tentative = true;
          }

          m = 6; // m = date.getMonth();

          if (tentative) {
            if (m == month) {
              tentativedates.push ({
                title: title,
                startsAt: X["Store Date"],
                AdamID: X["Adam ID"],
                Artist: X["Artist"],
                Platform: X["Platform"],
                Genres: genres,
                TrackingPriority: X["Tracking Priority"],
                FeaturingPriority: X["Featuring Priority"],
                Comments: X["Comments"],

                editable: true,
                deletable: true,
                draggable: true
              });
            }
          }

          else {
            date = new Date (X["Store Date"]);
            date.setDate(date.getDate() + 1);

            events.push ({
              title: title,
              startsAt: date,
              AdamID: X["Adam ID"],
              Artist: X["Artist"],
              Platform: X["Platform"],
              Genres: genres,
              TrackingPriority: X["Tracking Priority"],
              FeaturingPriority: X["Featuring Priority"],
              Comments: X["Comments"],

              editable: true,
              deletable: true,
              draggable: true
            });
          }
        }
      });

      main.tentative = tentativedates;
      main.events = events;
    }


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
