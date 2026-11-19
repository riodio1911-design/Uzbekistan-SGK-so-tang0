import json,re
def grab(s,key):
    i=s.index(key)+len(key)
    while s[i] in ' =': i+=1
    return json.JSONDecoder().raw_decode(s,i)[0]
