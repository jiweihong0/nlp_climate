import pandas as pd

df = pd.read_json('模組三_海岸領域.json')
array = []
for i in df['freq']:
    array.append(list(i))
df['single'] = array
def samesum(p,q):
    same = 1
    if (p==q):
        return same
    else:
        for i in p:
            if i in q:
                same +=1
        return same
s1 = []
for i in df['single']:
    s = []
    for j in df['single']:
        s.append(int(samesum(i,j)))
    s1.append(s)
# df['singlecount'] = s1
# print(df['singlecount'][0:])

data = pd.DataFrame(s1,index=df['input'],columns=df['input'])
data.to_excel('data5tf.xlsx', sheet_name='sheet1', index=True)
print(data)