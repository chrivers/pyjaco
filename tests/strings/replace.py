
for txt in ["the quick brown fox jumped over thethe lazy dog the",
            "thethethethe",
            "the word t-h-e does not appear here",
            "the line here starts with the word",
            "this line ends with the word the"]:
    print txt.replace("the", "a")
    for count in [-1, 0, 1, 2, 3, 4, 50]:
        print txt.replace("the", "a", count)
