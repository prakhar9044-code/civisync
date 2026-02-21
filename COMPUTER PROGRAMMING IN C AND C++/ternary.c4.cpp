#include <stdio.h>
int main() 
{
	int n;
	printf("ENTER A NUMBER OF YOUR CHOICE:");
	scanf("%d",&n);
	printf("%d",(n>0) ? ("POSITIVE NUMBER") : ("NEGATIVE NUMBER"));
//	printf("%d",x);
	return 0;
}
