#include <stdio.h>
int main()
{
	int n,i,count;
	printf("ENTER A NUMBER TO BE CHECKED:");
	scanf("%d",&n);
	for(i=2;i<n;i++)
	{
		if(n%i==0)
		{
			count=1;
			break;
		}
	}
	if (count==1)
	{
		printf("PRIME");
	}else {
		printf("NOT PRIME");
	}
	return 0;
}
