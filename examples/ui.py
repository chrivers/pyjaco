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
    _new(Ext.Toolbar, js({"renderTo": 'mesh-editor', "items": items}))
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
    _new(Ext.Toolbar, js({"renderTo": 'mesh-editor', "items": items}))

def get_panel():
    p = _new(Ext.Panel, js({
            "renderTo": 'mesh-editor',
            "width": '200px',
            "title": 'Mesh',
            "html": "<canvas id='canvas' width='200' height='200'></canvas>",
            "collapsible": true
            }))
    if Ext.isIE:
        # This is needed for IE to emulate the canvas element:
        G_vmlCanvasManager.initElement(Ext.getDom('canvas'))
    return p

def clickHandler():
    alert('Clicked on a menu item')

def toolbar_mesh1(b, e):
    canvas = Ext.getDom(js('canvas')).getContext(js('2d'))
    canvas.fillStyle = js('rgb(255, 255, 255)')
    canvas.fillRect(0, 0, 200, 200)
    canvas.fillStyle = js('rgb(29, 65, 119)')
    canvas.fillText(js("Mesh I"), 80, 10)
    canvas.strokeStyle = js('rgb(0, 255, 0)')
    canvas.beginPath()
    canvas.moveTo(10, 10)
    canvas.lineTo(20, 50)
    canvas.lineTo(50, 20)
    canvas.lineTo(100, 100)
    canvas.lineTo(10, 10)
    canvas.stroke()

def toolbar_mesh2(b, e):
    canvas = Ext.getDom(js('canvas')).getContext(js('2d'))
    canvas.fillStyle = js('rgb(255, 255, 255)')
    canvas.fillRect(0, 0, 200, 200)
    canvas.fillStyle = js('rgb(29, 65, 119)')
    canvas.fillText(js("Mesh II"), 80, 10)
    canvas.strokeStyle = js('rgb(255, 0, 0)')
    canvas.beginPath()
    canvas.moveTo(100, 100)
    canvas.lineTo(200, 50)
    canvas.lineTo(50, 20)
    canvas.lineTo(100, 100)
    canvas.lineTo(100, 10)
    canvas.stroke()

def toolbar_mesh3(b, e):
    canvas = Ext.getDom(js('canvas')).getContext(js('2d'))
    canvas.fillStyle = js('rgb(255, 255, 255)')
    canvas.fillRect(0, 0, 200, 200)
    canvas.fillStyle = js('rgb(29, 65, 119)')
    canvas.fillText(js("Mesh III"), 80, 10)
    canvas.strokeStyle = js('rgb(0, 0, 255)')
    canvas.beginPath()
    canvas.moveTo(50, 50)
    canvas.lineTo(100, 180)
    canvas.lineTo(20, 180)
    canvas.lineTo(20, 100)
    canvas.lineTo(50, 50)
    canvas.stroke()

def menu_about(e, t):
    Ext.MessageBox.show(js({
           "title": 'About',
           "msg": 'FEMhub Mesh Editor, (c) 2010 hp-FEM group at UNR',
           "buttons": Ext.MessageBox.OK,
           "animEl": 'mb9',
           "icon": Ext.MessageBox.INFO,
        }))

def menu_help(e, t):
    tabs2 = _new(Ext.TabPanel, js({
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
}))
    w = _new(Ext.Window, js({
                "renderTo": 'mesh-editor-help',
                "layout": 'fit',
                "width": 500,
                "height": 300,
                "title": "Help",
                "items": tabs2
                }))


    w.show()

def checkHandler():
    alert('Checked a menu item')

def initialize():
    Ext.get(document.body).update("<div id='mesh-editor'></div><div id='mesh-editor-help'></div>")
    Ext.QuickTips.init()
    get_toolbar()
    get_panel()


#########################################################################
# End of the section that is translated to JS.

import inspect

from py2js import convert_py2js


def main():
    funcs = [
            menu_about,
            menu_help,
            get_toolbar,
            get_panel,
            clickHandler,
            checkHandler,
            toolbar_mesh1,
            toolbar_mesh2,
            toolbar_mesh3,
            initialize,
            ]
    js = ""
    for f in funcs:
        obj_source = inspect.getsource(f)
        js += convert_py2js(obj_source) + "\n"

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
%s
  Ext.onReady(initialize);
  </script>
</head>
<body></body>
</html>""" % (js)


if __name__ == "__main__":
    main()
