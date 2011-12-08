import inspect
import pyjaco
from pyjaco.decorator import JSVar

@JSVar("items")
def get_toolbar():
    items = [
            {"text":'File', "menu": [
                {"text": 'Open...'},
                {"text": 'Save...'},
                '-',
                {"text": 'Close'}
                ]},
            {"text":'Edit', "menu": [
                {'text': 'Undo'},
                {'text': 'Redo'},
                '-',
                {'text': 'Copy'},
                '-',
                {'text': 'Delete selected objects'},
                '-',
                {'text': 'Options'},
                ]},
            {"text":'View', "menu": [
                {'text': 'Zoom best fit'},
                {'text': 'Zoom region'},
                {'text': 'Zoom in'},
                {'text': 'Zoom out'},
                '-',
                {'text': 'Fullscreen mode'},
                '-',
                {'text': 'Scene properties'},
                ]},
            {"text":'Problem', "menu": [
                {'text': 'Operate on nodes'},
                {'text': 'Operate on edges'},
                {'text': 'Operate on labels'},
                {'text': 'Postprocessor'},
                "-",
                {'text': 'Add'},
                "-",
                {'text': 'Select region'},
                {'text': 'Transform'},
                '-',
                {'text': 'Local Values'},
                {'text': 'Surface Integrals'},
                {'text': 'Volume Integrals'},
                {'text': 'Select by marker'},
                ]},
            {"text":'Tools', "menu": [
                {'text': 'Chart'},
                "-",
                {'text': 'Script editor'},
                {'text': 'Run script...'},
                {'text': 'Run command...'},
                '-',
                {'text': 'Report...'},
                {'text': 'Create video...'},
                ]},
            {"text":'Help', "menu": (
                {'text': 'Help', 'handler': menu_help},
                '-',
                {'text': 'About Mesh Editor', 'handler': menu_about},
                )},
            ]
    Toolbar({"renderTo": 'mesh-editor', "items": items})
    items = [
            { "icon": 'http://www.extjs.com/deploy/dev/examples/menu/list-items.gif', "cls": 'x-btn-icon',
                "handler": toolbar_mesh1,
            "tooltip": '<b>Draw Mesh I</b><br/>Show an example mesh' },
            { "icon": 'http://www.extjs.com/deploy/dev/examples/menu/list-items.gif', "cls": 'x-btn-icon',
                "handler": toolbar_mesh2,
            "tooltip": '<b>Draw Mesh II</b><br/>Show an example mesh' },
            { "icon": 'http://www.extjs.com/deploy/dev/examples/menu/list-items.gif', "cls": 'x-btn-icon',
                "handler": toolbar_mesh3,
            "tooltip": '<b>Draw Mesh III</b><br/>Show an example mesh' },
            ]
    Toolbar({"renderTo": 'mesh-editor', "items": items})

@JSVar("items")
def get_panel():
    items = {
            "renderTo": 'mesh-editor',
            "width": '200px',
            "title": 'Mesh',
            "html": "<canvas id='canvas' width='200' height='200'></canvas>",
            "collapsible": true
            }
    p = Panel(items)
    return p

def toolbar_mesh1(b, e):
    canvas = Canvas('canvas')
    canvas.fillStyle = 'rgb(255, 255, 255)'
    canvas.fillRect(0, 0, 200, 200)
    canvas.fillStyle = 'rgb(29, 65, 119)'
    canvas.fillText("Mesh I", 80, 10)
    canvas.strokeStyle = 'rgb(0, 255, 0)'
    canvas.beginPath()
    canvas.moveTo(10, 10)
    canvas.lineTo(20, 50)
    canvas.lineTo(50, 20)
    canvas.lineTo(100, 100)
    canvas.lineTo(10, 10)
    canvas.stroke()

def toolbar_mesh2(b, e):
    canvas = Canvas('canvas')
    canvas.fillStyle = 'rgb(255, 255, 255)'
    canvas.fillRect(0, 0, 200, 200)
    canvas.fillStyle = 'rgb(29, 65, 119)'
    canvas.fillText("Mesh II", 80, 10)
    canvas.strokeStyle = 'rgb(255, 0, 0)'
    canvas.beginPath()
    canvas.moveTo(100, 100)
    canvas.lineTo(200, 50)
    canvas.lineTo(50, 20)
    canvas.lineTo(100, 100)
    canvas.lineTo(100, 10)
    canvas.stroke()

def toolbar_mesh3(b, e):
    canvas = Canvas('canvas')
    canvas.fillStyle = 'rgb(255, 255, 255)'
    canvas.fillRect(0, 0, 200, 200)
    canvas.fillStyle = 'rgb(29, 65, 119)'
    canvas.fillText("Mesh III", 80, 10)
    canvas.strokeStyle = 'rgb(0, 0, 255)'
    canvas.beginPath()
    canvas.moveTo(50, 50)
    canvas.lineTo(100, 180)
    canvas.lineTo(20, 180)
    canvas.lineTo(20, 100)
    canvas.lineTo(50, 50)
    canvas.stroke()

