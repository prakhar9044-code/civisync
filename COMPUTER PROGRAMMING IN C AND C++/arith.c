//WAP TO ENTER TWO NUBERS AND PERFORM ALL ARITHMETIC OPERATIONS
#include <stdio.h>
int main(void)
{
	int a,b;
	printf("ENTER THE FIRST NUMBER:");
	scanf("%d:",&a);
	printf("ENTER THE SECOND NUMBER:");
	scanf("%d:",&b);
	int sum=a+b;
	int diff=a-b;
	int prod=a*b;
	int div=a/b;
	int mod=a%b;
	printf("\nTHE SUM OF THE TWO NUMBERS IS:%d",sum);
	printf("\nTHE DIFFERENCE OF THE TWO NUMBER IS:%d",diff);
	printf("\nTHE PRODUCT OF THE TWO NUMBER IS:%d",prod);
	printf("\nTHE MODULUS OF THE TWO NUMBER IS:%d",mod);
	printf("\nTHE QUOTIENT IS:%d",div);
}
