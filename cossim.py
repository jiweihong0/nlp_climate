import pandas as pd
import jieba
from collections import Counter
import re
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules  
  
df = pd.read_json("模組三_海岸領域.json")
column_names = ['text']
df.drop_duplicates(subset=column_names, keep='first', inplace=True)
freq = []

s = re.sub(r'[.,"\'-?:!;()，...》《（）»›…」「>。？，」：！／、%“{}||”#_【】]', '', df['text'][2])
aa = ""
aa+=s.split(',')[0]+" "
freq.append(aa)
# for i in df['text']:
#     try:
#         s = re.sub(r'[.,"\'-?:!;()，...》《（）»›…」「>。？，」：！／、%“{}||”#_【】]', '', str(i))
#         aa = ""
#         aa+=s.split(',')[0]
#         freq.append(aa)
#     except:
#         print(i)
# print(freq)
from sklearn.feature_extraction.text import CountVectorizer
import jieba

def cut_word(text):
    #進行中文分詞
    return " ".join(list(jieba.cut(text)))

def auto_chinese_text_count_demo(data1):
    print(data1)
    data_new = []
    for sent in data1:
        data_new.append(cut_word(sent))
    print(data_new)
    
    # print("句子分詞後：\n", data_new)
    
    # 1、實例化一個轉換器類
    transfer = CountVectorizer(stop_words = ["說","的"])#停頓詞應該預處理清理，這裡只是示範
    
    # 2、調用fit_transform
    # print(data_new)
    data_vector_value = transfer.fit_transform(data_new)
    # print(data_vector_value)
    a = data_vector_value.toarray()
    aa = pd.DataFrame(a,columns = data_new)
    print(len(aa))
    # print(a)
    # s1 = []
    # for i in a:
    #     s = []
    #     for j in a:
    #         s.append(cosine_distance1(i,j))
    #     s1.append(s)
    # data = pd.DataFrame(s1,index=df['input'],columns=df['input'])
    # print(data)
    # data.to_excel('data5.xlsx', sheet_name='sheet1', index=True)
    
    return None
from nltk.cluster.util import cosine_distance
def cosine_distance1(a,b):
    return cosine_distance(a,b)
    

auto_chinese_text_count_demo(freq)



