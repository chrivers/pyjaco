""" A formater module that keeps trac of indentation
"""
class Formater(object):
    """
    A very simple code formater that handles efficient concatenation and indentation of lines.
    """

    def __init__(self, indent_string="    "):
        self.__buffer = []
        self.__indentation = 0
        self.__indent_string = indent_string
        self.__indent_temp = ""
        self.__string_buffer = ""

    def dedent(self):
        """
        Subtracts one indentation level.
        """
        self.__indentation -= 1
        self.__indent_temp = self.__indent_string*self.__indentation

    def indent(self):
        """
        Adds one indentation level.
        """
        self.__indentation += 1
        self.__indent_temp = self.__indent_string*self.__indentation

    def write(self, text, indent=True, newline=True):
        """
        Writes the string text to the buffer with indentation and a newline if not specified otherwise.
        """
        if indent:
            self.__buffer.append(self.__indent_temp)
        self.__buffer.append(text)
        if newline:
            self.__buffer.append("\n")

    def read(self, size=None):
        """
        Returns a string representation of the buffer.
        """
        if size == None:
            text = self.__string_buffer + "".join(self.__buffer)
            self.__buffer = []
            self.__string_buffer = ""
            return text
        else:
            if len(self.__string_buffer) < size:
                self.__string_buffer += "".join(self.__buffer)
                self.__buffer = []
                if len(self.__string_buffer) < size:
                    text, self.__string_buffer = self.__string_buffer, ""
                    return text
                else:
                    text, self.__string_buffer = self.__string_buffer[:size], \
                        self.__string_buffer[size:]
                    return text
            else:
                text, self.__string_buffer = self.__string_buffer[:size], \
                    self.__string_buffer[size:]
                return text

