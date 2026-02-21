#include <stdio.h>
int main()
{
	int n,i,sum=0;
	printf("ENTER ANY LIMIT FOR FINDING OUT THE SUM: ");
	scanf("%d",&n);
	for(i=0;i<=n;i++) {
		sum+=i;
//		printf("%d",sum);
//		break;
	}
	printf("%d",sum);
	return 0;
}


//if we write 0<i<10 then it will be printing an infinite loop as computer doesnt understands it and here the ending condition is not used properly
