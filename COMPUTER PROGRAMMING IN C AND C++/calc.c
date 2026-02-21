#include <stdio.h>

int main(void) {
	int num1,num2,num3,num4;
	printf("ENTER ANYY FOUR NUMBERS OF YOUR CHOICE: ");
	scanf("%d%d%d%d",&num1,&num2,&num3,&num4);
	printf("\nYOU ENTERED THE NUMBERS SUCCESSFULLY !\n");
	int calc=num1+num2*num3-num4/num1;
	printf("THE CALCULATED OUTPUT IS: %d\n",calc);
	printf("\nTASK COMPLETED SUCCESSFULLY !");
	return 0;
}
