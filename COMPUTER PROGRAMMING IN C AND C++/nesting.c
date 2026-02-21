#include <stdio.h>
int main (void) 
{
	int a,b,c;
	printf("ENTER ANY THREE NUMBERS SEPARATED BY SPACES: ");
	scanf("%d %d %d",&a,&b,&c);
	if (a>b)
	{
		if(a>c)
		{
			printf("%d is the greatest number !",a);
		}
	}else if (b>c)
	{
		if (b>a)
		{
			printf("%d is the greatest number !",b);
		}
	}else 
	{
		printf("%d is the greatest number !",c);
	}
}
