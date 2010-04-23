"""
This test only tests that Python code can be compiled using the py2js.

It doesn't test if the resulting javascript makes any sense.
"""

from py2js import JavaScript

@JavaScript
def f1(x):
    return x

@JavaScript
def f2(x):
    return x + 5

@JavaScript
def f3(x):
    a = x + 1
    return a - 5

@JavaScript
def f3b(x):
    a = x + 1
    a -= 5
    return a

@JavaScript
def f3c(x):
    a = x + 1
    a /= 5
    return a

@JavaScript
def f3d(x):
    a = x + 1
    a *= 5
    return a

@JavaScript
def f3e(x):
    a = x + 1
    a += 5
    return a

@JavaScript
def f4(x):
    if x:
        return 5
    else:
        return 6

@JavaScript
def f5(x):
    a = 1
    if x:
        a = a + 1
    else:
        a = a - 1
    return a

@JavaScript
def ifs1(x):
    a = 1
    if x:
        a = a + 1
        a *= 2
    else:
        a = a - 1
        a *= 4
    return a

@JavaScript
def ifs2(x):
    a = 1
    if x > 0:
        a = a + 1
        a *= 2
    else:
        a = a - 1
        a *= 4
    return a

@JavaScript
def ifs3(x):
    a = 1
    if x > 0:
        if x > 10:
            a = 3
        else:
            a = 4
    a = 5
    return a

@JavaScript
def ifs4(x):
    a = 1
    if x > 0:
        if x > 10:
            a = 3
        else:
            a = 4
    else:
        a = 5
    return a

@JavaScript
def loop1(x):
    a = 0
    for i in range(x):
        x
        a += i
    return a

@JavaScript
def tuple1(x):
    t = (x, x+1, x+3)
    a, b, c = t
    return a+b+c

@JavaScript
def is_on_the_left(c, a, b, pts_list):
   ax, ay = pts_list[a]
   bx, by = pts_list[b]
   cx, cy = pts_list[c]
   ux = float(bx - ax)
   uy = float(by - ay)
   vx = float(cx - ax)
   vy = float(cy - ay)
   return (ux*vy - uy*vx > 0)

@JavaScript
def criterion(a, b, c, pts_list):
   ax, ay = pts_list[a]
   bx, by = pts_list[b]
   cx, cy = pts_list[c]
   ux = float(ax - cx)
   uy = float(ay - cy)
   vx = float(bx - cx)
   vy = float(by - cy)
   len_u = sqrt(ux*ux + uy*uy)
   len_v = sqrt(vx*vx + vy*vy)
   return (ux*vx + uy*vy)/(len_u*len_v)

@JavaScript
def find_third_point(a, b, pts_list, edges):
    """
    Take a boundary edge (a,b), and in the list of points
    find a point 'c' that lies on the left of ab and maximizes
    the angle acb
    """
    found = 0
    minimum = exp(100)   #this is dirty
    c_index = -1
    pt_index = -1
    for c_point in pts_list:
        c_index += 1
        if c_index != a and c_index != b and is_on_the_left(c_index, a, b, pts_list):
            edge_intersects = \
                    edge_intersects_edges((a, c_index), pts_list, edges) or \
                    edge_intersects_edges((b, c_index), pts_list, edges)
            if not edge_intersects:
                crit = criterion(a, b, c_index, pts_list)
                if crit < minimum:
                    minimum = crit
                    pt_index = c_index
                    found = 1
    if found == 0:
        raise TriangulationError("ERROR: Optimal point not found in find_third_point().")
    return pt_index

@JavaScript
def lies_inside(c, bdy_edges):
   for edge in bdy_edges:
       a,b = edge
       if c == a or c == b: return False
   return True

@JavaScript
def is_boundary_edge(a, b, bdy_edges):
    """
    Checks whether edge (a, b) is in the list of boundary edges
    """
    for edge in bdy_edges:
        a0, b0 = edge
        if a == a0 and b == b0:
            return True
    return False

@JavaScript
def triangulate_af(pts_list, bdy_edges):
    """
    Create a triangulation using the advancing front method.
    """
    # create empty list of elements
    elems = []
    bdy_edges = bdy_edges[:]
    # main loop
    while bdy_edges != []:
        # take the last item from the list of bdy edges (and remove it)
        a,b = bdy_edges.pop()
        c = find_third_point(a, b, pts_list, bdy_edges)
        elems.append((a,b,c))
        if is_boundary_edge(c, a, bdy_edges):
            bdy_edges.remove((c,a))
        else:
            bdy_edges.append((a,c))
        if is_boundary_edge(b, c, bdy_edges):
            bdy_edges.remove((b,c))
        else:
            bdy_edges.append((c,b))
    return elems

@JavaScript
class TestClass(object):
    def __init__(self):
        alert('TestClass created')
        self.reset()

    def reset(self):
        self.value = 0

    def inc(self):
        alert(self.value)
        self.value += 1

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


@JavaScript
class Class1(object):

    def __init__(self):
        pass

    def test1(self):
        return 5

@JavaScript
class Class2(object):

    def test1(self):
        return 6

@JavaScript
class Class3(object):

    def test1(self, x):
        return self.test2(x)-1

    def test2(self, x):
        return 2*x
