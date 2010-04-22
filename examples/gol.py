from pyvascript import JavaScript

@JavaScript
def StartGoL():
    window.gol = GoL.new()

@JavaScript
class GoL(object):
    def __init__(self):
        self.width = 75
        self.height = 75
        self.canvas = document.getElementById('canvas').getContext('2d')
        self.canvas.fillStyle = 'rgb(0, 0, 0)'
        self.grid = Array.new(self.width*self.height)
        for i in range(self.width*self.height):
            self.grid[i] = Math.random() > 0.5
        setInterval('window.gol.iter()', 250)
        self.draw()
    def get(self, x, y):
        return self.grid[((x + self.width) % self.width) + ((y + self.height) % self.height) * self.width]
    def iter(self):
        toDie = Array.new(0)
        toLive = Array.new(0)
        for x in range(0, self.width):
            for y in range(0, self.height):
                count = 0
                if self.get(x-1, y-1):
                    count += 1
                if self.get(x, y-1):
                    count += 1
                if self.get(x+1, y-1):
                    count += 1
                if self.get(x-1, y):
                    count += 1
                if self.get(x+1, y):
                    count += 1
                if self.get(x-1, y+1):
                    count += 1
                if self.get(x, y+1):
                    count += 1
                if self.get(x+1, y+1):
                    count += 1
                
                if self.get(x, y):
                    if count < 2:
                        toDie[toDie.length] = x + y*self.width
                    elif count > 3:
                        toDie[toDie.length] = x + y*self.width
                else:
                    if count == 3:
                        toLive[toLive.length] = x + y*self.width
        
        for i in range(toDie.length):
            self.grid[toDie[i]] = False
        for i in range(toLive.length):
            self.grid[toLive[i]] = True
        
        self.draw()
    def draw(self):
        i = 0
        for x in range(0, self.width*10, 10):
            for y in range(0, self.height*10, 10):
                if self.grid[i]:
                    self.canvas.fillRect(x, y, x+10, y+10)
                else:
                    self.canvas.clearRect(x, y, x+10, y+10)
                i += 1

def main():
    print """<html>
<script language="JavaScript">
%s
</script>
<body onLoad="StartGoL()">
    <canvas id="canvas" width="750" height="750"></canvas>
</body>
</html>""" % (str(StartGoL)+str(GoL))


if __name__ == "__main__":
    main()
