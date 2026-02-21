#include <stdio.h>

int main (void) {
	int a,b,c;
	printf("ENTER TWO NUMBERS WHICH YOU WANT TO SWAP: ");
	scanf("%d %d",&a,&b);
	c=a;
	a=b;
	b=c;
	printf("\nAFTER SWAPPING, THE VALUES OF A=%d and B=%d",a,b);
//	return 0;
}
