#include <stdio.h>
int main()
{
	int n,i=1;
	printf("ENTER A NUMBER TO BE CHECKED: ");
	scanf("%d",&n);
	int digit=0;
	int rev=0;
	while(n>0)
	{
		digit=n%10;
		rev=n*10+digit;
		n=n/10;
	}
	printf("%d",rev);
	return 0;
}
