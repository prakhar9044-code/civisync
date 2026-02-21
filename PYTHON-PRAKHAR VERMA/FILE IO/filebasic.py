# import os no need of this module right now as it helps us in importing the os module to ouyr python program which can be highly helpful in removing some data from a file.
word="learning"
with open("sample.txt","w+") as file:
    add_data=file.write("Hi everyone\nWe are learning File I/O\nusing Java\nI like programming in JAVA")
    data=file.read()
    if (data.find(word)!=-1):
        print("The word given by you is found")
        new_data=data.replace("JAVA","PYTHON")
        print(new_data)
    else:
        print("Word cannot be found as it doesn't exists in the file")