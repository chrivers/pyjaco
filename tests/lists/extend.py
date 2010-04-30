
list1 = [1,2,'f',44]
list2 = ['a',99,77]

list3 = list1[:]
list3.extend(list2)

for item in list3:
	print item
