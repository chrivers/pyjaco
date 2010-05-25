from glob import glob
files = glob("*.py")
for file in files:
    print "Converting ", file
    f = open(file).read()
    f = f.replace("\t", " "*4)
    open(file, "w").write(f)
