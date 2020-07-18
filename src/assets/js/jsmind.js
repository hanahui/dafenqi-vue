
import router from '../../router'

(function($w){
  // an noop function define
  var _noop = function(){};
  var logger = (typeof console === 'undefined')?{
    log:_noop, debug:_noop, error:_noop, warn:_noop, info:_noop
  }:console;

  // shortcut of methods in dom（dom快捷方法）
  var $d = window.document;
  // var $d = $w.document;
  var $g = function(id){return $d.getElementById(id);};
  var $c = function(tag){return $d.createElement(tag);};
  var $t = function(n,t){if(n.hasChildNodes()){n.firstChild.nodeValue = t;}else{n.appendChild($d.createTextNode(t));}};window

  var $h = function (n, t) {
    if (t instanceof HTMLElement) {
      n.innerHTML = '';
      n.appendChild(t)
    } else {
      n.innerHTML = t;
    }
  };
  // detect isElement
  var $i = function(el){return !!el&&(typeof el==='object')&&(el.nodeType===1)&&(typeof el.style==='object')&&(typeof el.ownerDocument==='object');};
  if(typeof String.prototype.startsWith != 'function'){String.prototype.startsWith=function(p){return this.slice(0,p.length)===p;};}

  var DEFAULT_OPTIONS = {
    container: '',   // id of the container
    editable: false, // you can change it in your options
    support_html: true,
    view: {
      hmargin: 100,
      vmargin: 50,
      line_width: 2,
      line_color: '#4d4d4d'
    },
    layout: {
      hspace: 80,
      vspace: 50,
      itemspace: 20,
      pspace: 30
    },
    default_event_handle: {
      enable_mousedown_handle: true,
      enable_click_handle: true,
      enable_dblclick_handle: true
    }
  }


  var jm = function(options){
    var opts = {};
    opts = jm.util.json.merge(DEFAULT_OPTIONS, options);
    this.options = opts;
    this.inited = false;
    this.mind = null;
    this.init();

  };

  jm.format = {
    get_mind:function(source){
      var format = jm.format;
      var mind = new jm.mind();
      format._parse(mind, source.data);
      return mind;
    },

    _parse:function(mind, node_root){
      var format = jm.format;
      var data = format._extract_data(node_root);
      mind.set_root(node_root.id, node_root.topic, data);
      if('children' in node_root){
        var children = node_root.children;
        for(var i=0;i<children.length;i++){
          format._extract_subnode(mind, mind.root, children[i]);
        }
      }
    },

    _extract_data:function(node_json){
      var data = {};
      for(var k in node_json){
        if(k == 'id' || k=='topic' || k=='children' || k=='direction' || k=='expanded'){
          continue;
        }
        data[k] = node_json[k];
      }
      return data;
    },

    _extract_subnode:function(mind, node_parent, node_json){
      var format = jm.format;
      var data = format._extract_data(node_json);
      var node = mind.add_node(node_parent, node_json.id, node_json.topic, data, null, node_json.expanded);
      if('children' in node_json){
        var children = node_json.children;
        //logger.log(node_json)
        for(var i=0;i<children.length;i++){
          format._extract_subnode(mind, node, children[i]);
        }
      }
    },
  }

  jm.util = {
    is_node: function(node){
      return !!node && node instanceof jm.node;
    },

    dom:{
      //target,eventType,handler
      add_event:function(t,e,h){
        logger.log(t,e,h,'添加事件')
        if(!!t.addEventListener){
          logger.log('addEventListener')
          t.addEventListener(e,h,false);
        }else{
          logger.log('attachEvent')
          t.attachEvent('on'+e,h);
        }
      }
    },

    canvas:{
      bezierto: function(ctx,x1,y1,x2,y2){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        var y = y1 + 20;
        var x = 0;
        ctx.lineTo(x1,y);
        if(x1 > x2){
          x = x2 + 20
        }else{
          x = x2 - 20;
        }
        ctx.lineTo(x,y);
        ctx.bezierCurveTo(x,y,x+(x2-x),y+(y2-y)*1/4,x2,y2-10);
        ctx.stroke();
        this.draw_triangle(ctx,x2,y2-5,x2-3,y2-10,x2+3,y2-10)
      },
      quadraticto: function(ctx,x1,y1,x2,y2){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x1,y2);
        ctx.lineTo(x2-10,y2);
        ctx.stroke();
        this.draw_triangle(ctx,x2-5,y2,x2-10,y2-3,x2-10,y2+3);
      },
      draw_triangle: function(ctx,x1,y1,x2,y2,x3,y3){
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.fillStyle = '#cccccc';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },
      clear:function(ctx,x,y,w,h){
        ctx.clearRect(x,y,w,h);
      }
    },

    json:{
      merge:function(b,a){
        for(var o in a){
          if(o in b){
            if(typeof b[o] === 'object' &&
              Object.prototype.toString.call(b[o]).toLowerCase() == '[object object]' &&
              !b[o].length){
              jm.util.json.merge(b[o], a[o]);
            }else{
              b[o] = a[o];
            }
          }else{
            b[o] = a[o];
          }
        }
        return b;
      }
    },
  }

  jm.direction = {left:-1,center:0,right:1};

  jm.node = function(sId,iIndex,sTopic,oData,bIsRoot,oParent,eDirection,bExpanded){
    if(!sId){logger.error('invalid nodeid');return;}
    if(typeof iIndex != 'number'){logger.error('invalid node index');return;}
    if(typeof bExpanded === 'undefined'){bExpanded = true;}
    this.id = sId;
    this.index = iIndex;
    this.topic = sTopic;
    this.data = oData || {};
    this.isroot = bIsRoot;
    this.parent = oParent;
    this.direction = eDirection;
    this.expanded = !!bExpanded;
    this.children = [];
    this._data = {};
  };

  jm.node.compare=function(node1,node2){
    // '-1' is alwary the last
    var r = 0;
    var i1 = node1.index;
    var i2 = node2.index;
    if(i1>=0 && i2>=0){
      r = i1-i2;
    }else if(i1==-1 && i2==-1){
      r = 0;
    }else if(i1==-1){
      r = 1;
    }else if(i2==-1){
      r = -1;
    }else{
      r = 0;
    }
    //logger.debug(i1+' <> '+i2+'  =  '+r);
    return r;
  };

  jm.node.inherited=function(pnode,node){
    if(!!pnode && !!node){
      if(pnode.id === node.id){
        return true;
      }
      if(pnode.isroot){
        return true;
      }
      var pid = pnode.id;
      var p = node;
      while(!p.isroot){
        p = p.parent;
        if(p.id === pid){
          return true;
        }
      }
    }
    return false;
  };

  jm.node.prototype = {
    get_location:function(){
      var vd = this._data.view;
      return {
        x:vd.abs_x,
        y:vd.abs_y
      };
    },
    get_size:function(){
      var vd = this._data.view;
      return {
        w:vd.width,
        h:vd.height
      }
    }
  };

  jm.mind = function(){
    this.root = null;
    this.nodes = {};
  };

  jm.mind.prototype = {
    get_node:function(nodeid){
      if(nodeid in this.nodes){
        return this.nodes[nodeid];
      }else{
        logger.warn('the node[id='+nodeid+'] can not be found');
        return null;
      }
    },

    set_root:function(nodeid, topic, data){
      if(this.root == null){
        this.root = new jm.node(nodeid, 0, topic, data, true);
        this._put_node(this.root);
      }else{
        logger.error('root node is already exist');
      }
    },

    add_node:function(parent_node, nodeid, topic, data, idx, direction, expanded){
      if(!jm.util.is_node(parent_node)){
        var the_parent_node = this.get_node(parent_node);
        if(!the_parent_node){
          logger.error('the parent_node[id='+parent_node+'] can not be found.');
          return null;
        }else{
          return this.add_node(the_parent_node, nodeid, topic, data, idx, direction, expanded);
        }
      }
      var nodeindex = idx || -1;
      var node = null;
      if(parent_node.isroot){
        var d = jm.direction.right;
        if(isNaN(direction)){
          var children = parent_node.children;
          var children_len = children.length;
          var r = 0;
          for(var i=0;i<children_len;i++){if(children[i].direction === jm.direction.left){r--;}else{r++;}}
          d = (children_len > 1 && r > 0) ? jm.direction.left : jm.direction.right
        }else{
          d = (direction != jm.direction.left) ? jm.direction.right : jm.direction.left;
        }
        node = new jm.node(nodeid,nodeindex,topic,data,false,parent_node,d,expanded);
      }else{
        node = new jm.node(nodeid,nodeindex,topic,data,false,parent_node,parent_node.direction,expanded);
      }
      if(this._put_node(node)){
        parent_node.children.push(node);
        this._reindex(parent_node);
      }else{
        logger.error('fail, the nodeid \''+node.id+'\' has been already exist.');
        node = null;
      }
      return node;
    },

    insert_node_before:function(node_before, nodeid, topic, data){
      if(!jm.util.is_node(node_before)){
        var the_node_before = this.get_node(node_before);
        if(!the_node_before){
          logger.error('the node_before[id='+node_before+'] can not be found.');
          return null;
        }else{
          return this.insert_node_before(the_node_before, nodeid, topic, data);
        }
      }
      var node_index = node_before.index-0.5;
      return this.add_node(node_before.parent, nodeid, topic, data, node_index);
    },

    get_node_before:function(node){
      if(!jm.util.is_node(node)){
        var the_node = this.get_node(node);
        if(!the_node){
          logger.error('the node[id='+node+'] can not be found.');
          return null;
        }else{
          return this.get_node_before(the_node);
        }
      }
      if(node.isroot){return null;}
      var idx = node.index - 2;
      if(idx >= 0){
        return node.parent.children[idx];
      }else{
        return null;
      }
    },

    insert_node_after:function(node_after, nodeid, topic, data){
      if(!jm.util.is_node(node_after)){
        var the_node_after = this.get_node(node_before);
        if(!the_node_after){
          logger.error('the node_after[id='+node_after+'] can not be found.');
          return null;
        }else{
          return this.insert_node_after(the_node_after, nodeid, topic, data);
        }
      }
      var node_index = node_after.index + 0.5;
      return this.add_node(node_after.parent, nodeid, topic, data, node_index);
    },

    get_node_after:function(node){
      if(!jm.util.is_node(node)){
        var the_node = this.get_node(node);
        if(!the_node){
          logger.error('the node[id='+node+'] can not be found.');
          return null;
        }else{
          return this.get_node_after(the_node);
        }
      }
      if(node.isroot){return null;}
      var idx = node.index;
      var brothers = node.parent.children;
      if(brothers.length >= idx){
        return node.parent.children[idx];
      }else{
        return null;
      }
    },

    move_node:function(node, beforeid, parentid, direction){
      if(!jm.util.is_node(node)){
        var the_node = this.get_node(node);
        if(!the_node){
          logger.error('the node[id='+node+'] can not be found.');
          return null;
        }else{
          return this.move_node(the_node, beforeid, parentid, direction);
        }
      }
      if(!parentid){
        parentid = node.parent.id;
      }
      return this._move_node(node, beforeid, parentid, direction);
    },

    _flow_node_direction:function(node,direction){
      if(typeof direction === 'undefined'){
        direction = node.direction;
      }else{
        node.direction = direction;
      }
      var len = node.children.length;
      while(len--){
        this._flow_node_direction(node.children[len],direction);
      }
    },

    _move_node_internal:function(node, beforeid){
      if(!!node && !!beforeid){
        if(beforeid == '_last_'){
          node.index = -1;
          this._reindex(node.parent);
        }else if(beforeid == '_first_'){
          node.index = 0;
          this._reindex(node.parent);
        }else{
          var node_before = (!!beforeid)?this.get_node(beforeid):null;
          if(node_before!= null && node_before.parent!= null && node_before.parent.id== node.parent.id){
            node.index = node_before.index - 0.5;
            this._reindex(node.parent);
          }
        }
      }
      return node;
    },

    _move_node:function(node, beforeid, parentid, direction){
      if(!!node && !!parentid){
        if(node.parent.id != parentid){
          // remove from parent's children
          var sibling = node.parent.children;
          var si = sibling.length;
          while(si--){
            if(sibling[si].id == node.id){
              sibling.splice(si,1);
              break;
            }
          }
          node.parent = this.get_node(parentid);
          node.parent.children.push(node);
        }

        if(node.parent.isroot){
          if(direction == jsMind.direction.left){
            node.direction = direction;
          }else{
            node.direction = jm.direction.right;
          }
        }else{
          node.direction = node.parent.direction;
        }
        this._move_node_internal(node, beforeid);
        this._flow_node_direction(node);
      }
      return node;
    },

    remove_node:function(node){
      if(!jm.util.is_node(node)){
        var the_node = this.get_node(node);
        if(!the_node){
          logger.error('the node[id='+node+'] can not be found.');
          return false;
        }else{
          return this.remove_node(the_node);
        }
      }
      if(!node){
        logger.error('fail, the node can not be found');
        return false;
      }
      if(node.isroot){
        logger.error('fail, can not remove root node');
        return false;
      }
      if(this.selected!=null && this.selected.id == node.id){
        this.selected = null;
      }
      // clean all subordinate nodes
      var children = node.children;
      var ci = children.length;
      while(ci--){
        this.remove_node(children[ci]);
      }
      // clean all children
      children.length = 0;
      // remove from parent's children
      var sibling = node.parent.children;
      var si = sibling.length;
      while(si--){
        if(sibling[si].id == node.id){
          sibling.splice(si,1);
          break;
        }
      }
      // remove from global nodes
      delete this.nodes[node.id];
      // clean all properties
      for(var k in node){
        delete node[k];
      }
      // remove it's self
      node = null;
      //delete node;
      return true;
    },

    _put_node:function(node){
      if(node.id in this.nodes){
        logger.warn('the nodeid \''+node.id+'\' has been already exist.');
        return false;
      }else{
        this.nodes[node.id] = node;
        return true;
      }
    },

    _reindex:function(node){
      if(node instanceof jm.node){
        node.children.sort(jm.node.compare);
        for(var i=0;i<node.children.length;i++){
          node.children[i].index = i+1;
        }
      }
    },
  };

  jm.prototype={
    init : function(){
      if(this.inited){return;}
      this.inited = true;

      var opts = this.options;

      var opts_layout = {
        hspace:opts.layout.hspace,
        vspace:opts.layout.vspace,
        itemspace: opts.layout.itemspace,
        pspace:opts.layout.pspace
      }
      var opts_view = {
        container:opts.container,
        support_html:opts.support_html,
        hmargin:opts.view.hmargin,
        vmargin:opts.view.vmargin,
        line_width:opts.view.line_width,
        line_color:opts.view.line_color
      };

      // create instance of function provider
      this.data = new jm.data_provider(this);
      this.layout = new jm.layout_provider(this, opts_layout);
      this.view = new jm.view_provider(this, opts_view);

      this.data.init();
      this.layout.init();
      this.view.init();

      this._event_bind();
    },

    _event_bind:function(){
      this.view.add_event(this,'click',this.click_handle);
    },

    click_handle:function(e){
      // if (!this.options.default_event_handle['enable_click_handle']) {
      //     return;
      // }
      var element = e.target || event.srcElement;
      var isexpander = this.view.is_expander(element);
      var isjmnode = this.view.is_jmnode(element);
      //logger.log(element)
      if(isexpander){
        var nodeid = this.view.get_binded_nodeid(element);
        if(!!nodeid){
          this.toggle_node(nodeid);
        }
      }
      if(isjmnode){
        // 点击标签跳转标签管理界面 buttonId categoryId searchKey
        var nodeid = element.getAttribute('nodeid');
        var elementData = null;
        var buttonId = '';
        var categoryId = '';
        var thisLabelId = '';
        var nodes = this.mind.nodes;
        elementData = nodes[nodeid];
        // logger.log('标签数据===>', elementData)
        buttonId = this.get_buttonId(elementData);
        categoryId = this.get_categoryId(elementData);
        thisLabelId = this.get_labelId(elementData);
        // logger.log('跳转标签管理页面参数buttonId==',buttonId,'categoryId==',categoryId,'thisLabelId==',thisLabelId)

        router.push({
          path:'/label',
          query: {
            buttonId: buttonId,
            categoryId: categoryId,
            thisLabelId: thisLabelId
          }
        })
        // 跳转标签管理页面
        // window.location.href = 'labelSys.html?buttonId='+buttonId+'&categoryId='+categoryId+'&thisLabelId='+thisLabelId;




      }
    },

    get_buttonId: function(node){
      if(node.parent.isroot){
        return node.id;
      }else{
        logger.log(node.parent, '父元素')
        return this.get_buttonId(node.parent);
      }
    },

    get_categoryId: function(node){
      if(node.parent.isroot){
        return '';
      }else{
        if(node.parent.data.level == 0){
          return node.id;
        }else{
          return this.get_categoryId(node.parent);
        }
      }
    },

    get_labelId: function(node){
      if(node.data.isLeaf && node.data.level != 0){
        return node.id;
      }else{
        return '';
      }
    },



    toggle_node:function(node){
      if(!jm.util.is_node(node)){
        var the_node = this.get_node(node);
        if(!the_node){
          logger.error('the node[id='+node+'] can not be found.');
          return;
        }else{
          return this.toggle_node(the_node);
        }
      }
      if(node.isroot){return;}
      logger.log(node)
      // this.view.save_location(node);
      this.layout.toggle_node(node);
      // this.view.relayout();
      // this.view.restore_location(node);
    },

    _show:function(mind){
      var m = mind;


      this.mind = this.data.load(m);
      if(!this.mind){
        logger.error('data.load error');
        return;
      }else{
        logger.debug('data.load ok');
      }

      logger.log(this)

      this.view.load();
      logger.debug('view.load ok');

      this.layout.layout();
      logger.debug('layout.layout ok');

      this.view.show(true);
      logger.debug('view.show ok');
    },

    show : function(mind){
      this._show(mind);
    },

    get_node:function(nodeid){
      return this.mind.get_node(nodeid);
    },
  }


  // ============= data provider =============================================

  jm.data_provider = function(jm){
    this.jm = jm;
  };

  jm.data_provider.prototype={
    init:function(){
      logger.debug('data.init');
    },

    reset:function(){
      logger.debug('data.reset');
    },

    load:function(mind_data){
      var mind = null;
      mind = jm.format.get_mind(mind_data);
      return mind;
    }
  };


  // ============= layout provider ============================================

  jm.layout_provider = function(jm, options){
    this.opts = options;
    this.jm = jm;
  };

  jm.layout_provider.prototype={
    init:function(){
      logger.debug('layout.init');
    },
    reset:function(){
      logger.debug('layout.reset');
    },
    layout:function(){
      logger.debug('layout.layout');
      this.layout_direction();
      this.layout_offset();
    },

    layout_direction:function(){
      this._layout_direction_root();
    },

    _layout_direction_root:function(){
      var node = this.jm.mind.root;
      // logger.debug(node);
      var layout_data = null;
      if('layout' in node._data){
        layout_data = node._data.layout;
      }else{
        layout_data = {};
        node._data.layout = layout_data;
      }
      var children = node.children;
      var children_count = children.length;
      layout_data.direction = jm.direction.center;
      layout_data.side_index = 0;
      var i = children_count;
      var subnode = null;
      while(i--){
        subnode = children[i];
        if(subnode.direction == jm.direction.left){
          this._layout_direction_side(subnode,jm.direction.left, i);
        }else{
          this._layout_direction_side(subnode,jm.direction.right, i);
        }
      }
    },

    _layout_direction_side:function(node, direction, side_index){
      var layout_data = null;
      if('layout' in node._data){
        layout_data = node._data.layout;
      }else{
        layout_data = {};
        node._data.layout = layout_data;
      }
      if(node.children && node.children.length > 0){
        var children = node.children;
        var children_count = children.length;
        var i = children_count;
        while(i--){
          this._layout_direction_side(children[i], direction, i);
        }
      }
      layout_data.direction = direction;
      layout_data.side_index = side_index;
    },

    layout_offset:function(){
      var node = this.jm.mind.root;
      var layout_data = node._data.layout;
      layout_data.offset_x = 0;
      layout_data.offset_y = 0;
      layout_data.outer_width = 0;
      var children = node.children;
      var node_layout_outer_width = this._layout_offset_nodes_width(children)
      node_layout_outer_width += (children.length - 1) * 60;
      //logger.log('canvas总宽度==',node_layout_outer_width);
      var container_width = this.jm.view.e_panel.clientWidth;
      //logger.log('容器总宽度==',container_width);
      layout_data.outer_width = node_layout_outer_width;
      // this._root_offset(node_layout_outer_width);
      this._first_level_offset(children, node_layout_outer_width, container_width);

      // var i = children.length;
      // while (i--){
      //     var node_layout_outer_width = this._layout_outer_subnode(children[i]);
      //     layout_data.outer_width += node_layout_outer_width
      //     logger.log('各node宽度==',node_layout_outer_width);
      //     logger.log('总宽度==',layout_data.outer_width);
      // }
    },

    _layout_offset_nodes_width: function(nodes){
      var nodes_total_width = 0;
      var i = nodes.length;
      var node = null;
      var layout_data = null;
      while(i--){
        node = nodes[i]
        var node_width = this._layout_offset_subnodes_width(node)
        layout_data = node._data.layout;
        layout_data.outer_width = node_width;
        nodes_total_width += node_width;
      }
      return nodes_total_width;
    },

    // layout the x axis only
    _layout_offset_subnodes_width:function(parent){
      var total_width = 0;
      if(parent.children && parent.children.length > 0){
        var i = parent.children.length;
        var node_outer_width = 0;
        var layout_data = null;
        var node = null;
        var base_x = 0;
        var pd = null; // parent._data
        var max_node = 0;
        while(i--){
          node = parent.children[i];
          layout_data = node._data.layout;
          if(pd == null){
            pd = node.parent._data;
          }
          max_node = Math.max(max_node, node._data.view.width);

          if(node.children && node.children.length > 0){
            var j = node.children.length;
            var children_outer_width = 0;
            while(j--){
              children_outer_width = this._layout_offset_subnodes_width(node.children[j]);
              node_outer_width = Math.max(max_node, children_outer_width);
            }
          }

          max_node = Math.max(max_node, node_outer_width)
          if(!node.expanded){
            node_outer_width=0;
            this.set_visible(node.children,false);
          }
          node_outer_width = Math.max(max_node, node_outer_width);
          layout_data.outer_width = node_outer_width;
          base_x = base_x - node_outer_width - this.opts.vspace;
          total_width = Math.max(node._data.view.width, node_outer_width + this.opts.vspace);
        }
      }else{
        total_width = parent._data.view.width + this.opts.hspace;
      }
      return total_width;
    },

    // _root_offset:function(total_width){
    //     var node = this.jm.mind.root;
    //     var root_width = node._data.view.width;
    //     var root_height = node._data.view.height;
    //     node._data.view.abs_x = total_width / 2 - root_width / 2;
    //     node._data.view.abs_y = 0;
    // },

    _first_level_offset: function(nodes, total_width, container_width){
      logger.log(nodes.length, total_width, container_width);
      var node = null;
      nodes[0]._data.view.abs_x = Math.abs(container_width - total_width) / 2;
      nodes[0]._data.view.abs_y = nodes[0].parent._data.view.height + this.opts.hspace;
      var children = null;
      if(nodes[0].children && nodes[0].children instanceof Array && nodes[0].children.length > 0){
        children = nodes[0].children;
        nodes[0]._data.layout.outer_height = this._layout_offset_subnodes_height(children);
      }
      this._layout_offset_subnodes_height(children);
      for(let i = 1; i < nodes.length; i++){
        node = nodes[i];
        let base_x = nodes[i-1]._data.view.abs_x;
        let outer_width = nodes[i-1]._data.layout.outer_width;
        node._data.view.abs_x= base_x + outer_width + this.opts.hspace;
        node._data.view.abs_y= node.parent._data.view.height + this.opts.hspace;
        var children = null;
        if(node.children && node.children instanceof Array && node.children.length > 0){
          children = node.children;
          node._data.layout.outer_height = this._layout_offset_subnodes_height(children);
        }
      }
    },


    // layout the y axis only, for collapse/expand a node
    _layout_offset_subnodes_height:function(nodes){
      var total_height = 0;
      var nodes_count = nodes.length;
      var i = nodes_count;
      var node = null;
      var layout_data = null;
      var view_data = null;
      //logger.log(nodes[0].parent._data.view.abs_y)
      var base_y = nodes[0].parent._data.view.abs_y + nodes[0].parent._data.view.height || 0;
      var pd = null; // parent._data
      while(i--){
        var node_outer_height = 0;
        node = nodes[i];
        if('layout' in node._data){
          layout_data = node._data.layout;
        }else{
          layout_data = {};
          node._data.layout = layout_data;
        }
        if(pd == null){
          pd = node.parent._data;
        }
        view_data = node._data.view;

        layout_data.outer_height = node_outer_height;
        console.log(pd.view.abs_x, '父节点abs_x');
        view_data.abs_x = pd.view.abs_x + this.opts.vspace;
        view_data.abs_y = base_y + this.opts.itemspace;
        if(node.children && node.children.length > 0){
          node_outer_height = this._layout_offset_subnodes_height(node.children);
        }
        if(!node.expanded){
          node_outer_height = node._data.view.height;
        }else{
          node_outer_height = node_outer_height + node._data.view.height + node.children.length * this.opts.itemspace;
        }
        base_y = base_y + node_outer_height + this.opts.itemspace;
        total_height += node_outer_height;
      }
      if(nodes_count>1){
        total_height += this.opts.itemspace * (nodes_count-1);
      }
      return total_height;
    },

    get_node_offset:function(node){

    },

    get_node_point:function(node){
      var view_data = node._data.view;
      var offset_p = node._data.layout;
      logger.log(offset_p)
      var p = {};
      p.x = offset_p.offset_x - view_data.width/2;
      p.y = offset_p.offset_y;
      //logger.log(p);
      return p;
    },

    get_node_point_in:function(node){
      var view_data = node._data.view;
      var p = {
        x: view_data.abs_x + view_data.width / 2,
        y: view_data.abs_y
      }
      return p;
    },

    get_node_point_out:function(node){
      var view_data = node._data.view;
      var p = {
        x: view_data.abs_x + view_data.width / 2,
        y: view_data.abs_y + view_data.height
      }
      return p;
    },

    get_subnode_point_in:function(node){
      var view_data = node._data.view;
      var p = {
        x: view_data.abs_x,
        y: view_data.abs_y + view_data.height/2
      }
      return p;
    },

    get_subnode_point_out:function(node){
      var view_data = node._data.view;
      var p = {
        x: view_data.abs_x + 16,
        y: view_data.abs_y + view_data.height
      }
      return p;
    },

    get_expander_point:function(node){
      var p = this.get_node_point_out(node);
      var ex_p = {};
      ex_p.x = p.x;
      ex_p.y = p.y - Math.ceil(this.opts.pspace/2);
      return ex_p;
    },

    toggle_node:function(node){
      if(node.isroot){
        return;
      }
      if(node.expanded){
        //logger.log('collapse')
        this.collapse_node(node);
      }else{
        //logger.log('expand')
        this.expand_node(node);
      }
    },

    expand_node:function(node){
      node.expanded = true;
      this.layout_offset()
      this.set_visible(node.children,true);
    },

    collapse_node:function(node){
      //logger.log(node)
      node.expanded = false;
      this.layout_offset()
      this.set_visible(node.children,false);
    },

    set_visible:function(nodes,visible){
      //logger.log(nodes)
      var i = nodes.length;
      if(i == 0){
        return;
      }
      var node = null;
      var layout_data = null;
      while(i--){
        node = nodes[i];
        layout_data = node._data.layout;
        if(node.expanded){
          this.set_visible(node.children,visible);
        }else{
          this.set_visible(node.children,false);
        }
        if(!node.isroot){
          node._data.layout.visible = visible;
        }
      }
      logger.log(this,'切换后的数据')
      var view = this.jm.view;
      var layout = this.jm.layout;
      // logger.log(view)
      //layout.layout_offset();
      view._show();
    },

    is_expand:function(node){
      return node.expanded;
    },

    is_visible:function(node){
      var layout_data = node._data.layout;
      if(('visible' in layout_data) && !layout_data.visible){
        return false;
      }else{
        return true;
      }
    },
  };


  // ============= view provider ==============================================

  jm.view_provider= function(jm, options){
    this.opts = options;
    this.jm = jm;
    this.layout = jm.layout;

    this.container = null;
    this.e_panel = null;
    this.e_nodes= null;
    this.e_canvas = null;

    this.canvas_ctx = null;
    this.size = {w:0,h:0};
  };

  jm.view_provider.prototype={
    init:function(){
      logger.debug('view.init');

      this.container = $i(this.opts.container) ? this.opts.container : $g(this.opts.container);
      if(!this.container){
        logger.error('the options.view.container was not be found in dom');
        return;
      }
      this.e_panel = $c('div');
      this.e_canvas = $c('canvas');
      this.e_nodes = $c('jmnodes');


      this.e_panel.className = 'jsmind-inner';
      this.e_panel.appendChild(this.e_canvas);
      this.e_panel.appendChild(this.e_nodes);

      this.container.appendChild(this.e_panel);
      this.init_canvas();
    },

    add_event:function(obj,event_name,event_handle){
      jm.util.dom.add_event(this.e_nodes,event_name,function(e){
        var evt = e || event;
        event_handle.call(obj,evt);
      });
    },

    load:function(){
      logger.debug('view.load');
      this.init_nodes();
    },

    get_binded_nodeid:function(element){
      if(element == null){
        return null;
      }
      var tagName = element.tagName.toLowerCase();
      if(tagName == 'jmnodes' || tagName == 'body' || tagName == 'html'){
        return null;
      }
      if(tagName == 'jmnode' || tagName == 'jmexpander'){
        return element.getAttribute('nodeid');
      }else{
        //return this.get_binded_nodeid(element.parentElement);
      }
    },

    is_expander:function(element){
      return (element.tagName.toLowerCase() == 'jmexpander');
    },

    is_jmnode:function(element){
      return (element.tagName.toLowerCase() == 'jmnode');
    },

    init_canvas:function(){
      var ctx = this.e_canvas.getContext('2d');
      this.canvas_ctx = ctx;
    },

    init_nodes_size:function(node){
      var view_data = node._data.view;
      view_data.width = view_data.element.clientWidth;
      view_data.height = view_data.element.clientHeight;
    },

    init_nodes:function(){
      var nodes = this.jm.mind.nodes;
      var doc_frag = $d.createDocumentFragment();
      for(var nodeid in nodes){
        this.create_node_element(nodes[nodeid],doc_frag);
      }
      this.e_nodes.appendChild(doc_frag);
      for(var nodeid in nodes){
        this.init_nodes_size(nodes[nodeid]);
      }
    },

    add_node:function(node){
      this.create_node_element(node,this.e_nodes);
      this.init_nodes_size(node);
    },

    create_node_element:function(node,parent_node){
      var view_data = null;
      if('view' in node._data){
        view_data = node._data.view;
      }else{
        view_data = {};
        node._data.view = view_data;
      }

      var d = $c('jmnode');
      if(node.isroot){
        d.className = 'root';
      }else{
        var d_e = $c('jmexpander');
        $t(d_e,'-');
        d_e.setAttribute('nodeid',node.id);
        d_e.style.visibility = 'hidden';
        parent_node.appendChild(d_e);
        view_data.expander = d_e;
      }
      if (!!node.topic) {
        if(this.opts.support_html){
          $h(d,node.topic);
        }else{
          $t(d,node.topic);
        }
      }
      d.setAttribute('nodeid',node.id);
      if(node.data.level != undefined){
        d.className = 'level' + node.data.level;
      }
      d.style.visibility='hidden';
      // logger.log(node.data, '自定义数据')
      this._reset_node_custom_style(d, node.data);

      parent_node.appendChild(d);
      view_data.element = d;
    },

    get_view_offset:function(){
      //logger.log('容器宽度===》',this.e_panel.clientWidth);
      var _x = (this.e_panel.clientWidth )/2;
      var _y = 20;
      return{x:_x, y:_y};
    },

    get_parent_offset: function(node){
      var parent_view = node.parent._data.view;
      var _x = parent_view.abs_x;
      var _y = parent_view.abs_y;
      return {x: _x, y: _y};
    },

    _show:function(){
      this.show_nodes();
      var nodes = this.jm.mind.nodes;
      var root = this.jm.mind.root;
      var data_outer_width = root._data.layout.outer_width;
      var nodes_height = 0;
      for(var nodeId in this.jm.mind.nodes){
        var view_data = nodes[nodeId]._data.view;
        nodes_height = Math.max(view_data.abs_y + view_data.height, nodes_height);
      }
      if(this.e_panel.clientWidth >= data_outer_width){
        this.e_canvas.width = this.e_panel.clientWidth;
      }else{
        this.e_canvas.width = data_outer_width + Math.abs(data_outer_width - this.e_panel.clientWidth);
      }
      this.e_canvas.height = nodes_height;
      this.e_nodes.style.width = this.e_panel.clientWidth+'px';
      this.e_nodes.style.height = nodes_height+'px';
      this.show_lines();
    },

    show:function(keep_center){
      logger.debug('view.show');
      this.expand_size();
      this._show();
    },

    expand_size:function(){
      // logger.log(this.e_panel.clientWidth)
      // logger.log(this.e_panel.clientHeight)
    },

    show_nodes:function(){
      var nodes = this.jm.mind.nodes;
      var node = null;
      var node_element = null;
      var expander = null;
      var p = null;
      var p_expander= null;
      var expander_text = '-';
      var view_data = null;
      p = this.get_view_offset();
      for(var nodeid in nodes){
        node = nodes[nodeid];
        // logger.log(node)
        view_data = node._data.view;
        node_element = view_data.element;
        expander = view_data.expander;
        if(node.isroot){
          var offset = node._data.layout;
          view_data.abs_x = p.x - view_data.width / 2;
          view_data.abs_y = p.y;
        }

        if(!this.layout.is_visible(node)){
          node_element.style.display = 'none';
          expander.style.display = 'none';
          continue;
        }

        node_element.style.left = (view_data.abs_x) + 'px';
        node_element.style.top = (view_data.abs_y) + 'px';
        node_element.style.display = '';
        node_element.style.visibility = 'visible';

        if(!node.isroot && node.children.length>0){
          //expander_text = node.expanded?'-':'+';
          if(node.expanded){
            expander.className = 'unfolded'
          }else{
            expander.className = 'folded'
          }
          p_expander= this.layout.get_expander_point(node);
          expander.style.left = (view_data.abs_x + view_data.width + 5) + 'px';
          expander.style.top = (view_data.abs_y + view_data.height / 2 - 8) + 'px';
          expander.style.color = '#fff'
          expander.style.display = '';
          expander.style.visibility = 'visible';
          //logger.log(expander.style)
          //$t(expander,expander_text);
        }
        // hide expander while all children have been removed
        if(!node.isroot && node.children.length==0){
          expander.style.display = 'none';
          expander.style.visibility = 'hidden';
        }
      }
    },

    _reset_node_custom_style:function(node_element, node_data){
      if('backgroundColor' in node_data){
        node_element.style.backgroundColor = node_data['backgroundColor'];
      }
      if('foreground-color' in node_data){
        node_element.style.color = node_data['foreground-color'];
      }
      if('width' in node_data){
        node_element.style.width = node_data['width']+'px';
      }
      if('height' in node_data){
        node_element.style.height = node_data['height']+'px';
      }
      if('font-size' in node_data){
        node_element.style.fontSize = node_data['font-size']+'px';
      }
      if('font-weight' in node_data){
        node_element.style.fontWeight = node_data['font-weight'];
      }
      if('font-style' in node_data){
        node_element.style.fontStyle = node_data['font-style'];
      }
      if('background-image' in node_data) {
        var backgroundImage = node_data['background-image'];
        if (backgroundImage.startsWith('data') && node_data['width'] && node_data['height']) {
          var img = new Image();

          img.onload = function() {
            var c = $c('canvas');
            c.width = node_element.clientWidth;
            c.height = node_element.clientHeight;
            var img = this;
            if(c.getContext) {
              var ctx = c.getContext('2d');
              ctx.drawImage(img, 2, 2, node_element.clientWidth, node_element.clientHeight);
              var scaledImageData = c.toDataURL();
              node_element.style.backgroundImage='url('+scaledImageData+')';
            }
          };
          img.src = backgroundImage;

        } else {
          node_element.style.backgroundImage='url('+backgroundImage+')';
        }
        node_element.style.backgroundSize='99%';

        if('background-rotation' in node_data){
          node_element.style.transform = 'rotate(' + node_data['background-rotation'] + 'deg)';
        }

      }
    },

    clear_node_custom_style:function(node){
      var node_element = node._data.view.element;
      node_element.style.backgroundColor = "";
      node_element.style.color = "";
    },

    clear_lines:function(canvas_ctx){
      var ctx = canvas_ctx || this.canvas_ctx;
      jm.util.canvas.clear(ctx,0,0,this.size.w,this.size.h);
    },

    show_lines:function(canvas_ctx){
      // this.clear_lines(canvas_ctx);
      var nodes = this.jm.mind.nodes;
      var node = null;
      var pin = null;
      var pout = null;
      for(var nodeid in nodes){
        node = nodes[nodeid];
        if(!!node.isroot){continue;}
        if(('visible' in node._data.layout) && !node._data.layout.visible){continue;}
        if(node.parent.isroot){
          pin = this.layout.get_node_point_in(node);
          pout = this.layout.get_node_point_out(node.parent);
          this.draw_line(pout,pin,canvas_ctx);
        }else{
          pin = this.layout.get_subnode_point_in(node);
          pout = this.layout.get_subnode_point_out(node.parent);
          this.draw_subnode_line(pout,pin,canvas_ctx);
        }

      }
    },

    draw_line:function(pin,pout,canvas_ctx){
      var ctx = canvas_ctx || this.canvas_ctx;
      ctx.strokeStyle = this.opts.line_color;
      ctx.lineWidth = this.opts.line_width;
      ctx.lineCap = 'round';
      jm.util.canvas.bezierto(
        ctx,
        pin.x,
        pin.y,
        pout.x,
        pout.y);
    },

    draw_subnode_line:function(pin,pout,canvas_ctx){
      var ctx = canvas_ctx || this.canvas_ctx;
      ctx.strokeStyle = this.opts.line_color;
      ctx.lineWidth = this.opts.line_width;
      ctx.lineCap = 'round';

      jm.util.canvas.quadraticto(
        ctx,
        pin.x,
        pin.y,
        pout.x,
        pout.y);
    },
  };


  // quick way
  jm.show = function(options,mind){
    var _jm = new jm(options);
    _jm.show(mind);
    return _jm;
  };

  // export default jm

  // export jsmind
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    logger.log('module')
    module.exports = jm;
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    logger.log('amd cmd')
    define(function() { return jm; });
  } else {
    logger.log('$w.jm')
    $w.jsMind = jm;
  }
})(typeof window !== 'undefined' ? window : global)
