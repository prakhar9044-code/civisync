def func(a,b,c=10,*args,d=20,e=30,**kwargs):
    print("a=",a)
    print("b=",b)
    print("c=",c)
    print("args=",args)
    print("d=",d)
    print("e=",e)
    print("kwargs=",kwargs)
# MINIMUM REQUIRED A,B
func(1,2)
# OVERRIDE DEFAULT
func(1,2,99)
# WITH ARGS
func(1,2,3,4,5)
# WITH KEYWORD ONLY
func(1,2,3,d=200,e=300)
# WITH KWARGS
func(1,2,x=10,y=20)