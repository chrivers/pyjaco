class Formater(object):
  """
  A very simple code formater that handles efficient concatenation and indentation of lines.
  """

  def __init__(self, indent_string ="  "):
    self.__buffer = []
    self.__indentation = 0
    self.__indent_string = indent_string
    self.__indent_temp = ""
    self.__string_buffer = ""

  def dedent(self):
    """
    Subtracts one indentation level.
    """
    self.__indentation -=1
    self.__indent_temp = self.__indent_string*self.__indentation

  def indent(self):
    """
    Adds one indentation level.
    """
    self.__indentation +=1
    self.__indent_temp = self.__indent_string*self.__indentation

  def write(self, s, indent=True ,newline=True):
    """
    Writes the string s to the buffer with indentation and a newline if not specified otherwise.
    """
    if indent:
      if newline:
        self.__buffer.append(self.__indent_temp + s + "\n")
      else:
        self.__buffer.append(self.__indent_temp + s)
    else:
      if newline:
        self.__buffer.append(s + "\n")
      else:
        self.__buffer.append(s)

  def read(self, size=None):
    """
    Returns a string representation of the buffer.
    """
    if size == None:
      s = self.__string_buffer + "".join(self.__buffer)
      self.__buffer = []
      self.__string_buffer = ""
      return s
    else:
      if len(self.__string_buffer) < size:
        self.__string_buffer += "".join(self.__buffer)
        self.__buffer = []
        if len(self.__string_buffer) < size:
          s, self.__string_buffer = self.__string_buffer, ""
          return s
        else:
          s, self.__string_buffer = self.__string_buffer[:size], self.__string_buffer[size:]
          return s
      else:
        s, self.__string_buffer = self.__string_buffer[:size], self.__string_buffer[size:]
        return s

