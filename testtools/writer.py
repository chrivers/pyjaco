"""module with the Writer class that helps write colorfull output"""

class Writer(object):
    "Class wich helps to print in color and with alignment and width"    

    color_templates = (
        ("Black"       , "0;30"),
        ("Red"         , "0;31"),
        ("Green"       , "0;32"),
        ("Brown"       , "0;33"),
        ("Blue"        , "0;34"),
        ("Purple"      , "0;35"),
        ("Cyan"        , "0;36"),
        ("LightGray"   , "0;37"),
        ("DarkGray"    , "1;30"),
        ("LightRed"    , "1;31"),
        ("LightGreen"  , "1;32"),
        ("Yellow"      , "1;33"),
        ("LightBlue"   , "1;34"),
        ("LightPurple" , "1;35"),
        ("LightCyan"   , "1;36"),
        ("White"       , "1;37"),  )

    colors = dict(color_templates)
    
    c_normal = '\033[0m'
    
    c_color = '\033[%sm'
    
    def __init__(self, in_file = None):
        import sys
        self._line_wrap = False
        self._write_pos = 0
        self._file = in_file or sys.stdout
        if not (hasattr(self._file, 'isatty') and self._file.isatty()):
            # the stdout is not a terminal, this for example happens if the
            # output is piped to less, e.g. "bin/test | less". In this case,
            # the terminal control sequences would be printed verbatim, so
            # don't use any colors.
            self.write = self.normal_write
        elif sys.platform != "win32":
            # We are on *nix system we can use ansi
            self.write = self.ansi_write
        else:
            try:
                import colorama
                colorama.init(wrap=False)
                self._file = colorama.AnsiToWin32(self._file).stream
                self.write = self.ansi_write
            except ImportError:
                self.write = self.normal_write

    def write(self, text, color="", align="left", width=80):
        """
        Prints a text on the screen.

        It uses file.write(), so no readline library is necessary.

        color ... choose from the colors below, "" means default color
        align ... left/right, left is a normal print, right is aligned on the
                  right hand side of the screen, filled with " " if necessary
        width ... the screen width
        """

    def normal_write(self, text, color, align="left", width=80):
        "ignores color but uses alignment and width"
        _color = color
        if align == "right":
            if self._write_pos + len(text) > width:
                # we don't fit on the current line, create a new line
                self.write("\n")
            self.write(" " * (width - self._write_pos - len(text)))

        if self._line_wrap:
            if text != "" and text[0] != "\n":
                self._file.write("\n")

        self._file.write(text)
        self._file.flush()

        next_new_line = text.rfind("\n")

        if next_new_line == -1:
            self._write_pos += len(text)
        else:
            self._write_pos = len(text) - next_new_line - 1
        self._line_wrap = self._write_pos >= width
        self._write_pos %= width


    def ansi_write(self, text, color="", align="left", width=80):
        "Writes with color, alignment and width"
        return self.normal_write(
                text=(
                  "%s%s%s" % (
                    self.c_color % self.colors[color], 
                    text, 
                    self.c_normal
                    )
                  if color in self.colors
                  else text 
                  ),
                color=color,
                align=align,
                width=width
            )
