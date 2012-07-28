var RGrid = {};

RGrid = (function () {

  var options = {};
  var resolutions = [];
  var currentRes;

  // Memory cache to
  var cache = {
    horizontal: [],
    vertical: []
  }

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

  /* Build Grid */
  var drawGrids = function() {
    for (var res in options) { // Each resolution
      // Create grid container
      var gridContainer;
      gridContainer = document.createElement("div");
      gridContainer.id = 'grid_' + res;
      gridContainer.style.display = 'none';

      gridContainer.style = merge(gridContainer.style, {
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
      vLines(gridContainer);

      // Create horizontal lines
      hLines(gridContainer);
    }

    // Set first resolution
    evalCurrentRes();

    // @todo: Add debug window
  };

  var vLines = function(gridContainer) {
    // Get resolution name
    var res = getRes(gridContainer.id);

    // Get sizes
    var bodyWidth = document.body.scrollWidth;
    var gridWidth = options[res].width;
    // @todo: Add calc to percentage columns
    var columnWidth = (gridWidth - (options[res].offset * 2) - ((options[res].columns - 1) * options[res].gutter)) / options[res].columns;
    var vlinesContainerStyle;

    // Main container styles depending on align parameter
    switch (options[res].align) {
      case 'center':
        vlinesContainerStyle = {
          position: 'relative',
          margin: '0 auto',
          width: gridWidth + 'px',
          height: '1px',
          top: '0',
          left: '0',
          overflow: 'visible'
        }
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
        }
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
        }
        break;
    }

    // Draw vertical lines container
    var vlinesContainer;
    vlinesContainer = document.createElement("div");
    vlinesContainer.className = 'vlines_coontainer';
    vlinesContainer.style = merge(vlinesContainer.style, vlinesContainerStyle);

    // Append vertical lines container container to grid container
    gridContainer.appendChild(vlinesContainer);

    // Draw left and right grid limits
    drawVertical(0, vlinesContainer);
    drawVertical(gridWidth, vlinesContainer);

    // Draw offset
    drawVertical(options[res].offset, vlinesContainer);
    drawVertical(gridWidth - options[res].offset, vlinesContainer);

    // Draw columns
    for (n = 1; n < options[res].columns; n++) {
      var columnLimit = (n * columnWidth) + ((n-1) * options[res].gutter) + options[res].offset;
      var columnLimitGutter = columnLimit + options[res].gutter;

      drawVertical(columnLimit, vlinesContainer);
      drawVertical(columnLimitGutter, vlinesContainer);
    }

  };

  var hLines = function(gridContainer) {
    // Get resolution name
    var res = getRes(gridContainer.id);

    // Get sizes
    var baseline = parseInt(options[res].baseline);
    var bodyHeight = document.body.scrollHeight;

    // Draw horizontal lines container
    var hlinesContainer;
    hlinesContainer = document.createElement("div");
    hlinesContainer.className = 'hlines_coontainer';

    // Append horizontal lines container container to grid container
    gridContainer.appendChild(hlinesContainer);

    for (var n = baseline; n < bodyHeight; n += baseline) {
      drawHorizontal(n, hlinesContainer);
    }

  };

  /* Draw line functions */
  var drawVertical = function(left, container) {
    // Draw line
    var vline;
    vline = document.createElement("div");
    vline.className = 'vline';
    vline.style.height = document.body.scrollHeight + 'px';
    vline.style = merge(vline.style, style.vertical); // Apply styles
    vline.style.left = left + 'px';

    // Add vertical line to the grid
    container.appendChild(vline);

    // @todo: Add line to cache
  };

  var drawHorizontal = function(top, container) {
    // Draw line
    var hline;
    hline = document.createElement("div");
    hline.className = 'hline';
    hline.style = merge(hline.style, style.horizontal); // Apply styles
    hline.style.top = top + 'px'; // Set top parameter

    // Add horizontal line to the grid
    container.appendChild(hline);

    // @todo: Add line to cache
  };

  /* Events */
  var addEvents = function() {
    resize();
  };

  var resize = function() {
    window.onresize = function(event) {
      evalCurrentRes();
      // @todo: Change height: draw less or more horizontal lines
    }
  };

  /* Change resolution grid */

  var evalCurrentRes = function() {
    var bodyWidth = document.body.scrollWidth;
    var bodyHeight = document.body.scrollHeight;
    var resolution;

    for (i = resolutions.length - 1; i >= 0; i--) { // Loop inversely resolutions
      if (bodyWidth >= resolutions[i]) {
        resolution = resolutions[i]; // Set current break
        break;
      }
    }

    if (resolution != null && resolution != currentRes) {
      currentRes = resolution;
      setCurrentRes();
    }
  };

  var setCurrentRes = function() {
    // Hide all grid containers
    for (var res in options) {
      document.getElementById('grid_' + res).style.display = 'none';
    }

    // Show current resolution container
    document.getElementById('grid_' + currentRes).style.display = 'block';
  };

  /* Helpers */

  var merge = function(ob1, ob2){ // Merge objects
    for (var key in ob2) {
      if (ob2.hasOwnProperty(key)) {
        ob1[key] = ob2[key];
      }
    }
    return ob1;
  };

  var getRes = function(id) { // Get resolution from id "grid_*"
    var regexp = /([A-Za-z0-9]+)(_)([\d]+)/;
    parts = regexp.exec(id);
    return parts[3];
  };

  /* Public function */
  return {
    init: function(userOptions) {

      // Merge default and user options
      options = merge({
        '1024': {
          columns: 6,
          columnUnit: 'px',
          width: 1000,
          gutter: 20,
          offset: 20,
          align: 'center',
          baseline: 20 // Always in px
        }
      }, userOptions || {});

      // Save and order resolutions
      for (var res in options) {
        resolutions.push(parseInt(res));
      }

      resolutions.reverse();

      // Draw all grids
      drawGrids();

      // Add events
      addEvents();
    }

  }

})();