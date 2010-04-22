from pyvascript import JavaScript

@JavaScript
class TestClass(object):
    count = 0
    def __init__(self):
        pass
    def next(self):
        self.count += 1
    def test(self):
        alert(self.count)

@JavaScript
def onCountClick(event):
    window.testObj.next()
    window.testObj.test()

@JavaScript
def helloWorld():
    window.testObj = TestClass.new()

    pushButton = YAHOO.widget.Button.new(
        {
            'label' : 'Hello, World!',
            'id' : 'pushButton',
            'container' : 'pushButtons'
        }
    )
    pushButton.on('click', onButtonClick)
    pushButton2 = YAHOO.widget.Button.new(
        {
            'label' : 'Hello, Dude!',
            'id' : 'pushButton2',
            'container' : 'pushButtons',
            'onclick' : {
                'fn' : onButtonClick,
                'obj' : 'Dude'
            }
        }
    )

    i = 1
    while i <= 3:
        YAHOO.widget.Button.new(
            {
                'label' : 'Hello ' + i + '!',
                'id' : 'pushButtonIter' + i,
                'container' : 'pushButtons',
                'onclick' : {
                    'fn' : onButtonClick,
                    'obj' : 'Person #' + i
                }
            }
        )
        i += 1

    YAHOO.widget.Button.new(
        {
            'label' : 'Count',
            'id' : 'pushButtonCount',
            'container' : 'pushButtons',
            'onclick' : {
                'fn' : onCountClick
            }
        }
    )

@JavaScript
def onButtonClick(event, target='World'):
    if target == 'World':
        target = 'Big Blue World'
    alert('Hello, ' + target + '!')

def main():
    print str(TestClass) + str(helloWorld) + str(onButtonClick) + str(onCountClick)

if __name__ == "__main__":
    main()
