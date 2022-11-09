import pandas as pd
import jieba
from collections import Counter
import re
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules  
  
df = pd.read_json("模組三_海岸領域.json")
print(df.head(),len(df))
column_names = ['text']
df.drop_duplicates(subset=column_names, keep='first', inplace=True)
freq = []
for i in df['text']:
    try:
        s = re.sub(r'[.,"\'-?:!;()，...》《（）»›…」「>。？，」：！／、%“{}||”#_&]', '', str(i))
        jiebaa = jieba.lcut(s)
        freq.append(pd.Series(jiebaa).value_counts())
    except:
        print(i)
df['freq'] = freq
df.to_excel('data5tf.xlsx', sheet_name='sheet1', index=True)
print(df['freq'][0])



