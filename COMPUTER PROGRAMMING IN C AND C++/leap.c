#include <stdio.h>
int main()
{
	int year;
	printf("ENTER THE YEAR YOU WANT TO CHECK: ");
	scanf("%d",&year);
	switch(year%4==0 && year%100!=0 || year%400==0){
		case 1:
			printf("LEAP YEAR !");
			break;
		case 0:
			printf("NOT A LEAP YEAR !");
			break;
	}
	return 0;
}
