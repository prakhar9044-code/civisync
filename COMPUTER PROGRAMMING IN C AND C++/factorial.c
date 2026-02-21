#include <stdio.h>
int main()
{
	int i=1,fact=1,n;
	printf("ENTER ANY RANGE :");
	scanf("%d",&n);
	do{
		fact=fact*i;
		i++;
	}while(i<=n);
	printf("%d",fact);
//	return 0;
}
