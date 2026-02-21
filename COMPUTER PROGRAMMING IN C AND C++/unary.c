#include <stdio.h>
int main(void)
{
	int a,b;
	printf("ENTER ANY TWO VALUES OF YOUR CHOICE:");
	scanf("%d%d",&a,&b);
	int c=a++ + ++b;
	printf("THE VALUES ARE:%d,%d,%d",c,a,b);
}
