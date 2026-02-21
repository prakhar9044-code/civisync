#include <stdio.h>
int main()
{
	char colour;
	printf("ENTER THE COLOUR OF THE TRAFFIC LIGHT: ");
	scanf("%c",&colour);
	if(colour=='g')
	{
		printf("GO !");
	}
	else if(colour=='y')
	{
		printf("WAIT !");
	}
	else if(colour=='r')
	{
		printf("STOP !");
	}
	else 
	{
		printf("Invalid Response !");
	}
	return 0;
}