def menu_about(e, t):
    info_box(js("About"), js("FEMhub Mesh Editor, (c) 2010 hp-FEM group at UNR"))

@JSVar("items")
def menu_help(e, t):
    items = {
        "activeTab": 2,
        "width": 600,
        "height": 250,
        "plain": True,
        "defaults": {"autoScroll": True},
        "items":[{
                "title": 'Introduction',
                "html": "This is the mesh editor.<p/><br/>Browse the tabs for more help."
            },{
                "title": 'Mesh',
                "html": "Create the mesh by adding points to the <b>canvas</b>."
            },{
                "title": 'Developing',
                "html": "Documentation:<br/><a href='http://www.extjs.com/deploy/dev/docs/'>ExtJS</a><br/><a href='http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html'>HTML5 Canvas</a>"
            },{
                "title": 'About',
                "html": "Developed by the <a href='http://hpfem.org/'>hp-FEM group</a> at UNR."
            }]
    }
    tabs2 = TabPanel(items)

    items = {
        "renderTo": 'mesh-editor-help',
        "layout": 'fit',
        "width": 500,
        "height": 300,
        "title": "Help",
        "items": tabs2
        }
    w = Window(items)
    w.show()

@JSVar("Ext")
def initialize():
    Ext.get(document.body).update("<div id='mesh-editor'></div><div id='mesh-editor-help'></div>")
    Ext.QuickTips.init()
    get_toolbar()
    get_panel()


#########################################################################
# End of the section that works both on the desktop and in JS.

# JS wrappers for Ext:

class ExtObject(object):

    @JSVar("self._obj")
    def __init__(self, args):
        self._obj = _new(eval(js("Ext." + self.__class__.__name__)), js(args))

    @JSVar("self._obj")
    def _js_(self):
        return self._obj

class Window(ExtObject):

    @JSVar("self._obj")
    def show(self):
        self._obj.show()

class Panel(ExtObject):
    pass

class TabPanel(ExtObject):
    pass

class Toolbar(ExtObject):
    pass

@JSVar("Ext")
def info_box(title, msg):
    Ext.MessageBox.show({
           "title": title,
           "msg": msg,
           "buttons": Ext.MessageBox.OK,
           "animEl": 'mb9',
           "icon": Ext.MessageBox.INFO,
        })

class Canvas(object):

    @JSVar("self._obj", "dom", "Ext", "G_vmlCanvasManager")
    def __init__(self, id):
        dom = Ext.getDom(js(id))
        if js(Ext.isIE):
            # This is needed for IE to emulate the canvas element:
            G_vmlCanvasManager.initElement(dom)
        self._obj = dom.getContext('2d')
        self._obj.clearRect(0, 0, 200, 200)

    @JSVar("self._obj")
    def fillRect(self, x1, y1, w, h):
        self._obj.fillStyle = js(self.fillStyle)
        self._obj.fillRect(js(x1), js(y1), js(w), js(h))

    @JSVar("self._obj")
    def fillText(self, text, x, y):
        self._obj.fillStyle = js(self.fillStyle)
        self._obj.fillText(js(text), js(x), js(y))

    @JSVar("self._obj")
    def beginPath(self):
        self._obj.strokeStyle = js(self.strokeStyle)
        self._obj.beginPath()

    @JSVar("self._obj")
    def moveTo(self, x, y):
        self._obj.moveTo(js(x), js(y))

    @JSVar("self._obj")
    def lineTo(self, x, y):
        self._obj.lineTo(js(x), js(y))

    @JSVar("self._obj")
    def stroke(self):
        self._obj.stroke()

##################################################
# Main code that translates the above to JS

def main():
    funcs = [
            ExtObject,
            Window,
            Panel,
            TabPanel,
            Toolbar,
            info_box,
            Canvas,

            menu_about,
            menu_help,
            get_toolbar,
            get_panel,
            toolbar_mesh1,
            toolbar_mesh2,
            toolbar_mesh3,
            initialize,
            ]
    source = ""
    for f in funcs:
        source += inspect.getsource(f) + "\n"
    js = pyjaco.compile_string(source)

    print """\
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if IE]><script type="text/javascript" src="http://explorercanvas.googlecode.com/svn/trunk/excanvas.js"></script><![endif]-->
  <link rel="stylesheet" type="text/css" href="http://www.extjs.com/deploy/dev/resources/css/ext-all.css">
  <script type="text/javascript" src="http://www.extjs.com/deploy/dev/adapter/ext/ext-base.js"></script>
  <script type="text/javascript" src="http://www.extjs.com/deploy/dev/ext-all.js"></script>
  <script language="JavaScript" src="../py-builtins.js"></script>
  <title id="page-title">Title</title>
  <script type="text/javascript">
  function _new(cls, args) { return new cls(args); }
%s
  Ext.onReady(initialize);
  </script>
</head>
<body></body>
</html>""" % (js)


if __name__ == "__main__":
    main()
