from py2js import JavaScript

@JavaScript
def get_menu1():
    items = [{text: 'Open...'},
            {text: 'Save...'},
            '-',
            {text: 'Close'}
            ]
    return _new(Ext.menu.Menu, to_js({id: 'basicMenu', items: items}))

@JavaScript
def get_menu3():
    items = (
            {'text': 'Help', 'handler': menu_help},
            '-',
            {'text': 'About Mesh Editor', 'handler': menu_about},
            )
    return _new(Ext.menu.Menu, to_js({id: 'basicMenu2', items: items}))

@JavaScript
def get_toolbar():
    items = [
            {text:'File', menu: get_menu1()},
            {text:'About', menu: get_menu3()},
            "-",
            { icon: 'http://www.extjs.com/deploy/dev/examples/menu/list-items.gif', cls: 'x-btn-icon',
                handler: toolbar_mesh1,
            tooltip: '<b>Draw Mesh I</b><br/>Show an example mesh' },
            { icon: 'http://www.extjs.com/deploy/dev/examples/menu/list-items.gif', cls: 'x-btn-icon',
                handler: toolbar_mesh2,
            tooltip: '<b>Draw Mesh II</b><br/>Show an example mesh' },
            { icon: 'http://www.extjs.com/deploy/dev/examples/menu/list-items.gif', cls: 'x-btn-icon',
                handler: toolbar_mesh3,
            tooltip: '<b>Draw Mesh III</b><br/>Show an example mesh' },
            ]
    return _new(Ext.Toolbar, to_js({renderTo: 'mesh-editor', items: items}))

@JavaScript
def get_panel():
    return _new(Ext.Panel, to_js({
                renderTo: 'mesh-editor',
                width: '200px',
                title: 'Mesh',
                html: "<canvas id='canvas' width='200' height='200'></canvas>",
                collapsible: true
                }))

@JavaScript
def clickHandler():
    alert('Clicked on a menu item')

@JavaScript
def toolbar_mesh1(b, e):
    canvas = document.getElementById('canvas').getContext('2d')
    canvas.fillText("Mesh I", 100, 10)
    canvas.fillStyle = 'rgb(255, 255, 255)'
    canvas.fillRect(0, 0, 200, 200)
    canvas.strokeStyle = 'rgb(0, 255, 0)'
    canvas.beginPath()
    canvas.moveTo(10, 10)
    canvas.lineTo(20, 50)
    canvas.lineTo(50, 20)
    canvas.lineTo(100, 100)
    canvas.lineTo(10, 10)
    canvas.stroke()

@JavaScript
def toolbar_mesh2(b, e):
    canvas = document.getElementById('canvas').getContext('2d')
    canvas.fillText("Mesh II", 100, 10)
    canvas.fillStyle = 'rgb(255, 255, 255)'
    canvas.fillRect(0, 0, 200, 200)
    canvas.strokeStyle = 'rgb(255, 0, 0)'
    canvas.beginPath()
    canvas.moveTo(100, 100)
    canvas.lineTo(200, 50)
    canvas.lineTo(50, 20)
    canvas.lineTo(100, 100)
    canvas.lineTo(100, 10)
    canvas.stroke()

@JavaScript
def toolbar_mesh3(b, e):
    canvas = document.getElementById('canvas').getContext('2d')
    canvas.fillText("Mesh III", 100, 10)
    canvas.fillStyle = 'rgb(255, 255, 255)'
    canvas.fillRect(0, 0, 200, 200)
    canvas.strokeStyle = 'rgb(0, 0, 255)'
    canvas.beginPath()
    canvas.moveTo(50, 50)
    canvas.lineTo(100, 180)
    canvas.lineTo(20, 180)
    canvas.lineTo(20, 100)
    canvas.lineTo(50, 50)
    canvas.stroke()

@JavaScript
def menu_about():
    Ext.MessageBox.show(to_js({
           title: 'About',
           msg: 'FEMhub Mesh Editor, (c) 2010 hp-FEM group at UNR',
           buttons: Ext.MessageBox.OK,
           animEl: 'mb9',
           icon: Ext.MessageBox.INFO,
        }))

@JavaScript
def menu_help():
    tabs2 = _new(Ext.TabPanel, to_js({
        activeTab: 2,
        width:600,
        height:250,
        plain:true,
        defaults:{autoScroll: true},
        items:[{
                title: 'Introduction',
                html: "This is the mesh editor.<p/><br/>Browse the tabs for more help."
            },{
                title: 'Mesh',
                html: "Create the mesh by adding points to the <b>canvas</b>."
            },{
                title: 'Developing',
                html: "Documentation:<br/><a href='http://www.extjs.com/deploy/dev/docs/'>ExtJS</a><br/><a href='http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html'>HTML5 Canvas</a>"
            },{
                title: 'About',
                html: "Developed by the <a href='http://hpfem.org/'>hp-FEM group</a> at UNR."
            }]
}))
    w = _new(Ext.Window, to_js({
                renderTo: 'mesh-editor-help',
                layout: 'fit',
                width: 500,
                height: 300,
                title: "Help",
                items: tabs2
                }))


    w.show()

@JavaScript
def checkHandler():
    alert('Checked a menu item')

@JavaScript
def initialize():
    Ext.get(document.body).update("<div id='mesh-editor'></div><div id='mesh-editor-help'></div>")
    Ext.QuickTips.init()
    get_toolbar()
    get_panel()

def main():
    funcs = [
            get_menu1,
            get_menu3,
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
        js += str(f) + "\n"

    print """\
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if IE]><script type="text/javascript" src="http://excanvas.freehostia.com/excanvas.js"></script><![endif]-->
  <link rel="stylesheet" type="text/css" href="http://www.extjs.com/deploy/dev/resources/css/ext-all.css">
  <script type="text/javascript" src="http://www.extjs.com/deploy/dev/adapter/ext/ext-base.js"></script>
  <script type="text/javascript" src="http://www.extjs.com/deploy/dev/ext-all.js"></script>
  <script language="JavaScript" src="../builtins.js"></script>
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
