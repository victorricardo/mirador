(function($) {

  $.AnnotationsLayer = function(options) {

    jQuery.extend(true, this, {
      parent:            null,
      annotationsList:   null,
      viewer:            null,
      renderer:          null,
      rectTool:          null,
      selected:          null,
      hovered:           null,
      windowId:          null,
      mode:              'default',
      element:           null
    }, options);

    this.init();
  };

  $.AnnotationsLayer.prototype = {

    init: function() {
      var _this = this;
      jQuery.unsubscribe(('modeChange.' + _this.windowId));

      this.createRenderer();
      this.bindEvents();
      this.listenForActions();
    },

    listenForActions: function() {
      var _this = this;

      jQuery.subscribe('modeChange.' + _this.windowId, function(event, modeName) {
        _this.mode = modeName;
        _this.modeSwitch();
      });

      jQuery.subscribe('annotationListLoaded.' + _this.windowId, function(event) {
        _this.annotationsList = _this.state.getWindowAnnotationsList(_this.windowId);
        _this.updateRenderer();
      });
    },

    bindEvents: function() {
      var _this = this;
    },

    createRenderer: function() {
      var _this = this;
      this.renderer = new $.OsdCanvasRenderer({
        osd: $.OpenSeadragon,
        osdViewer: _this.viewer,
        list: _this.annotationsList, // must be passed by reference.
        visible: false,
        windowId: _this.windowId,
        state: _this.state
      });
      this.modeSwitch();
    },
    
    updateRenderer: function() {
      this.renderer.list = this.annotationsList;
      this.modeSwitch();
    },
    
    modeSwitch: function() {
      //console.log(this.mode);
      if (this.mode === 'displayAnnotations') { this.enterDisplayAnnotations(); }
      else if (this.mode === 'editingAnnotations') { this.enterEditAnnotations(); }
      else if (this.mode === 'default') { this.enterDefault(); }
      else {}
    },


    enterDisplayAnnotations: function() {
      var _this = this;
      //console.log('triggering annotation loading and display');
      if (this.rectTool) {
        this.rectTool.exitEditMode();
      }
      this.renderer.render();
    },

    enterEditAnnotations: function() {
      var _this = this;
      if (!this.rectTool) {
        this.rectTool = new $.OsdRegionRectTool({
          osd: OpenSeadragon,
          osdViewer: _this.viewer,
          rectType: 'oa', // does not do anything yet. 
          windowId: _this.windowId,
          state: _this.state
        });
      } else {
        this.rectTool.reset(_this.viewer);
      }
      this.renderer.render();
      this.rectTool.enterEditMode();
    },

    enterDefault: function() {
      if (this.rectTool) {
        this.rectTool.exitEditMode();
      }
      this.renderer.hideAll();
    }

  };

}(Mirador));
