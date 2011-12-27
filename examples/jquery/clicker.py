@JSVar("jQuery")
def ready():
    jQuery('h1').click(on_click)

@JSVar("jQuery", "Math.random", "Math.floor")
def on_click():
    if jQuery('#when_clicked').html():
        r = Math.floor(Math.random() * 255)
        g = Math.floor(Math.random() * 255)
        b = Math.floor(Math.random() * 255)
        color = "rgb(%d, %d, %d)" %(r,g,b)
        jQuery('#when_clicked').attr('style', 'background-color: ' + color)
    else:
        jQuery('#when_clicked').html("you clicked it!")

jQuery(ready)
