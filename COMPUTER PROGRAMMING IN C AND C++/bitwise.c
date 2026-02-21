#include <stdio.h>

int main() {
	int a,b;
	printf("ENTER THE FIRST NUMBER: ");
	scanf("%d",&a);
	printf("ENTER THE SECOND NUMBER: ");
	scanf("%d",&b);
	printf("a=%d,b=%d\n",a,b);
	printf("a&b=%d\n",a&b);
	printf("a|b=%d\n",a|b);
	printf("a^b=%d\n",a^b);
	printf("~a=%d\n",a=~a);
	printf("b<<1=%d\n",b<<1);
	printf("b>>1=%d\n",b>>1);
	return 0;
}
