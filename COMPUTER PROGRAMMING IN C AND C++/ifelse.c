//WAP TO ENTER A NUMBER AND CAKCULATE THE SQUARE IF NUMBER IS EVEN AND CALCULATE THE CUBE IF ITS ODD
#include <stdio.h>
int main ()
{
	int n;
	printf("ENTER ANY NUMBER OF YOUR CHOICE: ");
	scanf("%d",&n);
	if(n%2==0)
	{
		printf("%d",n*n);
	}
	else 
	{
		printf("\n%d",n*n*n);
	}
	return 0;
}
