# to check whether the user has passed or failed the examinations.
s1=int(input("Enter the marks of MATHEMATICS:"))
s2=int(input("Enter the marks of PHYSICS:"))
s3=int(input("Enter the marks of CHEMISTRY:"))
total=((s1+s2+s3)/300)*100
if total>=40 and s1>=33 and s2>=33 and s3>=33:
    print("YOU HAVE PASSED THE EXAMINATION !")

else: 
    print("YOU HAVE FAILED THE EXAMINATION !")