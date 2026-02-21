//WAP TO ENTER THE BASIC SALARY OF A PERSON AND HIS YEARS OF HIS SERVICE AND CALCULATE AND DISPLAY THE GROSS SALARY IF H
//HIS YEARS OF SERVICE >=10 THEN GIVE 20% BONUS ELSE 10% BONUS 
#include <stdio.h>
int main()
{
	int years,salary;
	printf("ENTER YOUR YEARS OF SERVICE: ");
	scanf("%d",&years);
	printf("ENTER YOUR BASIC SALARY: ");
	scanf("%d",&salary);
	if (years>=10)
	{
		int gross_sal=salary+(0.2*salary);
		printf("YOUR GROSS SALARY IS: %d",gross_sal);
	}
	else 
	{
		int gross_sal=salary+(0.1*salary);
		printf("YOUR GROSS SALARY IS: %d",gross_sal);
	}
	return 0;
}
