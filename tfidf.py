import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
import re
import jieba
import jieba.analyse
 

df = pd.read_json("模組三_海岸領域.json")
column_names = ['text']
df.drop_duplicates(subset=column_names, keep='first', inplace=True)
freq = []

def stopwordslist(filepath):  
    stopwords = [line.strip() for line in open(filepath, 'r', encoding='utf-8').readlines()]  
    return stopwords  

# 搜尋方式 向四度比對，完全比對，根據doc tfidf ，算慈換慈之間的相似度，月向的慈越大
# 對句子進行分詞  
def seg_sentence(sentence):  
    sentence_seged = jieba.cut(sentence.strip())  
    stopwords = stopwordslist('stop.txt')  # 這裏加載停用詞的路徑  
    outstr = ''  
    for word in sentence_seged:  
        if word not in stopwords:  
            if word != '\t':  
                outstr += word  
                outstr += " "   #再次組合成【帶空格】的串
    print(outstr)
    return outstr 


def cut_word(text):
    jiebaword = jieba.cut(text,HMM=False)
    stopwords = stopwordslist('stop.txt')  # 這裏加載停用詞的路徑  
    outstr = ''  
    for word in jiebaword:  
        if word not in stopwords:  
            if word != '\t':  
                outstr += word  
                outstr += " "   #再次組合成【帶空格】的串
    print(outstr)
    return outstr
for i in df['text']:
    try:
        s = re.sub(r'[^\u4e00-\u9fa5]', '', str(i))
        a = cut_word(s)
        
        freq.append(a)
    except:
        print(i)

def tfidf_method(freq,input):
    vectorizer = TfidfVectorizer(smooth_idf=True)
    tfidf = vectorizer.fit_transform(freq)
    result = pd.DataFrame(tfidf.toarray(), columns = vectorizer.get_feature_names())
    print('Scikit-Learn:')
    resultT = result.T
    resultT.columns = input
    print(resultT)
    resultT.to_excel('模組三_data.xlsx', sheet_name='sheet1', index=True)
    
def tf_method(freq,input):
    tf = CountVectorizer()
    tfidf = tf.fit_transform(freq)
    result = pd.DataFrame(tfidf.toarray(), columns = tf.get_feature_names())
    print('Scikit-Learn:')
    resultT = result.T
    resultT.columns = input
    print(resultT)
    resultT.to_excel('模組三_tfdata_1102.xlsx', sheet_name='sheet1', index=True)

def idf_method(freq,input):
    vectorizer = TfidfVectorizer(sublinear_tf=False, stop_words=None, token_pattern="(?u)\\b\\w+\\b", smooth_idf=True, norm=None )  
    X = vectorizer.fit_transform(freq)
    r = pd.DataFrame(X.toarray(),columns=vectorizer.get_feature_names(), index=freq)
    print("IDF")
    result= pd.DataFrame([vectorizer.idf_], columns=vectorizer.get_feature_names())
    print(result)
    result.to_excel('模組三_idfdata.xlsx', sheet_name='sheet1', index=True)
# print(freq)
tf_method(freq,df['input'])