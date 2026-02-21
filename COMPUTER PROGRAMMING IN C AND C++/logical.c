#include <stdio.h>

int main() 
{
	int x,y,z;
	printf("ENTER ANY THREE NUMBERS OF YOUR CHOICE: ");
	scanf("%d%d%d",&x,&y,&z);
	int a=x||y&&z++;
	int b=x&&y||z++;
	int c=x||y ||z++;
	int d=z++||x&&y;
	int e=y||z++&&x;
	int f=y&&z++||x;
	printf("THE OUTPUTS ARE:\n%d\n%d\n%d\n%d\n%d\n%d",a,b,c,d,e,f);
	return 0;
}
