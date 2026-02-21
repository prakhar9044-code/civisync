#include <stdio.h>
int main() {
	int i,n;
	printf("ENTER ANY NUMBER:");
	scanf("%d",&n);
	while (i<=100)
	{
		printf("%d x %d=%d\n",n,i,n*i);
		i++;
	}
	return 0;
}
