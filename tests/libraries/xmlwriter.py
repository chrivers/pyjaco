
class StringWriter(object):

	def __init__(self):
		self.contents = ''

	def write(self,text):
		self.contents += text

	def getContents(self):
		return self.contents

class XmlWriter(object):

	class Node(object):

		def __init__(self):
			pass

	class TextNode(Node):
	
		def __init__(self,text):
			self.text = text

		def write(self,writer,indent):
			writer.write(self.text)

	class Element(Node):
	
		def __init__(self,tag):
			self.tag = tag
			self.children = []
			self.attributes = {}
			self.hastext = False

		def addElement(self,tag):
			child = XmlWriter.Element(tag)
			self.children.append(child)
			return child

		def addTextNode(self,text):
			child = XmlWriter.TextNode(text)
			self.children.append(child)
			self.hastext = True
			return child

		def addAttribute(self,name,value):
			self.attributes[name] = value

		def write(self,writer,indent):
			if indent > 0:
				XmlWriter.indent(writer,indent)
			writer.write("<"+self.tag)
			for k in self.attributes:
				writer.write(" "+k+'="'+self.attributes[k]+'"')
			if len(self.children) == 0:
				writer.write(" />")
				return
			writer.write(">")
			for c in self.children:
				c.write(writer,indent+1)
			if not self.hastext:
				XmlWriter.indent(writer,indent)
			writer.write("</"+self.tag+">")

	@staticmethod
	def indent(writer,indent):
		writer.write("\n")
		for x in xrange(0,indent):
			writer.write("  ")

	def createRoot(self,tag):
		self.root = self.Element(tag)
		return self.root

	def write(self,writer):
		self.root.write(writer,0)
		
		
if __name__ == '__main__':
	w = XmlWriter()
	r = w.createRoot("foo")
	r1 = r.addElement("r1")
	r1.addAttribute("spam","eggs")
	r2 = r1.addElement("r2")
	r2.addAttribute("eggs","spam")
	r2.addTextNode("This is some text")
	s = StringWriter()
	w.write(s)
	print s.getContents()

