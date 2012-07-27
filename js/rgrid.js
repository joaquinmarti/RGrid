var RGrid = {};

RGrid = (function () {

  var options;

  var style = {
    horizontal: {
      position: 'absolute',
      left: '0px',
      height: '1px',
      width: '100%',
      backgroundColor: '#00aaee'
    },
    vertical: {
      position: 'absolute',
      top: '0px',
      width: '1px',
      backgroundColor: '#00aaee'
    }
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

  var getRes = function(className) { // Get resolution from className "grid_*"
    var regexp = /([A-Za-z0-9]+)(_)([\d]+)/;
    parts = regexp.exec(className);
    return parts[3];
  };

  /* Build Grid */
  var drawGrids = function() {
    for (var res in options) { // Each resolution
      // Create grid container
      var gridContainer;
      gridContainer = document.createElement("div");
      gridContainer.className = 'grid_' + res;
      if (res != 1024)
      gridContainer.style.display = 'none';

      gridContainer.style = merge(gridContainer.style, {
        position: 'absolute',
        width: '100%',
        height: '1px',
        top: '0px',
        left: '0px',
        overflow: 'visible'
      });

      // Append grid container to body
      document.body.appendChild(gridContainer);

      // Create vertical lines
      vLines(gridContainer);

      // Create horizontal lines
      hLines(gridContainer);
    }
  };

  var vLines = function(gridContainer) {
    // Get resolution name
    var res = getRes(gridContainer.className);

    // Get sizes
    var bodyWidth = document.body.scrollWidth;
    var gridWidth = options[res].width;
    var columnWidth = (gridWidth - ((options[res].columns - 1) * options[res].gutter)) / options[res].columns;
    var vlinesContainerStyle;

    // Main container styles depending on align parameter
    switch (options[res].align) {
      case 'center':
        vlinesContainerStyle = {
          position: 'relative',
          margin: '0px auto',
          width: gridWidth + 'px',
          height: '1px',
          top: '0px',
          left: '0px',
          overflow: 'visible'
        }
        break;
      case 'left':
        vlinesContainerStyle = {
          position: 'absolute',
          margin: '0px',
          width: gridWidth + 'px',
          height: '1px',
          top: '0px',
          left: '0px',
          overflow: 'visible'
        }
        break;
      case 'right':
        vlinesContainerStyle = {
          position: 'absolute',
          margin: '0px',
          width: gridWidth + 'px',
          height: '1px',
          top: '0px',
          right: '0px',
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

    // Draw columns
    for (n = 1; n < options[res].columns; n++) {
      var columnLimit = (n * columnWidth) + ((n-1) * options[res].gutter);
      var columnLimitGutter = columnLimit + options[res].gutter;

      drawVertical(columnLimit, vlinesContainer);
      drawVertical(columnLimitGutter, vlinesContainer);
    }

  };

  var hLines = function(gridContainer) {
    // Get resolution name
    var res = getRes(gridContainer.className);

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
  };

  /* Events */
  var addEvents = function() {
    resize();
  };

  var resize = function() {
    // @todo: Add resize controls to make it responsive
  };

  /* Public API */
  return {
    init: function(userOptions) {

      // Merge default and user options
      options = merge({
        '1024': {
          width: 960,
          columns: 6,
          gutter: 20,
          align: 'center',
          baseline: '20'
          // @todo: add offset parameter
        }
      }, userOptions || {});

      // Draw all grids
      drawGrids();

      // Add events
      addEvents();
    }

  }

})();