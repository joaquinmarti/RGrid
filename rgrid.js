;(function(window, undefined) {

  /* Cache browser objects */

  var document = window.document;

  /* Cache internal objects */

  var container = [];

  /* Defaults */

  var defaults = {
    '1024': {
      columns: 6,
      columnUnit: 'px',
      width: 1000,
      gutter: 20,
      offset: 20,
      align: 'center',
      baseline: 20 // Always in px
    }
  };

  /* CSS Styles for lines */

  var style = {
    horizontal: {
      position: 'absolute',
      left: '0',
      height: '1px',
      width: '100%',
      backgroundColor: '#00aaee'
    },
    vertical: {
      position: 'absolute',
      top: '0',
      width: '1px',
      backgroundColor: '#00aaee'
    }
  };

  /* Internal vars */

  var options = {};
  var resolutions = [];
  var currentResolution;

  /* Grid Manager */

  var grid = {

    // Build grid
    build : function() {
      for (var containerResolution in options) { // Each resolution
        if (options.hasOwnProperty(containerResolution)) {
          // Create grid container
          var gridContainer;
          gridContainer = document.createElement("div");
          gridContainer.id = 'grid_' + containerResolution;
          gridContainer.style.display = 'none';

          gridContainer.style = helper.merge(gridContainer.style, {
            position: 'absolute',
            width: '100%',
            height: '1px',
            top: '0',
            left: '0',
            overflow: 'visible'
          });

          // Append grid container to body
          document.body.appendChild(gridContainer);

          // Create vertical lines
          print.verticalContainer(gridContainer);

          // Create horizontal lines
          print.horizontalContainer(gridContainer);

          // Cache gridContainer reference
          container[containerResolution] = document.getElementById('grid_' + containerResolution);
        }
      }

      // Set first resolution
      resolution.eval();

      // @todo: Add debug window

    },

    // Change the grid depending on resolution
    change : function(resolution) {
      // Hide all grid containers
      for (var containerResolution in options) {
        if (options.hasOwnProperty(containerResolution)) {
          helper.getContainer(containerResolution).style.display = 'none';
        }
      }

      // Show current resolution container
      helper.getContainer(resolution).style.display = 'block';

      // Set the current resolution
      currentResolution = resolution;
    }
  };

  /* Resolution Manager object */

  var resolution = {

    // Get resolution from body width
    eval : function() {
      var bodyWidth = document.body.scrollWidth;
      var bodyHeight = document.body.scrollHeight;
      var resolution;

      for (var i = resolutions.length - 1; i >= 0; i--) { // Loop inversely resolutions
        if (bodyWidth >= resolutions[i]) {
          resolution = resolutions[i]; // Set current break
          break;
        }
      }

      if (resolution !== null && resolution !== currentResolution) {
        grid.change(resolution);
      }
    }
  };

  /* Print lines object */

  var print = {

    // Build vertical lines container
    verticalContainer : function(gridContainer) {
      // Get resolution name
      var containerResolution = helper.getResolution(gridContainer.id);

      // Get sizes
      var bodyWidth = document.body.scrollWidth;
      var gridWidth = options[containerResolution].width;
      // @todo: Add calc to percentage columns
      var columnWidth = (gridWidth - (options[containerResolution].offset * 2) - ((options[containerResolution].columns - 1) * options[containerResolution].gutter)) / options[containerResolution].columns;
      var vlinesContainerStyle;

      // Main container styles depending on align parameter
      switch (options[containerResolution].align) {
        case 'center':
          vlinesContainerStyle = {
            position: 'relative',
            margin: '0 auto',
            width: gridWidth + 'px',
            height: '1px',
            top: '0',
            left: '0',
            overflow: 'visible'
          };
          break;
        case 'left':
          vlinesContainerStyle = {
            position: 'absolute',
            margin: '0',
            width: gridWidth + 'px',
            height: '1px',
            top: '0',
            left: '0',
            overflow: 'visible'
          };
          break;
        case 'right':
          vlinesContainerStyle = {
            position: 'absolute',
            margin: '0',
            width: gridWidth + 'px',
            height: '1px',
            top: '0',
            right: '0',
            overflow: 'visible'
          };
          break;
      }

      // Draw vertical lines container
      var vlinesContainer;
      vlinesContainer = document.createElement("div");
      vlinesContainer.className = 'vlines_container';
      vlinesContainer.style = helper.merge(vlinesContainer.style, vlinesContainerStyle);

      // Append vertical lines container container to grid container
      gridContainer.appendChild(vlinesContainer);

      // Draw left and right grid limits
      print.vertical(0, vlinesContainer);
      print.vertical(gridWidth, vlinesContainer);

      // Draw offset
      print.vertical(options[containerResolution].offset, vlinesContainer);
      print.vertical(gridWidth - options[containerResolution].offset, vlinesContainer);

      // Draw columns
      for (var n = 1, columns = options[containerResolution].columns; n < columns; n++) {
        var columnLimit = (n * columnWidth) + ((n-1) * options[containerResolution].gutter) + options[containerResolution].offset;
        var columnLimitGutter = columnLimit + options[containerResolution].gutter;

        print.vertical(columnLimit, vlinesContainer);
        print.vertical(columnLimitGutter, vlinesContainer);
      }
    },

    // Build horizontal lines container
    horizontalContainer : function(gridContainer) {
      // Get resolution name
      var containerResolution = helper.getResolution(gridContainer.id);

      // Get sizes
      var baseline = parseInt(options[containerResolution].baseline, 10);
      var bodyHeight = document.body.scrollHeight;

      // Draw horizontal lines container
      var hlinesContainer;
      hlinesContainer = document.createElement("div");
      hlinesContainer.className = 'hlines_container';

      // Append horizontal lines container container to grid container
      gridContainer.appendChild(hlinesContainer);

      for (var n = baseline; n < bodyHeight; n += baseline) {
        print.horizontal(n, hlinesContainer);
      }
    },

    // Vertical line
    vertical : function(left, container) {
      // Create vertical line
      var vline;
      vline = document.createElement("div");
      vline.className = 'vline';
      vline.style.height = document.body.scrollHeight + 'px';
      vline.style = helper.merge(vline.style, style.vertical); // Apply styles
      vline.style.left = left + 'px';

      // Add vertical line to the grid
      container.appendChild(vline);

      // @todo: Add line to cache
    },

    // Horizontal line
    horizontal : function(top, container) {
      // Create horizontal line
      var hline;
      hline = document.createElement("div");
      hline.className = 'hline';
      hline.style = helper.merge(hline.style, style.horizontal); // Apply styles
      hline.style.top = top + 'px'; // Set top parameter

      // Add horizontal line to the grid
      container.appendChild(hline);

      // @todo: Add line to cache
    }
  };

  /* Events block */

  var events = {

    // Init function
    init : function() {
      events.resize(); // Bind resize event
    },

    // Bind resize event
    resize : function() {
      window.onresize = function(event) {
        resolution.eval();
        // @todo: Change height: draw less or more horizontal lines
      };
    }
  };

  /* Helpers object */

  var helper = {

    // Merge objects
    merge : function(ob1, ob2){
      for (var key in ob2) {
        if (ob2.hasOwnProperty(key)) {
          ob1[key] = ob2[key];
        }
      }
      return ob1;
    },

    // Get resolution from id "grid_*"
    getResolution : function(id) {
      var regexp = /([A-Za-z0-9]+)(_)([\d]+)/;
      var parts = regexp.exec(id);
      return parts[3];
    },

    // Get container from cache
    getContainer : function(resolution) {
      return container[resolution];
    }
  };

  /* Public object */

  RGrid = (function() {

    var RGrid = function(userOptions) {
      //Merge default and user options
      options = helper.merge(defaults, userOptions || {});

      // Cache resolutions
      for (var res in options) {
        if (options.hasOwnProperty(res)) {
          resolutions.push(parseInt(res, 10));
        }
      }

      // Reverse the cache resolution array
      resolutions.reverse();

      // Draw all grids
      grid.build();

      // Add events
      events.init();
    };

    return RGrid;

  })();

})(window);