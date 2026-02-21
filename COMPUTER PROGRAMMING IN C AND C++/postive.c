#include <stdio.h>
int main()`
{
	int n;
	printf("ENTER ANY NUMBER OF YOUR CHOICE: ");
	scanf("%d",&n);
	if(n>0)
	{
		printf("IT'S A POSITIVE NUMBER !");
	}
	else if(n<0)
	{
		printf("IT'S A NEGATIVE NUMBER !");
	}
	else 
	{
		printf("IT'S A ZERO !");
	return 0;
}
}
