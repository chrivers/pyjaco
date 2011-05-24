import py2js
from py2js.decorator import JavaScript, JSVar

from math import sqrt

def is_on_the_left(c, a, b, pts_list):
   ax, ay = pts_list[a]
   bx, by = pts_list[b]
   cx, cy = pts_list[c]
   ux = float(bx - ax)
   uy = float(by - ay)
   vx = float(cx - ax)
   vy = float(cy - ay)
   return (ux*vy - uy*vx > 0)

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

def find_third_point(a, b, pts_list, edges):
    """
    Take a boundary edge (a,b), and in the list of points
    find a point 'c' that lies on the left of ab and maximizes
    the angle acb
    """
    found = 0
    minimum = 10**8   #this is dirty
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

def lies_inside(c, bdy_edges):
   for edge in bdy_edges:
       a,b = edge
       if c == a or c == b: return False
   return True

def is_boundary_edge(a, b, bdy_edges):
    """
    Checks whether edge (a, b) is in the list of boundary edges
    """
    for edge in bdy_edges:
        a0, b0 = edge
        if a == a0 and b == b0:
            return True
    return False

def triangulate_af(pts_list, bdy_edges):
    """
    Create a triangulation using the advancing front method.
    """
    # create empty list of elements
    elems = []
    bdy_edges = bdy_edges[:]
    # main loop
    while len(bdy_edges) > 0:
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

def ccw(A, B, C):
    return (C[1]-A[1])*(B[0]-A[0]) > (B[1]-A[1])*(C[0]-A[0])

def intersect(A, B, C, D):
    return ccw(A, C, D) != ccw(B, C, D) and ccw(A, B, C) != ccw(A, B, D)

def two_edges_intersect(nodes, e1, e2):
    """
    Checks whether the two edges intersect.

    It assumes that e1 and e2 are tuples of (a_id, b_id) of ids into the nodes.
    """
    A = nodes[e1[0]]
    B = nodes[e1[1]]
    C = nodes[e2[0]]
    D = nodes[e2[1]]
    return intersect(A, B, C, D)

def edge_intersects_edges(e1, nodes, edges):
    """
    Returns True if 'e1' intersects any edge from 'edges'.
    """
    for i in range(len(edges)):
        e2 = edges[i]
        if e1[1] == e2[0] or e1[0] == e2[1]:
            continue
        if two_edges_intersect(nodes, e1, e2):
            return True
    return False

@JSVar("document", "canvas", "scale", "x0")
def start_triag():
    js_pre = document.getElementById('js_pre')
    setattr(js_pre, 'textContent', "start")
    canvas = document.getElementById('canvas').getContext('2d')
    canvas.fillText("Mesh", 100, 10)
    setattr(js_pre, 'textContent', "triag")
    setattr(js_pre, 'textContent', example1())
    nodes, edges, elems = example2()
    scale = 50
    x0 = 3
    canvas.strokeStyle = 'rgb(0, 0, 255)'

    for el in elems:
        canvas.beginPath()
        x, y = nodes[el[0]]
        canvas.moveTo(x*scale+x0, 200-y*scale)
        x, y = nodes[el[1]]
        canvas.lineTo(x*scale+x0, 200-y*scale)
        x, y = nodes[el[2]]
        canvas.lineTo(x*scale+x0, 200-y*scale)
        x, y = nodes[el[0]]
        canvas.lineTo(x*scale+x0, 200-y*scale)
        canvas.stroke()

    canvas.strokeStyle = 'rgb(0, 255, 0)'
    canvas.beginPath()
    x, y = nodes[0]
    canvas.moveTo(x*scale+x0, 200-y*scale)
    for n in nodes:
        x, y = n
        canvas.lineTo(x*scale+x0, 200-y*scale)
    x, y = nodes[0]
    canvas.lineTo(x*scale+x0, 200-y*scale)
    canvas.stroke()

def example1():
    nodes, edges, elems = example2()
    result = str(nodes) + "\n" + str(edges) + "\n" + str(elems)
    return result

def example2():
    nodes = [
            (0, 0),
            (1, 0),
            (2, 1),
            (2, 2),
            (1, 2),
            (0.5, 1.5),
            (0, 1),
            ]
    edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 0)]
    elems = triangulate_af(nodes, edges)
    return nodes, edges, elems


def main():
    funcs = [
            is_on_the_left,
            criterion,
            find_third_point,
            lies_inside,
            is_boundary_edge,
            triangulate_af,
            ccw,
            intersect,
            two_edges_intersect,
            edge_intersects_edges,
            example1,
            example2,
            start_triag,
            ]
    js = py2js.Compiler()
    for f in funcs:
       js.append_method(f, f.func_name)
    py_result = example1()

    print """<html>
<head>
<script language="JavaScript" src="../py-builtins.js"></script>
<script language="JavaScript">
  sqrt = Function(function(value) { return _int.__call__(Math.sqrt(value)); });
</script>
<script language="JavaScript">
%s
</script>
</head>
<body onLoad="start_triag()">
    <h1>Triangulation Demo</h1>
    Python output:<br/>
    <pre id="py_pre">%s</pre>
    JavaScript output:<br/>
    <pre id="js_pre"></pre>
    Canvas:<br/>
    <canvas id="canvas" width="200" height="200"></canvas>
    <br/>
    End of page.
</body>
</html>""" % (js, py_result)


if __name__ == "__main__":
    main()
