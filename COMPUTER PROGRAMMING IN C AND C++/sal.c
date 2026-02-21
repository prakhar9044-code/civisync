#include <stdio.h>
		
int main() {
	float sal,da,ta;
	printf("ENTER YOUR GROSS SALARY: ");
	scanf("%f",&sal);
	da=0.05*sal;
	ta=0.1*sal;
	float totsal=sal+da+ta;
	printf("THE TOTAL SALARY THAT YOU GET IS: %f",totsal);
	return 0;
}
