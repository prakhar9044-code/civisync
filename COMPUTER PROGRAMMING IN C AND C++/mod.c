#include <stdio.h>
int main(void)
{
	int a;
	printf("ENTER ANY NUMBER OF YOUR CHOICE:");
	scanf("%d",&a);
	int div=a/3;
	int mod=a%3;
	printf("EACH EQUAL PART:%d",div);
	printf("\nTHE LEFTOVER IS:%d",mod);
}
